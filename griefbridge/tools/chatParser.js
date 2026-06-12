import JSZip from 'jszip';

/**
 * Parses a WhatsApp or Telegram chat export (zip file Buffer) into a
 * normalized array of { sender, timestamp, text, source, type }.
 *
 * Pure JS / no external API — works entirely offline.
 */
export async function parseChatExport(zipBuffer, sourceLabel = 'chat') {
  const zip = await JSZip.loadAsync(zipBuffer);
  const fileNames = Object.keys(zip.files);

  const whatsappFile = fileNames.find((name) => /chat.*\.txt$/i.test(name));
  const telegramFile = fileNames.find((name) => /result\.json$/i.test(name));

  if (whatsappFile) {
    const text = await zip.files[whatsappFile].async('string');
    return parseWhatsApp(text, sourceLabel);
  }

  if (telegramFile) {
    const text = await zip.files[telegramFile].async('string');
    return parseTelegram(text, sourceLabel);
  }

  throw new Error(
    'No recognizable chat export found in zip (expected a WhatsApp "*chat*.txt" or Telegram "result.json")'
  );
}

/**
 * WhatsApp export formats (varies by phone/OS/locale):
 *   [12/03/2024, 7:42:11 PM] Papa: Beta, proud of you today
 *   12/03/24, 19:42 - Papa: Beta, proud of you today
 *
 * NOTE: assumes DD/MM/YYYY (Indian locale). If your test export uses
 * MM/DD/YYYY (US locale), swap the [d, m, y] destructure below to [m, d, y].
 */
const BRACKET_FORMAT =
  /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?\s*[APMapm]{0,2})\]\s+([^:]+):\s*(.*)$/;
const DASH_FORMAT =
  /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s+(\d{1,2}:\d{2}(?:\s*[APMapm]{2})?)\s*-\s*([^:]+):\s*(.*)$/;

function parseWhatsApp(text, sourceLabel) {
  const lines = text.split(/\r?\n/);
  const messages = [];
  let current = null;

  for (const line of lines) {
    const match = line.match(BRACKET_FORMAT) || line.match(DASH_FORMAT);

    if (match) {
      if (current) messages.push(current);
      const [, date, time, sender, body] = match;
      current = {
        sender: sender.trim(),
        timestamp: parseWhatsAppDate(date, time),
        text: body.trim(),
        source: sourceLabel,
        type: 'chat',
      };
    } else if (current) {
      // Multi-line message continuation
      current.text += '\n' + line;
    }
  }
  if (current) messages.push(current);

  return messages.filter(
    (m) =>
      m.text &&
      !/<Media omitted>|image omitted|video omitted|audio omitted|This message was deleted|sticker omitted/i.test(
        m.text
      )
  );
}

/**
 * Manual time parsing — avoids `new Date(string)` quirks with AM/PM and
 * locale-dependent string formats.
 */
function parseWhatsAppDate(date, time) {
  const [d, m, y] = date.split('/').map(Number);
  const year = y < 100 ? 2000 + y : y;

  const match = time.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([APap][Mm])?/);
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const second = match[3] ? parseInt(match[3], 10) : 0;
  const meridiem = match[4];

  if (meridiem) {
    const isPM = meridiem.toLowerCase() === 'pm';
    if (isPM && hour < 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
  }

  return new Date(year, m - 1, d, hour, minute, second).toISOString();
}

/**
 * Telegram export: result.json -> { name, type, id, messages: [...] }
 * Each message: { type: 'message', date, from, text }
 * `text` can be a string OR an array of strings/objects (for formatted text).
 */
function parseTelegram(jsonText, sourceLabel) {
  const data = JSON.parse(jsonText);
  const rawMessages = data.messages || [];

  return rawMessages
    .filter((m) => m.type === 'message' && m.text)
    .map((m) => ({
      sender: m.from || 'Unknown',
      timestamp: new Date(m.date).toISOString(),
      text: extractTelegramText(m.text),
      source: sourceLabel,
      type: 'chat',
    }))
    .filter((m) => m.text.trim().length > 0);
}

function extractTelegramText(text) {
  if (typeof text === 'string') return text;
  if (Array.isArray(text)) {
    return text.map((part) => (typeof part === 'string' ? part : part.text || '')).join('');
  }
  return '';
}

/**
 * Groups consecutive messages from the same sender into "conversation chunks".
 * This gives the embedding model richer context than single short messages
 * (e.g. "Beta how was the exam" + "Don't worry you'll do well" as ONE chunk).
 *
 * A new chunk starts when: the sender changes, OR the gap exceeds
 * `maxGapMinutes`, OR the chunk would exceed `maxChunkChars`.
 */
export function groupIntoChunks(messages, maxGapMinutes = 30, maxChunkChars = 1000) {
  const chunks = [];
  let current = null;

  for (const msg of messages) {
    const msgTime = new Date(msg.timestamp).getTime();

    if (
      current &&
      current.sender === msg.sender &&
      msgTime - current.lastTime <= maxGapMinutes * 60 * 1000 &&
      current.text.length < maxChunkChars
    ) {
      current.text += '\n' + msg.text;
      current.lastTime = msgTime;
      current.endTimestamp = msg.timestamp;
    } else {
      if (current) chunks.push(finalizeChunk(current));
      current = {
        sender: msg.sender,
        text: msg.text,
        startTimestamp: msg.timestamp,
        endTimestamp: msg.timestamp,
        lastTime: msgTime,
        source: msg.source,
        type: msg.type,
      };
    }
  }
  if (current) chunks.push(finalizeChunk(current));

  return chunks;
}

function finalizeChunk(chunk) {
  const { lastTime, ...rest } = chunk;
  return rest;
}