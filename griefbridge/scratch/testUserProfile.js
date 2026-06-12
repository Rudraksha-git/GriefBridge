import prisma from "../lib/prisma.js";

async function main() {
  console.log("Starting User Profile customization test...");

  // Setup/Reset test user record
  const userId = "user_demo";
  let user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    console.error("Demo user 'user_demo' not found! Please run the seeding script first: node scripts/loadDemoData.js");
    process.exit(1);
  }

  // Update user name to simulate Jane Doe (Daughter)
  user = await prisma.user.update({
    where: { id: userId },
    data: {
      firstName: "Jane",
      lastName: "Doe",
      deceasedName: null, // Reset config
      relationship: null
    }
  });

  const userFullName = `${user.firstName} ${user.lastName}`.trim();
  console.log(`Configured test user: ${userFullName}`);

  // 1. Setup mock POST input parameters
  const deceasedName = "Suresh Kumar";
  const relationship = "Daughter";

  const oldDeceasedName = user.deceasedName || "Ramesh Kumar";
  const oldRelationship = user.relationship || "Son";

  console.log(`Customizing profile: Deceased = "${deceasedName}", Relationship = "${relationship}"...`);

  // 2. Perform Database updates (simulating /api/user/profile POST handler)
  await prisma.user.update({
    where: { id: userId },
    data: { deceasedName, relationship }
  });

  // Update seeded memories
  const memories = await prisma.memory.findMany({ where: { userId } });
  for (const mem of memories) {
    let content = mem.content;
    
    // Replace names and relationships
    content = content.replace(new RegExp(oldDeceasedName, "g"), deceasedName);
    content = content.replace(/Amit Kumar/g, userFullName);
    content = content.replace(new RegExp(oldRelationship, "gi"), relationship);

    await prisma.memory.update({
      where: { id: mem.id },
      data: { content }
    });
  }

  // Update seeded tasks
  const tasks = await prisma.task.findMany({ where: { userId } });
  for (const task of tasks) {
    let title = task.title;
    let description = task.description || "";

    title = title.replace(new RegExp(oldDeceasedName, "g"), deceasedName);
    description = description.replace(new RegExp(oldDeceasedName, "g"), deceasedName);

    title = title.replace(/Dad's/gi, `${deceasedName}'s`);
    description = description.replace(/dad's/gi, `${deceasedName}'s`);

    await prisma.task.update({
      where: { id: task.id },
      data: { title, description }
    });
  }

  console.log("\n=== VERIFICATION ===");

  // Retrieve updated details
  const updatedUser = await prisma.user.findUnique({ where: { id: userId } });
  console.log(`Updated User: Deceased="${updatedUser.deceasedName}", Relationship="${updatedUser.relationship}"`);

  const updatedTasks = await prisma.task.findMany({ where: { userId } });
  console.log("\nCustomized Tasks titles:");
  updatedTasks.forEach((t) => console.log(`- ${t.title}`));

  const updatedMemories = await prisma.memory.findMany({ where: { userId } });
  console.log("\nCustomized Memories Content previews:");
  updatedMemories.forEach((m) => {
    console.log(`- Type=${m.type}: "${m.content.substring(0, 110)}..."`);
  });

  // Clean up and restore default user name for standard demo runs
  await prisma.user.update({
    where: { id: userId },
    data: {
      firstName: "Amit",
      lastName: "Kumar",
      deceasedName: null,
      relationship: null
    }
  });
  console.log("\nRestored user_demo default name. Test finished!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
