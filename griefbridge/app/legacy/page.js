"use client";

import Link from "next/link";
import { MessageCircle, Mic, Image as ImageIcon, Plus } from "lucide-react";
import { mockMemory } from "../../lib/mockData";
import { useState } from "react";

export default function LegacyPortal() {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="max-w-xl mx-auto py-16">
      <div className="text-center mb-12">
        <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-stone-400 mb-4">
          Living memory
        </p>
        <h1 className="text-4xl font-serif italic text-stone-800 tracking-tight mb-3">
          {mockMemory.name}'s memory
        </h1>
        <p className="text-sm text-stone-400">
          Built from {mockMemory.conversations} conversations, {mockMemory.voiceRecordings} voice recordings, and {mockMemory.photos} photographs.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-stone-50 rounded-xl p-5 flex flex-col items-center justify-center text-center">
          <MessageCircle className="w-5 h-5 text-stone-300 mb-2" />
          <span className="text-2xl font-serif text-stone-700">{mockMemory.conversations}</span>
          <span className="text-[10px] uppercase tracking-wider text-stone-400 mt-1">Conversations</span>
        </div>
        <div className="bg-stone-50 rounded-xl p-5 flex flex-col items-center justify-center text-center">
          <Mic className="w-5 h-5 text-stone-300 mb-2" />
          <span className="text-2xl font-serif text-stone-700">{mockMemory.voiceRecordings}</span>
          <span className="text-[10px] uppercase tracking-wider text-stone-400 mt-1">Recordings</span>
        </div>
        <div className="bg-stone-50 rounded-xl p-5 flex flex-col items-center justify-center text-center">
          <ImageIcon className="w-5 h-5 text-stone-300 mb-2" />
          <span className="text-2xl font-serif text-stone-700">{mockMemory.photos}</span>
          <span className="text-[10px] uppercase tracking-wider text-stone-400 mt-1">Photos</span>
        </div>
      </div>

      <div className="bg-white border border-stone-100 rounded-2xl p-7 mb-12 shadow-sm">
        <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-stone-400 mb-4">
          {mockMemory.featuredMemory.label}
        </p>
        <p className="font-serif italic text-lg text-stone-700 leading-relaxed mb-4">
          "{mockMemory.featuredMemory.excerpt}"
        </p>
        <div className="flex justify-between items-center mt-6">
          <span className="text-[11px] text-stone-400">
            — From a {mockMemory.featuredMemory.source.toLowerCase()}
          </span>
          <button className="text-xs text-stone-500 hover:text-stone-800 transition-colors">
            Explore more memories &rarr;
          </button>
        </div>
      </div>

      <div className="text-center py-12">
        <p className="text-sm text-stone-400 mb-5">
          {mockMemory.name}'s memory is ready to talk.
        </p>
        <Link
          href="/legacy/chat"
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-memory-600 text-white text-sm font-medium rounded-xl hover:bg-memory-800 transition-colors shadow-sm"
        >
          <MessageCircle size={15} />
          Talk to {mockMemory.name}'s memory
        </Link>
      </div>

      <div className="mt-16 border-t border-stone-100 pt-12">
        {!showUpload ? (
          <div className="text-center">
            <p className="text-xs text-stone-400 mb-4">Have more photos, voice notes, or messages?</p>
            <button 
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-stone-200 text-stone-600 text-xs font-medium rounded-xl hover:bg-stone-50 transition-colors"
            >
              + Add to Robert's legacy
            </button>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium text-stone-500">Upload memories</span>
              <button onClick={() => setShowUpload(false)} className="text-xs text-stone-400 hover:text-stone-600">Cancel</button>
            </div>
            <div className="border-dashed border-2 border-stone-200 rounded-2xl p-8 text-center hover:border-stone-300 hover:bg-stone-50/50 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center mx-auto mb-3 text-stone-400">
                <Plus size={16} />
              </div>
              <p className="text-sm font-medium text-stone-700 mb-1">Drop WhatsApp exports or media files here</p>
              <p className="text-xs text-stone-400 mb-3">Or click to browse from your device</p>
              <p className="text-[10px] text-stone-300">ZIP, TXT, PDF, JPG, PNG, M4A, MP3</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
