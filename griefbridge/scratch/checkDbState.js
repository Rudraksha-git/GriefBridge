import prisma from "../lib/prisma.js";

async function main() {
  console.log("--- Users in DB ---");
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: { memories: true, tasks: true, documents: true }
      }
    }
  });
  console.dir(users, { depth: null });

  console.log("\n--- Memories in DB ---");
  const memories = await prisma.memory.findMany({
    orderBy: { createdAt: "desc" }
  });
  console.log(`Total memories: ${memories.length}`);
  memories.forEach((m) => {
    console.log(`- ID: ${m.id}, User ID: ${m.userId}, Type: ${m.type}, Source File: ${m.sourceFile || 'none'}, Score: ${m.embedding ? m.embedding.length + '-dim vector' : 'no vector'}`);
    console.log(`  Content: "${m.content.slice(0, 150)}..."`);
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
