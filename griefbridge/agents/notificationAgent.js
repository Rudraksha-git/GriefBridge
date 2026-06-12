import fs from "fs";
import path from "path";
import anthropic from "../lib/anthropic.js";
import { getInstitutionRegistry, draftNotificationLetter } from "../tools/notificationTools.js";

const notificationsFilePath = path.join(process.cwd(), "data", "notifications.json");

// Helper to ensure notifications file exists and returns parsed data
function readNotificationsFile() {
  const dataDir = path.dirname(notificationsFilePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(notificationsFilePath)) {
    fs.writeFileSync(notificationsFilePath, JSON.stringify([], null, 2), "utf8");
    return [];
  }

  try {
    const content = fs.readFileSync(notificationsFilePath, "utf8");
    return JSON.parse(content || "[]");
  } catch (err) {
    console.error("Error reading notifications file:", err);
    return [];
  }
}

// Helper to save data back to notifications file
function writeNotificationsFile(data) {
  fs.writeFileSync(notificationsFilePath, JSON.stringify(data, null, 2), "utf8");
}

/**
 * Gets all notifications for a specific user, seeding 7 default notifications if none exist.
 * @param {string} userId - ID of the user
 * @returns {Array} List of notifications
 */
export function getUserNotifications(userId) {
  let allNotifs = readNotificationsFile();
  let userNotifs = allNotifs.filter((n) => n.userId === userId);

  // Seed default 7 notifications for demo purposes if none exist
  if (userNotifs.length === 0) {
    const registry = getInstitutionRegistry();
    const demoDeceased = {
      name: "Ramesh Kumar",
      dateOfDeath: "June 5, 2026",
      relationshipToClaimant: "Father",
      deathCertificateNo: "DC-Chandigarh/2026/89481",
    };
    const demoClaimant = {
      name: "Amit Kumar",
      phone: "+91 98765 43210",
      email: "demo@griefbridge.com",
      address: "House 102, Sector 15-A, Chandigarh",
    };

    const seedConfigs = [
      { instId: "sbi", status: "resolved", extra: { accountNumber: "30219488310" } },
      { instId: "lic", status: "sent", extra: { policyNumber: "LIC-883012" } },
      { instId: "uidai", status: "sent", extra: { documentNumber: "4930-1829-3810" } },
      { instId: "tehsildar_office", status: "pending", extra: { propertyAddress: "House 102, Sector 15-A, Chandigarh" } },
      { instId: "epfo", status: "pending", extra: { documentNumber: "EPF-MEMBER-99120" } },
      { instId: "netflix", status: "resolved", extra: { accountEmail: "ramesh.kumar1954@gmail.com" } },
      { instId: "electricity_chd", status: "pending", extra: { connectionNumber: "ELEC-CHD-94921" } },
    ];

    const newSeedNotifs = seedConfigs.map((cfg, index) => {
      const inst = registry.find((r) => r.id === cfg.instId);
      const letter = draftNotificationLetter(inst.type, demoDeceased, demoClaimant, {
        ...cfg.extra,
        institutionName: inst.name,
      });

      return {
        id: `notif_${Date.now()}_${index}`,
        userId,
        institutionId: inst.id,
        institutionName: inst.name,
        institutionType: inst.type,
        status: cfg.status,
        letterText: letter,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    allNotifs = [...allNotifs, ...newSeedNotifs];
    writeNotificationsFile(allNotifs);
    return newSeedNotifs;
  }

  return userNotifs;
}

/**
 * Creates a new notification.
 * @param {string} userId - Owner ID
 * @param {object} notifData - { institutionId, letterText, status }
 * @returns {object} The created notification
 */
export function createNotification(userId, notifData) {
  const allNotifs = readNotificationsFile();
  const registry = getInstitutionRegistry();
  const inst = registry.find((r) => r.id === notifData.institutionId);

  if (!inst) {
    throw new Error(`Institution with ID ${notifData.institutionId} not found in registry.`);
  }

  const newNotif = {
    id: `notif_${Date.now()}`,
    userId,
    institutionId: inst.id,
    institutionName: inst.name,
    institutionType: inst.type,
    status: notifData.status || "pending",
    letterText: notifData.letterText || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  allNotifs.push(newNotif);
  writeNotificationsFile(allNotifs);
  return newNotif;
}

/**
 * Updates a notification status.
 * @param {string} userId - Owner ID
 * @param {string} notificationId - ID of notification
 * @param {string} status - 'pending' | 'sent' | 'resolved'
 * @returns {object} Updated notification
 */
export function updateNotificationStatus(userId, notificationId, status) {
  const allNotifs = readNotificationsFile();
  const idx = allNotifs.findIndex((n) => n.id === notificationId && n.userId === userId);

  if (idx === -1) {
    throw new Error(`Notification with ID ${notificationId} not found for user ${userId}.`);
  }

  allNotifs[idx].status = status;
  allNotifs[idx].updatedAt = new Date().toISOString();

  writeNotificationsFile(allNotifs);
  return allNotifs[idx];
}

/**
 * Deletes a notification.
 * @param {string} userId - Owner ID
 * @param {string} notificationId - ID of notification to delete
 * @returns {boolean} Success state
 */
export function deleteNotification(userId, notificationId) {
  const allNotifs = readNotificationsFile();
  const filtered = allNotifs.filter((n) => !(n.id === notificationId && n.userId === userId));

  if (filtered.length === allNotifs.length) {
    return false;
  }

  writeNotificationsFile(filtered);
  return true;
}

/**
 * Run Notification Agent: Processes an incoming reply/email from an institution
 * and automatically classifies it to update notification status.
 * @param {string} userId - User ID
 * @param {string} notificationId - Notification ID
 * @param {string} replyText - Raw reply message from institution
 * @returns {Promise<object>} Result containing updated status, explanation, and action required
 */
export async function runNotificationAgent(userId, notificationId, replyText) {
  const allNotifs = readNotificationsFile();
  const notif = allNotifs.find((n) => n.id === notificationId && n.userId === userId);

  if (!notif) {
    throw new Error(`Notification not found for status tracking.`);
  }

  let classification = {
    status: "sent",
    explanation: "Standard status tracker update.",
    actionRequired: null,
  };

  if (process.env.MOCK_AI === "true") {
    console.log(`[MOCK MODE] Running NotificationAgent status tracking for: "${notif.institutionName}"`);
    const replyLower = replyText.toLowerCase();

    if (replyLower.includes("closed") || replyLower.includes("settled") || replyLower.includes("deactivated") || replyLower.includes("successful")) {
      classification.status = "resolved";
      classification.explanation = "The institution confirmed that the request has been successfully processed and closed.";
    } else if (replyLower.includes("required") || replyLower.includes("provide") || replyLower.includes("missing") || replyLower.includes("send")) {
      classification.status = "pending";
      classification.explanation = "The institution requested further documents or details from the claimant.";
      classification.actionRequired = "Action needed: Please provide the requested documents.";
    } else {
      classification.status = "sent";
      classification.explanation = "Acknowledgment received. The request is currently being processed by the institution.";
    }
  } else {
    const prompt = `You are the GriefBridge Notification Agent. You monitor correspondence from banks, governments, and insurers regarding bereavement requests.
Analyze this response from the institution: "${notif.institutionName}" (Type: ${notif.institutionType}).
Original Request context:
"${notif.letterText.substring(0, 500)}..."

Incoming Response/Email:
"${replyText}"

Determine:
1. The new status of the notification:
   - "resolved": If they completed the request (e.g. account closed, claim approved, ID cancelled).
   - "pending": If they rejected/paused and need user action (e.g. need original ID, physical visit, missing certificate).
   - "sent": If it's a generic auto-reply or processing confirmation where no action is needed and we are just waiting.
2. A brief, warm explanation of what the response means.
3. If they need action (status: "pending"), specify "actionRequired" description. Else, return null.

Return ONLY a JSON object:
{
  "status": "resolved" | "pending" | "sent",
  "explanation": "Brief context explanation...",
  "actionRequired": "Description of what the user needs to upload/do" | null
}
Return ONLY valid JSON.`;

    try {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 400,
        temperature: 0.0,
        messages: [{ role: "user", content: prompt }],
      });

      classification = JSON.parse(response.content[0].text.trim());
    } catch (err) {
      if (err.message?.includes("balance") || err.message?.includes("credit")) {
        console.warn("Anthropic API key has zero balance. Falling back to Mock mode.");
        process.env.MOCK_AI = "true";
        return runNotificationAgent(userId, notificationId, replyText);
      }
      console.error("Notification agent analysis error:", err);
      // Fallback
      classification.status = notif.status;
      classification.explanation = "Error parsing reply. Status remains unchanged.";
    }
  }

  // Update status in record
  const updatedNotif = updateNotificationStatus(userId, notificationId, classification.status);
  
  return {
    notification: updatedNotif,
    explanation: classification.explanation,
    actionRequired: classification.actionRequired,
  };
}
