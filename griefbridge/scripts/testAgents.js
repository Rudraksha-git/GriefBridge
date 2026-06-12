import { runOrchestrator } from "../agents/orchestrator.js";
import prisma from "../lib/prisma.js";
import fs from "fs";
import path from "path";

async function main() {
  console.log("Starting agent flow verification test...");

  // Verify user exists
  const user = await prisma.user.findUnique({
    where: { id: "user_demo" }
  });

  if (!user) {
    console.error("Demo user 'user_demo' not found! Please run the seeding script first: node scripts/loadDemoData.js");
    process.exit(1);
  }

  const query = "We need to close Dad's SBI bank account, claim his life insurance from LIC, and update his Aadhaar status.";
  console.log(`\nRunning Orchestrator with query: "${query}"...\n`);

  try {
    const result = await runOrchestrator("user_demo", query);
    
    console.log("=== ORCHESTRATOR STATUS LOG ===");
    result.statusLog.forEach(log => console.log(`- ${log}`));
    console.log("===============================\n");

    console.log("=== EXTRACTED TASKS ===");
    result.extractedTasks.forEach(task => {
      console.log(`Task: ${task.title} [Status: ${task.status}, Priority: ${task.priority}]`);
    });
    console.log("=======================\n");

    // Check generated documents
    const documents = await prisma.document.findMany({
      where: { userId: "user_demo" }
    });

    console.log("=== GENERATED DOCUMENTS ===");
    for (const doc of documents) {
      console.log(`Document Title: ${doc.title}`);
      console.log(`Type: ${doc.type}`);
      console.log(`Status: ${doc.status}`);
      console.log(`File URL: ${doc.fileUrl}`);
      
      const absolutePath = path.join(process.cwd(), "public", doc.fileUrl);
      if (fs.existsSync(absolutePath)) {
        const stats = fs.statSync(absolutePath);
        console.log(`PDF Verification: Success (File exists, Size: ${stats.size} bytes)`);
      } else {
        console.error(`PDF Verification: FAILED (File not found at ${absolutePath})`);
      }
      console.log("---");
    }
    console.log("===========================");

  } catch (err) {
    console.error("Error running orchestrator test flow:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
