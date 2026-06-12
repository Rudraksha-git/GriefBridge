"use client";

import Link from "next/link";
import CompanionChat from "../../../components/CompanionChat";
import { mockMessages, mockMemory } from "../../../lib/mockData";
import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState(mockMessages);

  const handleSend = (text) => {
    // Add user message
    const newUserMsg = { role: 'user', content: text, timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setMessages(prev => [...prev, newUserMsg]);

    // Simulate agent response
    setTimeout(() => {
      const newAgentMsg = { 
        role: 'agent', 
        content: "I'm still processing Robert's memories, but I can tell you he valued patience above all else.", 
        source: "General knowledge",
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      setMessages(prev => [...prev, newAgentMsg]);
    }, 1500);
  };

  const suggestions = [
    "His childhood stories",
    "Advice on setbacks",
    "Family recipes",
    "How he started his business"
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 min-h-screen bg-stone-50">
      {/* Context Panel */}
      <div className="md:col-span-1 bg-stone-50 border-r border-stone-100 p-6 flex flex-col h-screen overflow-y-auto hidden md:flex">
        <Link href="/legacy" className="text-[11px] font-medium tracking-[0.1em] uppercase text-stone-400 hover:text-stone-600 transition-colors mb-12">
          &larr; Legacy portal
        </Link>

        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-lg font-medium mb-3">
            {mockMemory.name.charAt(0)}
          </div>
          <h1 className="font-serif italic text-xl text-stone-800">{mockMemory.name}</h1>
          <p className="text-[11px] text-stone-400 mt-1">{mockMemory.years}</p>
        </div>

        <div className="w-8 h-[1px] bg-stone-200 mx-auto mb-8" />

        <div className="text-center mb-8">
          <p className="text-xs text-stone-400 mb-1">{mockMemory.conversations} conversations</p>
          <p className="text-xs text-stone-400 mb-1">{mockMemory.voiceRecordings} voice recordings</p>
          <p className="text-xs text-stone-400">{mockMemory.photos} photographs</p>
        </div>

        <div className="w-8 h-[1px] bg-stone-200 mx-auto mb-8" />

        <div className="flex-1">
          <p className="text-[10px] font-medium tracking-widest uppercase text-stone-400 text-center mb-4">
            Suggested
          </p>
          <div className="flex flex-col gap-2">
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => handleSend(suggestion)}
                className="text-xs text-stone-500 bg-white border border-stone-100 px-3 py-2.5 rounded-lg hover:border-brand-200 hover:text-brand-600 transition-colors text-left"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="md:col-span-3 h-screen">
        <CompanionChat messages={messages} onSend={handleSend} />
      </div>
    </div>
  );
}
