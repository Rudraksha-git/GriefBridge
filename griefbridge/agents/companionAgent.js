import { searchMemories } from '../tools/memoryTools';

const CONFIDENCE_THRESHOLD = 0.35;
const TOP_K = 5;

export async function askCompanion(userId, question) {
  // 1. Local Vector Search (Runs offline via Prisma & Xenova)
  const results = await searchMemories(userId, question, TOP_K);
  const relevant = results.filter((r) => r.score >= CONFIDENCE_THRESHOLD);

  if (relevant.length === 0) {
    return {
      answer: "I don't have any memories that speak to this directly. Try asking about a specific topic, person, or time period that might be reflected in the chats, photos, or voice notes you've uploaded.",
      sources: [],
      grounded: false,
    };
  }

  // 2. Format the context from your local database
  const context = relevant
    .map((r, i) => `[Source ${i + 1} | ${r.type} | ${r.sourceFile || 'unknown'}]\n${r.content}`)
    .join('\n\n---\n\n');

  const systemPrompt = "You are a Legacy Companion. You help a grieving family member by answering questions about their loved one, using ONLY the memory excerpts provided below. Speak warmly but stay grounded in the source material — do not invent details. Mention which source number it came from, e.g. '(Source 2)'.\n\nCONTEXT:\n" + context;

  try {
    // 3. Call your Custom Local API (Ollama running Phi-3 or Llama 3)
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'phi3', // Make sure you ran `ollama run phi3` in your terminal!
        prompt: systemPrompt + "\n\nQuestion: " + question,
        stream: false,
        options: { temperature: 0.1 }
      })
    });

    if (!response.ok) throw new Error("Local API unreachable");
    
    const data = await response.json();

    return {
      answer: data.response.trim(),
      sources: relevant.map((r) => ({
        id: r.id,
        type: r.type,
        sourceFile: r.sourceFile,
        excerpt: r.content.slice(0, 200),
        score: Number(r.score.toFixed(3)),
        metadata: r.metadata,
      })),
      grounded: true,
    };

  } catch (error) {
    console.error("Local RAG Generation Error:", error);
    return {
      answer: "The memory vault is currently offline. Please ensure your local API is running.",
      sources: [],
      grounded: false
    };
  }
}