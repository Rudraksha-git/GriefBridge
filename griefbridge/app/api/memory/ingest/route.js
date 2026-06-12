import { getUserId } from "../../../../lib/auth.js";
import { runIngestion } from "../../../../agents/ingestionAgent.js";
import { NextResponse } from "next/server.js";
import fs from "fs";
import path from "path";

export async function POST(request) {
  try {
    const userId = await getUserId();
    const formData = await request.formData();

    const speakerLabel = formData.get("speakerLabel") || "Unknown";

    const uploadDir = path.join(process.cwd(), "public", "uploads", "temp_ingest");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const files = [];
    const filesToCleanup = [];

    for (const [key, value] of formData.entries()) {
      if (value && typeof value === "object" && typeof value.arrayBuffer === "function") {
        // This is an uploaded file
        const fileObj = value;
        const filename = fileObj.name;
        const arrayBuffer = await fileObj.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const tempFilePath = path.join(uploadDir, `${Date.now()}_${filename}`);
        fs.writeFileSync(tempFilePath, buffer);
        filesToCleanup.push(tempFilePath);

        // Determine kind
        let kind = "";
        const lowerName = filename.toLowerCase();
        if (lowerName.endsWith(".zip") || lowerName.endsWith(".txt") || lowerName.endsWith(".json")) {
          kind = "chat";
        } else if (lowerName.endsWith(".png") || lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg") || lowerName.endsWith(".heic")) {
          kind = "image";
        } else if (lowerName.endsWith(".wav") || lowerName.endsWith(".mp3") || lowerName.endsWith(".m4a") || lowerName.endsWith(".ogg")) {
          kind = "audio";
        } else if (lowerName.endsWith(".pdf")) {
          kind = "document";
        }

        if (kind) {
          files.push({
            path: tempFilePath,
            filename,
            kind,
            speakerLabel
          });
        }
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: "No valid files uploaded" }, { status: 400 });
    }

    console.log(`Ingesting ${files.length} files for user ${userId}...`);
    const ingestionResult = await runIngestion({ userId, files });

    // Clean up temp files
    for (const filePath of filesToCleanup) {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error(`Error deleting temp file ${filePath}:`, err);
      }
    }

    return NextResponse.json({
      message: "Ingestion completed successfully",
      ...ingestionResult
    }, { status: 201 });

  } catch (error) {
    console.error("POST /api/memory/ingest error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
