import prisma from "../lib/prisma.js";
import { embedText } from "../tools/memoryTools.js";

async function main() {
  console.log("Starting database repair: computing embeddings for all existing memories...");

  const memories = await prisma.memory.findMany();
  console.log(`Found ${memories.length} total memories in the database.`);

  let updatedCount = 0;
  for (const mem of memories) {
    if (!mem.embedding || mem.embedding.length === 0) {
      console.log(`Memory ID ${mem.id} is missing embedding. Generating vector...`);
      const embedding = await embedText(mem.content);
      
      await prisma.memory.update({
        where: { id: mem.id },
        data: { embedding }
      });
      updatedCount++;
    }
  }

  console.log(`Successfully generated and saved embeddings for ${updatedCount} memories!`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
