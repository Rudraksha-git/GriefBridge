import { ensureUserAndSeed } from "../lib/seedHelper.js";
import prisma from "../lib/prisma.js";

async function main() {
  console.log("Testing ensureUserAndSeed for a new user 'user_test_seed'...");
  
  // Clean up if exists
  await prisma.memory.deleteMany({ where: { userId: "user_test_seed" } });
  await prisma.task.deleteMany({ where: { userId: "user_test_seed" } });
  await prisma.user.deleteMany({ where: { id: "user_test_seed" } });

  const user = await ensureUserAndSeed("user_test_seed");
  console.log("ensureUserAndSeed returned:", user);

  // Check tasks and memories in DB
  const tasks = await prisma.task.findMany({ where: { userId: "user_test_seed" } });
  const memories = await prisma.memory.findMany({ where: { userId: "user_test_seed" } });

  console.log(`Created tasks count: ${tasks.length}`);
  console.log(`Created memories count: ${memories.length}`);
  memories.forEach((m) => {
    console.log(`- Memory ID: ${m.id}, Content: "${m.content.slice(0, 50)}...", Embedding length: ${m.embedding ? m.embedding.length : 'none'}`);
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
