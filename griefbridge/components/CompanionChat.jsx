"use client";

import { ArrowUp } from "lucide-react";
import { useState } from "react";
import TypingIndicator from "./TypingIndicator";

export default function CompanionChat({ messages, onSend, isTyping }) {
  const [input, setInput] = useState("");
  const hasMessages = messages.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      {/* Header */}
      <div className="border-b border-stone-100 bg-white px-8 py-4 shrink-0">
        <h2 className="text-sm font-medium text-stone-500 mb-0.5">Memory companion</h2>
        <p className="text-[11px] text-stone-400">Answers drawn from Robert's preserved memories</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-8 flex flex-col items-center">
        <div className="w-full max-w-xl flex flex-col gap-6">
          {!hasMessages ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
              <p className="font-serif italic text-stone-400 text-lg mb-2">
                "What would you like to remember?"
              </p>
              <p className="text-xs text-stone-300">
                Ask anything — a story, a recipe, a piece of advice.
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`chat-message flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div 
                    className={`text-sm px-4 py-3 max-w-[85%] sm:max-w-[75%] ${
                      msg.role === 'user' 
                        ? 'bg-brand-600 text-white rounded-2xl rounded-br-sm' 
                        : 'bg-white border border-stone-100 text-stone-700 rounded-2xl rounded-bl-sm shadow-sm'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {msg.role === 'agent' && msg.source && (
                    <span 
                      className="text-[11px] text-stone-400 mt-1.5 px-2 block"
                      style={{ animation: 'fadeInUp 0.4s 0.3s both' }}
                    >
                      — {msg.source}
                    </span>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex flex-col items-start chat-message">
                  <TypingIndicator />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-stone-100 bg-white px-8 py-5 shrink-0 flex flex-col items-center">
        <div className="w-full max-w-xl">
          <form 
            onSubmit={handleSubmit}
            className="relative flex items-end gap-2"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Robert something..."
              className="chat-input w-full bg-stone-50 border border-stone-100 rounded-2xl pl-4 pr-12 py-3 text-sm text-stone-700 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 resize-none min-h-[44px]"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="btn-primary absolute right-2 bottom-2 w-[36px] h-[36px] rounded-full bg-brand-600 text-white flex items-center justify-center hover:bg-brand-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowUp size={18} />
            </button>
          </form>
          {hasMessages && (
            <p className="text-center text-[10px] text-stone-300 mt-3">
              Treat as a remembrance, not a record.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
