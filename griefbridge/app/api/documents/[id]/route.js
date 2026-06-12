import { getUserId } from "../../../../lib/auth.js";
import prisma from "../../../../lib/prisma.js";
import { NextResponse } from "next/server.js";
import { generateDocument } from "../../../../tools/documentTools.js";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const userId = await getUserId();

    const document = await prisma.document.findFirst({
      where: { id, userId },
      include: { task: true }
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({ document });
  } catch (error) {
    console.error("GET /api/documents/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const userId = await getUserId();

    const body = await request.json();
    const { title, status, content } = body;

    const existingDoc = await prisma.document.findFirst({
      where: { id, userId }
    });

    if (!existingDoc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    let updatedContent = existingDoc.content;
    let fileUrl = existingDoc.fileUrl;

    // If user edited form fields, regenerate the PDF
    if (content !== undefined) {
      updatedContent = {
        ...(typeof existingDoc.content === "object" && existingDoc.content !== null ? existingDoc.content : {}),
        ...content
      };

      // Ensure currentDate exists
      if (!updatedContent.currentDate) {
        updatedContent.currentDate = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
      }

      const taskId = existingDoc.taskId || "no_task";
      const filename = `${existingDoc.type}_${taskId.substring(0, 8)}.pdf`;

      console.log(`PATCH /api/documents/[id] regenerating PDF: ${filename}`);
      fileUrl = await generateDocument(existingDoc.type, updatedContent, filename);
    }

    const updatedDoc = await prisma.document.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existingDoc.title,
        status: status !== undefined ? status : existingDoc.status,
        content: updatedContent,
        fileUrl
      }
    });

    return NextResponse.json({ document: updatedDoc });
  } catch (error) {
    console.error("PATCH /api/documents/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const userId = await getUserId();

    const existingDoc = await prisma.document.findFirst({
      where: { id, userId }
    });

    if (!existingDoc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    await prisma.document.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/documents/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
