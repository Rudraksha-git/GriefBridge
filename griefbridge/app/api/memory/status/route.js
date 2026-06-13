import { getUserId } from "../../../../lib/auth.js";
import prisma from "../../../../lib/prisma.js";
import { NextResponse } from "next/server.js";

export async function GET(request) {
  try {
    const userId = await getUserId();

    const [user, chatCount, voiceCount, photoCount, textCount] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.memory.count({ where: { userId, type: "chat" } }),
      prisma.memory.count({ where: { userId, type: "audio" } }),
      prisma.memory.count({ where: { userId, type: "image" } }),
      prisma.memory.count({ where: { userId, type: "text" } }),
    ]);

    const total = chatCount + voiceCount + photoCount + textCount;

    // Fetch the latest memory to display in the featured insight dynamically
    const latestMemory = await prisma.memory.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    let featured = null;
    if (latestMemory) {
      let excerpt = latestMemory.content;
      if (excerpt.length > 200) {
        excerpt = excerpt.substring(0, 197) + "...";
      }
      featured = {
        label: "Primary Legacy Insight",
        excerpt: excerpt,
        source: latestMemory.sourceFile || (latestMemory.type === "audio" ? "Voice Note" : "Family Record")
      };
    }

    return NextResponse.json({
      name: user?.deceasedName || "Ramesh",
      years: "1954 – 2026",
      conversations: chatCount,
      voiceRecordings: voiceCount,
      photos: photoCount,
      documents: textCount,
      total,
      featured
    });
  } catch (error) {
    console.error("GET /api/memory/status error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
