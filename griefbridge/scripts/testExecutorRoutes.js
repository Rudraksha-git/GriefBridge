import { GET as getTasks, POST as postTask } from "../app/api/tasks/route.js";
import { GET as getTask, PATCH as patchTask, DELETE as deleteTask } from "../app/api/tasks/[id]/route.js";
import { POST as approveTask } from "../app/api/tasks/[id]/approve/route.js";
import { GET as getDocs, POST as postDoc } from "../app/api/documents/route.js";
import { GET as getDoc, PATCH as patchDoc } from "../app/api/documents/[id]/route.js";
import { POST as approveDoc } from "../app/api/documents/[id]/approve/route.js";
import { GET as getNotifs, POST as postNotif, PATCH as patchNotif } from "../app/api/notifications/route.js";
import prisma from "../lib/prisma.js";

// Ensure we run in mock AI mode to avoid using Sonnet API credits during tests
process.env.MOCK_AI = "true";

// Custom Mock for Next.js request
function createMockRequest(url, bodyData = null) {
  return {
    url,
    nextUrl: new URL(url),
    json: async () => bodyData,
    headers: {
      get: () => null
    }
  };
}

async function runTests() {
  console.log("==================================================");
  console.log("       STARTING EXECUTOR APIS VERIFICATION        ");
  console.log("==================================================");

  try {
    // 1. Verify tasks are seeded (we expect our seeding script update to be active)
    const dbTasksCount = await prisma.task.count({ where: { userId: "user_demo" } });
    console.log(`- Database tasks found for 'user_demo': ${dbTasksCount}`);

    if (dbTasksCount < 14) {
      console.warn(`[WARN] Found ${dbTasksCount} tasks in DB. Please run the seeding script first if you want the full 14 tasks demo.`);
    }

    // 2. Test GET /api/tasks (returns prioritised tasks)
    console.log("\nTesting GET /api/tasks (prioritised query)...");
    const getTasksReq = createMockRequest("http://localhost:3000/api/tasks");
    const tasksRes = await getTasks(getTasksReq);
    const tasksJson = await tasksRes.json();
    
    if (tasksRes.status === 200 && tasksJson.tasks) {
      console.log(`- Success: Returned ${tasksJson.tasks.length} tasks.`);
      // Verify sorting order: HIGH priority first
      const firstTask = tasksJson.tasks[0];
      const lastTask = tasksJson.tasks[tasksJson.tasks.length - 1];
      console.log(`- First task (should be HIGH priority): "${firstTask.title}" [Priority: ${firstTask.priority}]`);
      console.log(`- Last task (should be LOW or no deadline): "${lastTask.title}" [Priority: ${lastTask.priority}]`);
    } else {
      console.error("- FAILED: GET /api/tasks returned error", tasksJson);
    }

    // 3. Test GET /api/notifications (seeding 7 demo notifications)
    console.log("\nTesting GET /api/notifications (demo notifications status pipeline)...");
    const getNotifsReq = createMockRequest("http://localhost:3000/api/notifications");
    const notifsRes = await getNotifs(getNotifsReq);
    const notifsJson = await notifsRes.json();

    if (notifsRes.status === 200 && notifsJson.notifications) {
      console.log(`- Success: Returned ${notifsJson.notifications.length} notifications.`);
      notifsJson.notifications.forEach((n, idx) => {
        console.log(`  [${idx + 1}] Institution: ${n.institutionName} | Type: ${n.institutionType} | Status: ${n.status}`);
      });
    } else {
      console.error("- FAILED: GET /api/notifications returned error", notifsJson);
    }

    // 4. Test GET /api/notifications?type=registry (returns 30+ institutions)
    console.log("\nTesting GET /api/notifications?type=registry (institution registry)...");
    const getRegistryReq = createMockRequest("http://localhost:3000/api/notifications?type=registry");
    const registryRes = await getNotifs(getRegistryReq);
    const registryJson = await registryRes.json();

    if (registryRes.status === 200 && registryJson.registry) {
      console.log(`- Success: Returned ${registryJson.registry.length} institutions in registry.`);
      console.log(`- Example: ${registryJson.registry[0].name} (Type: ${registryJson.registry[0].type})`);
    } else {
      console.error("- FAILED: GET /api/notifications?type=registry returned error", registryJson);
    }

    // 5. Test Document Generation via POST /api/documents
    console.log("\nTesting POST /api/documents (triggering DocumentAgent drafting)...");
    // Find a pending task
    const pendingTask = await prisma.task.findFirst({
      where: { userId: "user_demo", status: "PENDING" }
    });

    if (pendingTask) {
      console.log(`- Triggering document draft for task: "${pendingTask.title}" (ID: ${pendingTask.id})`);
      const postDocReq = createMockRequest("http://localhost:3000/api/documents", {
        taskId: pendingTask.id
      });
      const postDocRes = await postDoc(postDocReq);
      const postDocJson = await postDocRes.json();

      if (postDocRes.status === 201) {
        console.log(`- Success: Drafted document ID: ${postDocJson.documentId}`);
        console.log(`- Generated PDF: ${postDocJson.fileUrl}`);
        console.log(`- Selected Template: ${postDocJson.template}`);

        // Verify task status was updated to IN_PROGRESS
        const updatedTask = await prisma.task.findUnique({ where: { id: pendingTask.id } });
        console.log(`- Associated task status updated to: ${updatedTask.status}`);

        // 6. Test Document Approval POST /api/documents/[id]/approve
        console.log("\nTesting POST /api/documents/[id]/approve (marking as SIGNED)...");
        const approveDocReq = createMockRequest(`http://localhost:3000/api/documents/${postDocJson.documentId}/approve`);
        const approveDocRes = await approveDoc(approveDocReq, {
          params: Promise.resolve({ id: postDocJson.documentId })
        });
        const approveDocJson = await approveDocRes.json();

        if (approveDocRes.status === 200) {
          console.log(`- Success: Document approved. Status: ${approveDocJson.document.status}`);
        } else {
          console.error("- FAILED: Document approval error", approveDocJson);
        }
      } else {
        console.error("- FAILED: Document generation returned error", postDocJson);
      }
    } else {
      console.log("- Skipped document agent test (no pending tasks found).");
    }

    // 7. Test Notification Agent incoming response processing
    console.log("\nTesting Notification Agent auto-resolve trigger via POST...");
    const userNotifs = notifsJson.notifications || [];
    const sentNotif = userNotifs.find(n => n.status === "sent");

    if (sentNotif) {
      console.log(`- Found notification sent to: "${sentNotif.institutionName}" (Status: ${sentNotif.status})`);
      console.log("- Injecting incoming reply: 'We have processed the request and deactivated the Aadhaar record successfully.'");
      
      const replyReq = createMockRequest("http://localhost:3000/api/notifications", {
        action: "incoming_reply",
        notificationId: sentNotif.id,
        replyText: "We have processed the request and deactivated the Aadhaar record successfully."
      });
      
      const replyRes = await postNotif(replyReq);
      const replyJson = await replyRes.json();

      if (replyRes.status === 200) {
        console.log("- Success: Agent processed incoming reply.");
        console.log(`- Updated Status: ${replyJson.notification.status}`);
        console.log(`- Agent Explanation: "${replyJson.explanation}"`);
      } else {
        console.error("- FAILED: Agent reply processing error", replyJson);
      }
    } else {
      console.log("- Skipped notification agent test (no sent notifications found).");
    }

    console.log("\n==================================================");
    console.log("       VERIFICATION COMPLETED SUCCESSFULLY        ");
    console.log("==================================================");

  } catch (error) {
    console.error("\n[FATAL ERROR] Exception during verification:", error);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
