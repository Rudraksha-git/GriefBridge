import prisma from "../lib/prisma.js";
import { searchMemories } from "../tools/memoryTools.js";

async function test(query) {
  console.log(`\nQuery: "${query}"`);
  const userId = "user_demo";

  const results = await searchMemories(userId, query, 5);
  results.forEach((r, i) => {
    console.log(`Match ${i+1}: Score=${r.score.toFixed(4)}, Type=${r.type}, Content preview: "${r.content.substring(0, 100)}..."`);
  });
}

async function main() {
  await test("Gajar ka halwa recipe");
  await test("Early Life & Memories of Lahore");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
