import { getUserId } from "../../../../lib/auth.js";
import { askCompanion } from "../../../../agents/companionAgent.js";
import { NextResponse } from "next/server.js";
import fs from "fs";
import path from "path";

export async function POST(request) {
  try {
    const userId = await getUserId();
    const body = await request.json();
    const question = body.message || body.question;

    if (!question) {
      return NextResponse.json({ error: "Question/message is required" }, { status: 400 });
    }

    console.log(`Companion chat query: "${question}" for user: ${userId}`);
    const result = await askCompanion(userId, question);

    // Append to local chat history file
    const chatHistoryPath = path.join(process.cwd(), "data", "chatHistory.json");
    
    // Ensure data directory exists
    const dataDir = path.dirname(chatHistoryPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    let history = {};
    if (fs.existsSync(chatHistoryPath)) {
      try {
        const fileContent = fs.readFileSync(chatHistoryPath, "utf8");
        history = JSON.parse(fileContent || "{}");
      } catch (err) {
        history = {};
      }
    }

    if (!history[userId]) {
      history[userId] = [];
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Append user message
    history[userId].push({
      id: `msg_user_${Date.now()}`,
      role: "user",
      content: question,
      timestamp
    });

    // Determine primary source text
    let sourceText = null;
    if (result.sources && result.sources.length > 0) {
      const src = result.sources[0];
      const typeLabel = src.type === "audio" ? "Voice memo" : src.type === "image" ? "Photo metadata" : "Document";
      sourceText = `${typeLabel} · ${src.sourceFile || "unknown"}`;
    }

    // Append agent message
    history[userId].push({
      id: `msg_agent_${Date.now()}`,
      role: "agent",
      content: result.answer,
      source: sourceText,
      timestamp
    });

    fs.writeFileSync(chatHistoryPath, JSON.stringify(history, null, 2), "utf8");

    return NextResponse.json({
      answer: result.answer,
      sources: result.sources,
      grounded: result.grounded
    });

  } catch (error) {
    console.error("POST /api/companion/chat error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
