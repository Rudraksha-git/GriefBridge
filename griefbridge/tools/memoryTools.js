import { pipeline } from '@xenova/transformers';
import { prisma } from '../lib/prisma';

let embedderPromise = null;

/**
 * Lazily loads a local embedding model (runs once, cached for the process).
 * all-MiniLM-L6-v2 -> 384-dim vectors, ~25MB, runs on CPU.
 *
 * No API key, no OpenAI account needed. First call downloads the model
 * from the Hugging Face hub (one-time, needs internet access but no auth).
 */
function getEmbedder() {
  if (!embedderPromise) {
    embedderPromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embedderPromise;
}

/**
 * Converts text into a 384-dim embedding vector (plain array of floats).
 */
export async function embedText(text) {
  const model = await getEmbedder();
  const output = await model(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

/**
 * Splits long text into overlapping chunks suitable for embedding.
 * Default: ~500 chars per chunk, 50 char overlap (so context isn't
 * abruptly cut at chunk boundaries).
 */
export function chunkText(text, chunkSize = 500, overlap = 50) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    if (end === text.length) break;
    start = end - overlap;
  }

  return chunks;
}

/**
 * Embeds and stores ONE memory item in Postgres.
 * This is the replacement for "upsert to Pinecone" — the embedding is
 * stored directly as a Float[] column alongside the content.
 *
 * item: { userId, content, type, sourceFile, metadata }
 */
export async function storeMemory({ userId, content, type, sourceFile, metadata = {} }) {
  const embedding = await embedText(content);

  return prisma.memory.create({
    data: { userId, content, type, sourceFile, embedding, metadata },
  });
}

/**
 * Stores multiple memory items in sequence. Returns the count stored.
 */
export async function storeMemories(items) {
  let count = 0;
  for (const item of items) {
    await storeMemory(item);
    count++;
  }
  return count;
}

/**
 * Cosine similarity between two equal-length vectors.
 */
function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-10);
}

/**
 * Semantic search: embeds the query, fetches all memories for the user,
 * scores each by cosine similarity, returns the top-k (highest first).
 *
 * This is the replacement for a Pinecone query. For hackathon-scale data
 * (hundreds to low-thousands of memories) scoring in JS is plenty fast —
 * no dedicated vector DB needed. If this ever becomes a bottleneck with
 * real production data, swap this function's body for a pgvector query
 * (`ORDER BY embedding <=> $1 LIMIT $2`) without touching any callers.
 */
export async function searchMemories(userId, query, topK = 5) {
  const queryEmbedding = await embedText(query);

  const memories = await prisma.memory.findMany({ where: { userId } });

  const scored = memories.map((mem) => ({
    ...mem,
    score: cosineSimilarity(queryEmbedding, mem.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
}