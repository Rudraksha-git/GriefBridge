"use client";

import Link from "next/link";
import CompanionChat from "../../../components/CompanionChat";
import { useState, useEffect } from "react";
import { Loader2, RotateCcw } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    name: "Ramesh",
    years: "1954 – 2026",
    conversations: 0,
    voiceRecordings: 0,
    photos: 0
  });

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/companion/history");
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Error fetching chat history:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/memory/status");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching status stats:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, []);

  const handleSend = async (text) => {
    // Add user message locally
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newUserMsg = { role: 'user', content: text, timestamp };
    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/companion/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      if (!res.ok) throw new Error("Agent connection failed");

      const data = await res.json();

      // Format source string for citation UI
      let sourceText = null;
      if (data.sources && data.sources.length > 0) {
        const src = data.sources[0];
        const typeLabel = src.type === "audio" ? "Voice memo" : src.type === "image" ? "Photo metadata" : "Document";
        sourceText = `${typeLabel} · ${src.sourceFile || "unknown"}`;
      }

      const newAgentMsg = {
        role: 'agent',
        content: data.answer,
        source: sourceText,
        timestamp
      };

      setMessages(prev => [...prev, newAgentMsg]);
    } catch (err) {
      console.error("Error calling agent:", err);
      const newAgentMsg = {
        role: 'agent',
        content: "I'm having trouble retrieving memories from the vault right now. Please verify your connection.",
        timestamp
      };
      setMessages(prev => [...prev, newAgentMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm("Are you sure you want to clear this conversation history?")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/companion/history", {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
      alert("Chat history reset to seed records.");
    } catch (err) {
      console.error("Error resetting chat:", err);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "His childhood stories",
    "Advice on setbacks",
    "Family recipes",
    "How he started his business"
  ];

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-32 text-center flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin mb-4" />
        <p className="text-sm text-stone-400 font-serif italic">Accessing companion conversation...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 min-h-screen bg-stone-50 -mt-8">
      {/* Context Sidebar Panel */}
      <div className="md:col-span-1 bg-stone-50 border-r border-stone-200/60 p-6 flex flex-col h-[calc(100vh-64px)] overflow-y-auto hidden md:flex sticky top-16">
        <Link 
          href="/legacy" 
          className="text-[11px] font-medium tracking-[0.1em] uppercase text-stone-400 hover:text-stone-600 transition-colors mb-12"
        >
          &larr; Legacy portal
        </Link>

        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-lg font-medium mb-3">
            {stats.name?.charAt(0)}
          </div>
          <h1 className="font-serif italic text-xl text-stone-800">{stats.name}</h1>
          <p className="text-[11px] text-stone-400 mt-1">{stats.years}</p>
        </div>

        <div className="w-8 h-[1px] bg-stone-200 mx-auto mb-8" />

        <div className="text-center mb-8">
          <p className="text-xs text-stone-400 mb-1">{stats.conversations} conversations</p>
          <p className="text-xs text-stone-400 mb-1">{stats.voiceRecordings} voice notes</p>
          <p className="text-xs text-stone-400">{stats.photos} photographs</p>
        </div>

        <div className="w-8 h-[1px] bg-stone-200 mx-auto mb-8" />

        <div className="flex-1 space-y-8">
          <div>
            <p className="text-[10px] font-medium tracking-widest uppercase text-stone-400 text-center mb-4">
              Suggested
            </p>
            <div className="flex flex-col gap-2">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(suggestion)}
                  className="text-xs text-stone-500 bg-white border border-stone-100 px-3 py-2.5 rounded-lg hover:border-brand-200 hover:text-brand-600 transition-colors text-left font-medium"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleClearHistory}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 border border-stone-200 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <RotateCcw size={12} />
            Reset Chat
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="md:col-span-3 h-[calc(100vh-64px)] relative flex flex-col bg-white">
        <CompanionChat messages={messages} onSend={handleSend} isTyping={isTyping} />
      </div>
    </div>
  );
}
