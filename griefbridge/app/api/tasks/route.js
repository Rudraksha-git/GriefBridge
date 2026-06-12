import { getUserId } from "../../../lib/auth.js";
import prisma from "../../../lib/prisma.js";
import { NextResponse } from "next/server.js";
import { ensureUserAndSeed } from "../../../lib/seedHelper.js";

const priorityWeight = {
  "HIGH": 3,
  "MEDIUM": 2,
  "LOW": 1
};

export async function GET(request) {
  try {
    const userId = await getUserId();
    
    // Auto-create and seed user profile on demand
    await ensureUserAndSeed(userId);

    const tasks = await prisma.task.findMany({
      where: { userId },
      include: { documents: true }
    });

    // Sort tasks in JS for custom priority and deadline ordering
    tasks.sort((a, b) => {
      // 1. Priority (HIGH first, then MEDIUM, then LOW)
      const pA = priorityWeight[a.priority] || 0;
      const pB = priorityWeight[b.priority] || 0;
      if (pA !== pB) {
        return pB - pA;
      }

      // 2. Legal Deadline (dueDate ascending, no dueDate goes last)
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;

      return 0;
    });

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    return NextResponse.json({ 
      tasks,
      user: {
        deceasedName: user?.deceasedName || null,
        relationship: user?.relationship || null,
        userFullName: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : ""
      }
    });
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = await getUserId();

    const body = await request.json();
    const { title, description, priority, category, dueDate } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || "MEDIUM",
        category: category || "legal",
        dueDate: dueDate ? new Date(dueDate) : null,
        userId
      }
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
