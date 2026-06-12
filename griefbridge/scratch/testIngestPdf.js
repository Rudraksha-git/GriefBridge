import prisma from "../lib/prisma.js";
import { runIngestion } from "../agents/ingestionAgent.js";
import fs from "fs";
import path from "path";

async function main() {
  console.log("Starting PDF ingestion test...");

  // Verify demo user exists
  const user = await prisma.user.findUnique({
    where: { id: "user_demo" }
  });

  if (!user) {
    console.error("Demo user 'user_demo' not found! Please run the seeding script first: node scripts/loadDemoData.js");
    process.exit(1);
  }

  const pdfSource = path.join(process.cwd(), "public", "sample_memory.pdf");
  if (!fs.existsSync(pdfSource)) {
    console.error(`Sample memory PDF not found at ${pdfSource}`);
    process.exit(1);
  }

  // Create temporary file path
  const tempDir = path.join(process.cwd(), "public", "uploads", "temp_ingest");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const tempFilePath = path.join(tempDir, `test_ingest_${Date.now()}.pdf`);
  fs.copyFileSync(pdfSource, tempFilePath);

  console.log(`Copied PDF to temp location: ${tempFilePath}`);

  try {
    const files = [
      {
        path: tempFilePath,
        filename: "sample_memory.pdf",
        kind: "document",
        speakerLabel: "Ramesh"
      }
    ];

    const result = await runIngestion({ userId: "user_demo", files });
    console.log("Ingestion result:", JSON.stringify(result, null, 2));

    // Retrieve memories from DB
    const memories = await prisma.memory.findMany({
      where: {
        userId: "user_demo",
      }
    });

    console.log(`Successfully retrieved ${memories.length} memories from database for user_demo.`);
    memories.forEach((mem, idx) => {
      console.log(`Memory ${idx + 1}: Type=${mem.type}, FileUrl=${mem.fileUrl}, Content preview: "${mem.content.substring(0, 100)}...", Metadata:`, mem.metadata);
    });

  } catch (err) {
    console.error("Ingestion failed:", err);
  } finally {
    // Clean up temp file
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
      console.log(`Cleaned up temp file: ${tempFilePath}`);
    }
    await prisma.$disconnect();
  }
}

main();
