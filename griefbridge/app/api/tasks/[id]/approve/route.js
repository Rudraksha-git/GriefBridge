import { getUserId } from "../../../../../lib/auth.js";
import prisma from "../../../../../lib/prisma.js";
import { NextResponse } from "next/server.js";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const userId = await getUserId();

    const task = await prisma.task.findFirst({
      where: { id, userId }
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status: "COMPLETED" }
    });

    return NextResponse.json({
      message: "Task completed and approved successfully",
      task: updatedTask
    });
  } catch (error) {
    console.error("POST /api/tasks/[id]/approve error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
