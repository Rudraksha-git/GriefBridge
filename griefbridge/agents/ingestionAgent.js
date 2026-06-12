import fs from 'fs';
import { parseChatExport, groupIntoChunks } from '../tools/chatParser.js';
import { processImage } from '../tools/imageTools.js';
import { processAudio } from '../tools/audioTools.js';
import { chunkText, storeMemories } from '../tools/memoryTools.js';
import { PDFParse } from 'pdf-parse';

/**
 * Main entry point: given a batch of uploaded files (with type info),
 * runs the right tool for each, chunks/embeds the output, and stores it
 * as Memory rows.
 *
 * files: [{ path, filename, kind: 'chat' | 'image' | 'audio', speakerLabel? }]
 *
 * Written as plain async functions rather than a full LangChain agent —
 * this is intentional for hackathon debuggability. If P1's orchestrator
 * needs these wrapped as LangChain tools, wrap runIngestion with
 * `new DynamicTool({ name: 'ingest', func: runIngestion, ... })` — the
 * logic itself doesn't need to change.
 */
export async function runIngestion({ userId, files }) {
  const results = [];

  for (const file of files) {
    try {
      let stored = 0;
      if (file.kind === 'chat') stored = await ingestChat(userId, file);
      else if (file.kind === 'image') stored = await ingestImage(userId, file);
      else if (file.kind === 'audio') stored = await ingestAudio(userId, file);
      else if (file.kind === 'document') stored = await ingestDocument(userId, file);
      else throw new Error(`Unknown file kind: "${file.kind}"`);

      results.push({ filename: file.filename, status: 'ok', chunksStored: stored });
    } catch (err) {
      console.error(`Ingestion failed for ${file.filename}:`, err);
      results.push({ filename: file.filename, status: 'error', error: err.message });
    }
  }

  return {
    totalStored: results.reduce((sum, r) => sum + (r.chunksStored || 0), 0),
    files: results,
  };
}

async function ingestChat(userId, file) {
  const buffer = fs.readFileSync(file.path);
  const messages = await parseChatExport(buffer, file.filename);
  const chunks = groupIntoChunks(messages);

  const items = chunks.map((chunk) => ({
    userId,
    content: `${chunk.sender}: ${chunk.text}`,
    type: 'chat',
    sourceFile: file.filename,
    metadata: {
      sender: chunk.sender,
      startTimestamp: chunk.startTimestamp,
      endTimestamp: chunk.endTimestamp,
    },
  }));

  return storeMemories(items);
}

async function ingestImage(userId, file) {
  const buffer = fs.readFileSync(file.path);
  const mimeType = file.filename.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
  const result = await processImage(buffer, file.filename, mimeType);

  await storeMemories([{ userId, ...result }]);
  return 1;
}

async function ingestAudio(userId, file) {
  const result = await processAudio(file.path, file.filename, file.speakerLabel);

  // Long voice memos get chunked too, same as chat/document text
  const textChunks = chunkText(result.content, 800, 100);

  const items = textChunks.map((chunk, i) => ({
    userId,
    content: chunk,
    type: 'audio',
    sourceFile: file.filename,
    metadata: { ...result.metadata, chunkIndex: i, totalChunks: textChunks.length },
  }));

  return storeMemories(items);
}

async function ingestDocument(userId, file) {
  const buffer = fs.readFileSync(file.path);
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();

  const textChunks = chunkText(result.text, 800, 100);

  const items = textChunks.map((chunk, i) => ({
    userId,
    content: chunk,
    type: 'text',
    sourceFile: file.filename,
    metadata: { chunkIndex: i, totalChunks: textChunks.length },
  }));

  return storeMemories(items);
}