import { getUserId } from "../../../lib/auth.js";
import { NextResponse } from "next/server.js";
import fs from "fs";
import path from "path";
import {
  getInstitutionRegistry,
  draftNotificationLetter
} from "../../../tools/notificationTools.js";
import {
  getUserNotifications,
  createNotification,
  updateNotificationStatus,
  deleteNotification,
  runNotificationAgent
} from "../../../agents/notificationAgent.js";

const registryFilePath = path.join(process.cwd(), "data", "institutionRegistry.json");

// Helper to write to registry file
function writeRegistryFile(data) {
  fs.writeFileSync(registryFilePath, JSON.stringify(data, null, 2), "utf8");
}

export async function GET(request) {
  try {
    const userId = await getUserId();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'registry' or 'notifications' (default)

    if (type === "registry") {
      const registry = getInstitutionRegistry();
      return NextResponse.json({ registry });
    }

    const notifications = getUserNotifications(userId);
    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = await getUserId();

    const body = await request.json();
    const { action, registry, ...payload } = body;

    // 1. Process agentic status-tracking for incoming institution reply
    if (action === "incoming_reply") {
      const { notificationId, replyText } = payload;
      if (!notificationId || !replyText) {
        return NextResponse.json({ error: "notificationId and replyText are required" }, { status: 400 });
      }
      const result = await runNotificationAgent(userId, notificationId, replyText);
      return NextResponse.json(result);
    }

    // 2. Institution Registry CRUD - Create
    if (registry === true) {
      const { id, name, type, contactDetails } = payload;
      if (!id || !name || !type) {
        return NextResponse.json({ error: "id, name, and type are required for registry" }, { status: 400 });
      }

      const currentRegistry = getInstitutionRegistry();
      if (currentRegistry.some(inst => inst.id === id)) {
        return NextResponse.json({ error: `Institution with ID ${id} already exists` }, { status: 400 });
      }

      const newInstitution = { id, name, type, contactDetails: contactDetails || {} };
      currentRegistry.push(newInstitution);
      writeRegistryFile(currentRegistry);

      return NextResponse.json({ institution: newInstitution }, { status: 201 });
    }

    // 3. User Notification Creation
    const { institutionId, letterText, status } = payload;
    if (!institutionId) {
      return NextResponse.json({ error: "institutionId is required" }, { status: 400 });
    }

    const newNotification = createNotification(userId, { institutionId, letterText, status });
    return NextResponse.json({ notification: newNotification }, { status: 201 });

  } catch (error) {
    console.error("POST /api/notifications error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const userId = await getUserId();

    const body = await request.json();
    const { registry, id, notificationId, status, ...payload } = body;

    // 1. Registry Update
    if (registry === true) {
      if (!id) {
        return NextResponse.json({ error: "Institution id is required" }, { status: 400 });
      }
      const currentRegistry = getInstitutionRegistry();
      const idx = currentRegistry.findIndex(inst => inst.id === id);

      if (idx === -1) {
        return NextResponse.json({ error: "Institution not found in registry" }, { status: 404 });
      }

      currentRegistry[idx] = {
        ...currentRegistry[idx],
        ...payload
      };
      writeRegistryFile(currentRegistry);
      return NextResponse.json({ institution: currentRegistry[idx] });
    }

    // 2. Notification Update
    if (!notificationId || !status) {
      return NextResponse.json({ error: "notificationId and status are required" }, { status: 400 });
    }

    const updatedNotif = updateNotificationStatus(userId, notificationId, status);
    return NextResponse.json({ notification: updatedNotif });

  } catch (error) {
    console.error("PATCH /api/notifications error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const userId = await getUserId();

    const { searchParams } = new URL(request.url);
    const registry = searchParams.get("registry") === "true";
    const id = searchParams.get("id"); // institution id or notification id

    if (!id) {
      return NextResponse.json({ error: "id parameter is required" }, { status: 400 });
    }

    if (registry) {
      const currentRegistry = getInstitutionRegistry();
      const filtered = currentRegistry.filter(inst => inst.id !== id);

      if (filtered.length === currentRegistry.length) {
        return NextResponse.json({ error: "Institution not found in registry" }, { status: 404 });
      }

      writeRegistryFile(filtered);
      return NextResponse.json({ message: "Institution deleted from registry successfully" });
    }

    const success = deleteNotification(userId, id);
    if (!success) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Notification deleted successfully" });

  } catch (error) {
    console.error("DELETE /api/notifications error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
