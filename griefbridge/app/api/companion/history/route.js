import { getUserId } from "../../../../lib/auth.js";
import { NextResponse } from "next/server.js";
import fs from "fs";
import path from "path";

const chatHistoryPath = path.join(process.cwd(), "data", "chatHistory.json");

const defaultSeedMessages = [
  {
    id: "seed_1",
    role: "user",
    content: "What was Dad's advice about setbacks in business?",
    timestamp: "10:14 AM"
  },
  {
    id: "seed_2",
    role: "agent",
    content: 'Robert often said: "Every setback is a setup for something better — but only if you\'re honest about what went wrong." He first mentioned this when the printing shop nearly closed in 1987, and returned to it many times after.',
    source: "Voice memo · March 2022",
    timestamp: "10:14 AM"
  },
  {
    id: "seed_3",
    role: "user",
    content: "Did he write down his lasagna recipe anywhere?",
    timestamp: "10:16 AM"
  },
  {
    id: "seed_4",
    role: "agent",
    content: 'He never wrote it formally, but he described it step by step in a voice recording from March 2022. He was very clear that the ragù should never be rushed — "low heat, always." I\'ve saved it as a recipe you can view.',
    source: "Voice memo · March 2022",
    timestamp: "10:16 AM"
  }
];

export async function GET(request) {
  try {
    const userId = await getUserId();

    if (!fs.existsSync(chatHistoryPath)) {
      return NextResponse.json({ messages: defaultSeedMessages });
    }

    const fileContent = fs.readFileSync(chatHistoryPath, "utf8");
    const history = JSON.parse(fileContent || "{}");
    const userMessages = history[userId];

    if (!userMessages || userMessages.length === 0) {
      return NextResponse.json({ messages: defaultSeedMessages });
    }

    return NextResponse.json({ messages: userMessages });

  } catch (error) {
    console.error("GET /api/companion/history error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const userId = await getUserId();

    if (fs.existsSync(chatHistoryPath)) {
      const fileContent = fs.readFileSync(chatHistoryPath, "utf8");
      const history = JSON.parse(fileContent || "{}");
      
      history[userId] = [];
      
      fs.writeFileSync(chatHistoryPath, JSON.stringify(history, null, 2), "utf8");
    }

    return NextResponse.json({ message: "Conversation history cleared successfully", messages: defaultSeedMessages });

  } catch (error) {
    console.error("DELETE /api/companion/history error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
