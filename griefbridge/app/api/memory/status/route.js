import { getUserId } from "../../../../lib/auth.js";
import prisma from "../../../../lib/prisma.js";
import { NextResponse } from "next/server.js";

export async function GET(request) {
  try {
    const userId = await getUserId();

    const [chatCount, voiceCount, photoCount, textCount] = await Promise.all([
      prisma.memory.count({ where: { userId, type: "chat" } }),
      prisma.memory.count({ where: { userId, type: "audio" } }),
      prisma.memory.count({ where: { userId, type: "image" } }),
      prisma.memory.count({ where: { userId, type: "text" } }),
    ]);

    const total = chatCount + voiceCount + photoCount + textCount;

    return NextResponse.json({
      name: "Ramesh", // Deceased name for the demo
      years: "1954 – 2026",
      conversations: chatCount,
      voiceRecordings: voiceCount,
      photos: photoCount,
      documents: textCount,
      total
    });
  } catch (error) {
    console.error("GET /api/memory/status error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
