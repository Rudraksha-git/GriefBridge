import { StateGraph, END } from "@langchain/langgraph";
import prisma from "../lib/prisma.js";
import anthropic from "../lib/anthropic.js";
import { runDocumentAgent } from "./documentAgent.js";

// Helper to determine task routing using Claude
async function classifyTaskForRouting(task) {
  if (process.env.MOCK_AI === "true") {
    console.log(`[MOCK MODE] Classifying task for routing: "${task.title}"`);
    const titleLower = task.title.toLowerCase();
    if (titleLower.includes("bank") || titleLower.includes("sbi")) {
      return { requiresDocument: true, documentType: "bank_closure" };
    } else if (titleLower.includes("insurance") || titleLower.includes("lic")) {
      return { requiresDocument: true, documentType: "insurance_claim" };
    } else if (titleLower.includes("aadhaar")) {
      return { requiresDocument: true, documentType: "aadhaar" };
    } else if (titleLower.includes("heir") || titleLower.includes("legal")) {
      return { requiresDocument: true, documentType: "legal_heir" };
    } else if (titleLower.includes("epf") || titleLower.includes("pf")) {
      return { requiresDocument: true, documentType: "epf" };
    }
    return { requiresDocument: false, documentType: null };
  }

  const prompt = `You are a triage supervisor. Determine if the following task requires drafting a formal document.
Task Title: "${task.title}"
Task Description: "${task.description || ""}"

We have document templates for:
- "bank_closure" (closing bank accounts, transferring funds)
- "insurance_claim" (life insurance payout requests)
- "legal_heir" (legal heir certificate/survival petitions)
- "epf" (provident fund/pension claims)
- "aadhaar" (cancellation/deactivation of Aadhaar card)

Return a JSON object:
{
  "requiresDocument": true/false,
  "documentType": "bank_closure" | "insurance_claim" | "legal_heir" | "epf" | "aadhaar" | null
}
Return ONLY JSON, no conversational text.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 150,
      temperature: 0.0,
      messages: [{ role: "user", content: prompt }]
    });
    
    return JSON.parse(response.content[0].text.trim());
  } catch (err) {
    if (err.message?.includes("balance") || err.message?.includes("credit")) {
      console.warn("Anthropic API key has zero balance. Falling back to Mock mode.");
      process.env.MOCK_AI = "true";
      return classifyTaskForRouting(task);
    }
    console.error("Classification error:", err);
    return { requiresDocument: false, documentType: null };
  }
}

// 1. Triage Node - Parses user query and creates tasks in DB
async function triageNode(state) {
  const { userId, query } = state;

  if (process.env.MOCK_AI === "true") {
    console.log(`[MOCK MODE] Triaging query: "${query}"`);
    const mockTriage = [
      {
        title: "Close Dad's SBI Savings Account",
        description: "Notify State Bank of India Sector 15 Chandigarh branch about the demise and request balance transfer to Savitri Devi's account.",
        priority: "HIGH",
        category: "financial"
      },
      {
        title: "Submit Life Insurance Claim to LIC",
        description: "Submit death claim for LIC Policy LIC-883012. Verify cover amount and transfer options.",
        priority: "HIGH",
        category: "financial"
      },
      {
        title: "Update Aadhaar Card with Demise Notice",
        description: "Report demise of Ramesh Kumar to UIDAI and deactivate Aadhaar Card (4930-1829-3810).",
        priority: "MEDIUM",
        category: "digital"
      }
    ];

    const createdTasks = [];
    for (const t of mockTriage) {
      const dbTask = await prisma.task.create({
        data: {
          title: t.title,
          description: t.description,
          priority: t.priority,
          category: t.category,
          status: "PENDING",
          userId: userId
        }
      });
      createdTasks.push(dbTask);
    }
    return {
      extractedTasks: createdTasks,
      statusLog: [`[MOCK] Triaged query. Created ${createdTasks.length} tasks in database.`]
    };
  }

  const prompt = `You are a bereavement counselor and task planner. Parse the following user query describing their current situation after the loss of their loved one, and identify key administrative tasks that need to be completed.
User query: "${query}"

Provide a structured list of tasks. For each task, provide:
- "title": Clear task name (e.g. "Close ICICI Savings Account", "Update Aadhaar Status")
- "description": Contextual explanation, what needs to be done.
- "priority": "HIGH", "MEDIUM", or "LOW"
- "category": "financial", "legal", "personal", or "digital"

Return a JSON array of tasks.
Example:
[
  { "title": "Close Dad's Bank Account", "description": "Notify bank of demise and request balance transfer", "priority": "HIGH", "category": "financial" }
]
Return ONLY JSON.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }]
    });

    let parsedTasks = JSON.parse(response.content[0].text.trim());

    // Create tasks in DB
    const createdTasks = [];
    for (const t of parsedTasks) {
      const dbTask = await prisma.task.create({
        data: {
          title: t.title,
          description: t.description,
          priority: t.priority || "MEDIUM",
          category: t.category || "legal",
          status: "PENDING",
          userId: userId
        }
      });
      createdTasks.push(dbTask);
    }

    return {
      extractedTasks: createdTasks,
      statusLog: [`Triaged query. Created ${createdTasks.length} tasks in database.`]
    };
  } catch (err) {
    if (err.message?.includes("balance") || err.message?.includes("credit")) {
      console.warn("Anthropic API key has zero balance. Falling back to Mock mode.");
      process.env.MOCK_AI = "true";
      return triageNode(state);
    }
    console.error("Failed to parse triage tasks:", err);
    const dbTask = await prisma.task.create({
      data: {
        title: "Identify estate and administrative tasks",
        description: query,
        priority: "MEDIUM",
        category: "legal",
        status: "PENDING",
        userId: userId
      }
    });
    return {
      extractedTasks: [dbTask],
      statusLog: [`Triage error. Created default query task in database.`]
    };
  }
}

// 2. Routing Decision Node - Checks if current task needs a document
async function routingNode(state) {
  const { extractedTasks, routedCount } = state;

  if (routedCount >= extractedTasks.length) {
    return { nextNode: END };
  }

  const currentTask = extractedTasks[routedCount];
  const classification = await classifyTaskForRouting(currentTask);

  if (classification.requiresDocument && classification.documentType) {
    return {
      nextNode: "draft_document",
      currentDocType: classification.documentType,
      statusLog: [`Routing task "${currentTask.title}" to Document Agent for template: ${classification.documentType}.`]
    };
  }

  return {
    nextNode: "process_next",
    statusLog: [`Task "${currentTask.title}" does not require document drafting. Skipping.`]
  };
}

// 3. Draft Document Node - Invokes the Document Agent
async function draftDocumentNode(state) {
  const { userId, extractedTasks, routedCount, currentDocType } = state;
  const currentTask = extractedTasks[routedCount];

  try {
    const result = await runDocumentAgent(userId, currentTask.id, currentDocType);
    return {
      statusLog: [`Document Agent drafted: ${result.fileUrl} for task "${currentTask.title}".`]
    };
  } catch (err) {
    console.error(`Error in draftDocumentNode for task ${currentTask.id}:`, err);
    return {
      statusLog: [`Document Agent failed for task "${currentTask.title}": ${err.message}`]
    };
  }
}

// 4. Process Next Node - Increments index
async function processNextNode(state) {
  return {
    routedCount: state.routedCount + 1
  };
}

// State transition routing condition
function determineNextRoute(state) {
  return state.nextNode;
}

// Define the LangGraph workflow
const workflow = new StateGraph({
  channels: {
    userId: null,
    query: null,
    extractedTasks: {
      value: (left, right) => right,
      default: () => []
    },
    routedCount: {
      value: (left, right) => right,
      default: () => 0
    },
    nextNode: {
      value: (left, right) => right,
      default: () => ""
    },
    currentDocType: {
      value: (left, right) => right,
      default: () => null
    },
    statusLog: {
      value: (left, right) => left.concat(right),
      default: () => []
    }
  }
});

// Add nodes
workflow.addNode("triage", triageNode);
workflow.addNode("route_decision", routingNode);
workflow.addNode("draft_document", draftDocumentNode);
workflow.addNode("process_next", processNextNode);

// Set entry point
workflow.setEntryPoint("triage");

// Add connections
workflow.addEdge("triage", "route_decision");

// Route decision dynamically splits
workflow.addConditionalEdges("route_decision", determineNextRoute, {
  draft_document: "draft_document",
  process_next: "process_next",
  [END]: END
});

workflow.addEdge("draft_document", "process_next");
workflow.addEdge("process_next", "route_decision");

// Compile graph
const orchestratorApp = workflow.compile();

/**
 * Runs the orchestrator workflow.
 * @param {string} userId - User ID
 * @param {string} query - Raw text query from the user describing their needs
 */
export async function runOrchestrator(userId, query) {
  const initialState = {
    userId,
    query,
    extractedTasks: [],
    routedCount: 0,
    nextNode: "",
    currentDocType: null,
    statusLog: ["Initializing Orchestrator state machine."]
  };

  const finalState = await orchestratorApp.invoke(initialState);
  return {
    extractedTasks: finalState.extractedTasks,
    statusLog: finalState.statusLog
  };
}
