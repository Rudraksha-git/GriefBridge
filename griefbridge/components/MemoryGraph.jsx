"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Info, X } from "lucide-react";

export default function MemoryGraph({ graphNodes = [], graphEdges = [] }) {
  const [selectedNode, setSelectedNode] = useState(null);

  if (!graphNodes || graphNodes.length === 0) {
    return (
      <div className="w-full aspect-[16/9] bg-stone-50/50 border border-stone-100 rounded-2xl flex flex-col items-center justify-center text-center p-8">
        <p className="font-serif italic text-stone-400 mb-2">Knowledge graph empty</p>
        <p className="text-xs text-stone-300">Ingest some chats or audio recordings to populate memories.</p>
      </div>
    );
  }

  // Dimensions of SVG canvas
  const width = 600;
  const height = 350;
  const cx = width / 2;
  const cy = height / 2;

  // Compute node coordinates based on type
  // Deceased is in center (cx, cy)
  // Family is in tight circle
  // Others are in outer circle
  const familyNodes = graphNodes.filter((n) => n.type === "family");
  const otherNodes = graphNodes.filter((n) => n.type !== "family" && n.type !== "deceased");
  const deceasedNode = graphNodes.find((n) => n.type === "deceased") || { id: "deceased", label: "Deceased" };

  const nodePositions = {
    [deceasedNode.id]: { x: cx, y: cy },
  };

  // Layout Family nodes (radius = 75)
  familyNodes.forEach((node, i) => {
    const angle = (i * 2 * Math.PI) / familyNodes.length + Math.PI / 4;
    const r = 70;
    nodePositions[node.id] = {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });

  // Layout Outer/Asset/Story nodes (radius = 145)
  otherNodes.forEach((node, i) => {
    const angle = (i * 2 * Math.PI) / otherNodes.length;
    const r = 140;
    nodePositions[node.id] = {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });

  // Get color styles for node types
  const getNodeColor = (type) => {
    switch (type) {
      case "deceased":
        return "fill-brand-600 stroke-brand-200";
      case "family":
        return "fill-memory-600 stroke-memory-200";
      case "asset":
        return "fill-amber-600 stroke-amber-200";
      case "insurance":
        return "fill-emerald-600 stroke-emerald-200";
      case "identity":
        return "fill-stone-600 stroke-stone-200";
      case "story":
        return "fill-indigo-600 stroke-indigo-200";
      case "utility":
        return "fill-rose-600 stroke-rose-200";
      default:
        return "fill-stone-400 stroke-stone-200";
    }
  };

  // Context descriptions for clicking nodes
  const getNodeContext = (node) => {
    switch (node.id) {
      case "ramesh":
        return "Ramesh Kumar (1954 - 2026). Resided at Sector 15 Chandigarh. Deceased June 5, 2026.";
      case "savitri":
        return "Savitri Devi (Wife). Nominee for HDFC/SBI bank balance transfers.";
      case "amit":
        return "Amit Kumar (Son). Claimant for LIC Policy claims and executor assistant.";
      case "sbi":
        return "SBI Savings Account (30219488310). Balance transfer queued to Savitri Devi.";
      case "lic":
        return "LIC Policy (LIC-883012). Claim amount designated for executor Amit Kumar.";
      case "aadhaar":
        return "Aadhaar Card (4930-1829-3810). Demise deactivation filed to UIDAI.";
      case "property":
        return "Sector 15 Chandigarh House. Mutation transfer processing at Revenue Office.";
      case "recipe":
        return "Lasagna & Gajar Halwa recipes parsed from Ramesh's voice notes.";
      case "business":
        return "Business advice and 1987 printing shop closure logs preserved in transcripts.";
      case "lahore":
        return "Preserved voice recording transcripts regarding early childhood stories in Lahore.";
      case "subscriptions":
        return "Netflix/Spotify accounts flags ready for cancellation.";
      case "utilities":
        return "Electricity/Airtel bills processing next of kin transitions.";
      default:
        return `${node.label} entity connected to Ramesh's estate memories.`;
    }
  };

  return (
    <div className="relative w-full aspect-[16/9] bg-stone-50/40 border border-stone-100 rounded-2xl overflow-hidden shadow-inner">
      <svg className="w-full h-full select-none" viewBox={`0 0 ${width} ${height}`}>
        {/* Render Connection Edges */}
        <g>
          {graphEdges.map((edge, idx) => {
            const posStart = nodePositions[edge.source];
            const posEnd = nodePositions[edge.target];
            if (!posStart || !posEnd) return null;

            return (
              <g key={idx}>
                <motion.line
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.2 }}
                  transition={{ duration: 1.2, delay: 0.1 * idx }}
                  x1={posStart.x}
                  y1={posStart.y}
                  x2={posEnd.x}
                  y2={posEnd.y}
                  className="stroke-stone-300 stroke-[1.5]"
                />
                {/* Edge Label tag */}
                <text
                  x={(posStart.x + posEnd.x) / 2}
                  y={(posStart.y + posEnd.y) / 2 - 4}
                  className="fill-stone-400 font-sans text-[8px] font-semibold text-center pointer-events-none"
                  textAnchor="middle"
                >
                  {edge.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* Render Nodes */}
        <g>
          {graphNodes.map((node, idx) => {
            const pos = nodePositions[node.id];
            if (!pos) return null;

            const isDeceased = node.type === "deceased";
            const nodeSize = node.size || 12;
            const colorClass = getNodeColor(node.type);

            return (
              <motion.g
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, delay: 0.05 * idx }}
                whileHover={{ scale: 1.15 }}
                className="cursor-pointer"
                onClick={() => setSelectedNode(node)}
              >
                {/* Accent glow halo around Deceased */}
                {isDeceased && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={nodeSize + 6}
                    className="fill-brand-50/40 stroke-none animate-pulse"
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nodeSize}
                  className={`${colorClass} stroke-[2.5] filter drop-shadow-sm hover:brightness-95 transition-all`}
                />

                {/* Label text */}
                <text
                  x={pos.x}
                  y={pos.y + nodeSize + 11}
                  textAnchor="middle"
                  className="fill-stone-600 font-sans text-[9px] font-semibold tracking-wide"
                >
                  {node.label}
                </text>
              </motion.g>
            );
          })}
        </g>
      </svg>

      {/* Floating Info Card Overlay */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-stone-200/50 p-4 rounded-xl shadow-lg flex justify-between items-start gap-4"
        >
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0 text-stone-500">
              <Info size={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-800 uppercase tracking-wider">{selectedNode.label}</p>
              <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">{getNodeContext(selectedNode)}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </div>
  );
}
