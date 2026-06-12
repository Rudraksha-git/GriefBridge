import { getUserId } from "../../../lib/auth.js";
import prisma from "../../../lib/prisma.js";
import { NextResponse } from "next/server.js";
import { runDocumentAgent } from "../../../agents/documentAgent.js";

export async function GET(request) {
  try {
    const userId = await getUserId();

    const documents = await prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("GET /api/documents error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = await getUserId();

    const body = await request.json();
    const { taskId, documentType, additionalContext } = body;

    if (!taskId) {
      return NextResponse.json({ error: "taskId is required" }, { status: 400 });
    }

    console.log(`POST /api/documents triggering runDocumentAgent for task: ${taskId}, type: ${documentType}`);
    
    const result = await runDocumentAgent(
      userId,
      taskId,
      documentType || null,
      additionalContext || {}
    );

    return NextResponse.json({
      message: "Document drafted successfully",
      ...result
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/documents error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
