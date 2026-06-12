import { getUserId } from "../../../../../lib/auth.js";
import prisma from "../../../../../lib/prisma.js";
import { NextResponse } from "next/server.js";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const userId = await getUserId();

    const document = await prisma.document.findFirst({
      where: { id, userId }
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const updatedDoc = await prisma.document.update({
      where: { id },
      data: { status: "SIGNED" }
    });

    return NextResponse.json({
      message: "Document approved and signed successfully",
      document: updatedDoc
    });
  } catch (error) {
    console.error("POST /api/documents/[id]/approve error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
