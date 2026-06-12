import { getUserId } from "../../../../lib/auth.js";
import prisma from "../../../../lib/prisma.js";
import { NextResponse } from "next/server.js";

export async function GET(request) {
  try {
    const userId = await getUserId();

    const memories = await prisma.memory.findMany({
      where: { userId }
    });

    // Central core nodes
    const nodes = [
      { id: "ramesh", label: "Ramesh Kumar", type: "deceased", size: 25, val: 30 },
      { id: "savitri", label: "Savitri Devi", type: "family", size: 18, val: 18 },
      { id: "amit", label: "Amit Kumar", type: "family", size: 18, val: 18 }
    ];

    const edges = [
      { source: "savitri", target: "ramesh", label: "Wife" },
      { source: "amit", target: "ramesh", label: "Son" }
    ];

    // Helper to check if node exists
    const hasNode = (id) => nodes.some(n => n.id === id);

    // Scan memory contents for keywords to dynamically build graph
    for (const mem of memories) {
      const content = mem.content.toLowerCase();

      if ((content.includes("sbi") || content.includes("bank") || content.includes("savings")) && !hasNode("sbi")) {
        nodes.push({ id: "sbi", label: "SBI Savings", type: "asset", size: 14, val: 12 });
        edges.push({ source: "sbi", target: "ramesh", label: "Bank Account" });
        edges.push({ source: "savitri", target: "sbi", label: "Nominee" });
      }

      if ((content.includes("lic") || content.includes("insurance") || content.includes("claim")) && !hasNode("lic")) {
        nodes.push({ id: "lic", label: "LIC Policy", type: "insurance", size: 14, val: 12 });
        edges.push({ source: "lic", target: "ramesh", label: "Life Cover" });
        edges.push({ source: "amit", target: "lic", label: "Claimant" });
      }

      if ((content.includes("aadhaar") || content.includes("uidai")) && !hasNode("aadhaar")) {
        nodes.push({ id: "aadhaar", label: "Aadhaar Card", type: "identity", size: 12, val: 10 });
        edges.push({ source: "aadhaar", target: "ramesh", label: "Verification" });
      }

      if ((content.includes("property") || content.includes("sector 15") || content.includes("mutation") || content.includes("house")) && !hasNode("property")) {
        nodes.push({ id: "property", label: "Sector 15 House", type: "asset", size: 14, val: 12 });
        edges.push({ source: "property", target: "ramesh", label: "Residence" });
        edges.push({ source: "savitri", target: "property", label: "Mutation" });
      }

      if ((content.includes("recipe") || content.includes("lasagna") || content.includes("halwa") || content.includes("kheer") || content.includes("dal")) && !hasNode("recipe")) {
        nodes.push({ id: "recipe", label: "Family Recipes", type: "story", size: 14, val: 12 });
        edges.push({ source: "recipe", target: "ramesh", label: "Legacy" });
      }

      if ((content.includes("printing") || content.includes("business") || content.includes("setback") || content.includes("career") || content.includes("advice")) && !hasNode("business")) {
        nodes.push({ id: "business", label: "Career & Business", type: "story", size: 14, val: 12 });
        edges.push({ source: "business", target: "ramesh", label: "Advice" });
        edges.push({ source: "amit", target: "business", label: "Guidance" });
      }

      if ((content.includes("lahore") || content.includes("childhood") || content.includes("partition")) && !hasNode("lahore")) {
        nodes.push({ id: "lahore", label: "Lahore Childhood", type: "story", size: 14, val: 12 });
        edges.push({ source: "lahore", target: "ramesh", label: "History" });
      }

      if ((content.includes("netflix") || content.includes("spotify") || content.includes("subscription")) && !hasNode("subscriptions")) {
        nodes.push({ id: "subscriptions", label: "Digital Accounts", type: "utility", size: 12, val: 10 });
        edges.push({ source: "subscriptions", target: "ramesh", label: "Subscribed" });
      }

      if ((content.includes("airtel") || content.includes("electricity")) && !hasNode("utilities")) {
        nodes.push({ id: "utilities", label: "Utility Connections", type: "utility", size: 12, val: 10 });
        edges.push({ source: "utilities", target: "ramesh", label: "Utility" });
      }
    }

    return NextResponse.json({ nodes, edges });
  } catch (error) {
    console.error("GET /api/memory/graph error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
