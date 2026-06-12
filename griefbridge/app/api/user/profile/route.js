import { getUserId } from "../../../../lib/auth.js";
import prisma from "../../../../lib/prisma.js";
import { NextResponse } from "next/server.js";

export async function POST(request) {
  try {
    const userId = await getUserId();
    const body = await request.json();
    const { deceasedName, relationship } = body;

    if (!deceasedName || !relationship) {
      return NextResponse.json({ error: "Deceased name and relationship are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const oldDeceasedName = user.deceasedName || "Ramesh Kumar";
    const oldRelationship = user.relationship || "Son";
    const userFullName = `${user.firstName || "Amit"} ${user.lastName || "Kumar"}`.trim();

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        deceasedName,
        relationship
      }
    });

    // Update seeded memories to reflect the user's custom details
    const memories = await prisma.memory.findMany({ where: { userId } });
    for (const mem of memories) {
      let content = mem.content;
      
      // Safety checks: replace names and relationships inside memories
      content = content.replace(new RegExp(oldDeceasedName, "g"), deceasedName);
      content = content.replace(/Amit Kumar/g, userFullName);
      content = content.replace(/\bAmit\b/g, user.firstName || "Amit");
      content = content.replace(new RegExp(oldRelationship, "gi"), relationship);

      await prisma.memory.update({
        where: { id: mem.id },
        data: { content }
      });
    }

    // Update seeded tasks to reflect the user's custom details
    const tasks = await prisma.task.findMany({ where: { userId } });
    for (const task of tasks) {
      let title = task.title;
      let description = task.description || "";

      title = title.replace(new RegExp(oldDeceasedName, "g"), deceasedName);
      description = description.replace(new RegExp(oldDeceasedName, "g"), deceasedName);

      title = title.replace(/Dad's/gi, `${deceasedName}'s`);
      description = description.replace(/dad's/gi, `${deceasedName}'s`);

      await prisma.task.update({
        where: { id: task.id },
        data: { title, description }
      });
    }

    return NextResponse.json({ message: "Profile updated and assets customized successfully", user: updatedUser });
  } catch (error) {
    console.error("POST /api/user/profile error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const userId = await getUserId();
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      deceasedName: user.deceasedName,
      relationship: user.relationship,
      userFullName: `${user.firstName || ""} ${user.lastName || ""}`.trim()
    });
  } catch (error) {
    console.error("GET /api/user/profile error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
