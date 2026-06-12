"use client";

import Link from "next/link";
import { MessageCircle, Mic, Image as ImageIcon, Plus } from "lucide-react";
import { mockMemory } from "../../lib/mockData";
import { useState } from "react";
import { TypewriterText } from "../../components/TypewriterText";
import { FloatingMemories } from "../../components/FloatingMemories";
import { motion } from "framer-motion";

export default function LegacyPortal() {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-b from-stone-50 to-stone-100/50 -mt-8 pt-8">
      <FloatingMemories />
      
      <div className="relative z-10 max-w-2xl mx-auto py-16 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-stone-200/50 shadow-sm">
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-stone-500">
              Living Memory Vault
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif italic text-stone-800 tracking-tight mb-6 drop-shadow-sm">
            {mockMemory.name}'s memory
          </h1>
          <p className="text-base text-stone-500 max-w-md mx-auto leading-relaxed">
            A beautiful interactive archive built from {mockMemory.conversations} conversations, {mockMemory.voiceRecordings} voice recordings, and {mockMemory.photos} photographs.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-3 gap-6 mb-12"
        >
          {[
            { icon: MessageCircle, value: mockMemory.conversations, label: "Conversations" },
            { icon: Mic, value: mockMemory.voiceRecordings, label: "Recordings" },
            { icon: ImageIcon, value: mockMemory.photos, label: "Photos" }
          ].map((stat, i) => (
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              key={i} 
              className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xl shadow-stone-200/20"
            >
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                <stat.icon className="w-5 h-5 text-stone-400" />
              </div>
              <span className="text-3xl font-serif text-stone-800 mb-1">{stat.value}</span>
              <span className="text-[10px] uppercase tracking-widest font-medium text-stone-400">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white/80 backdrop-blur-2xl border border-white rounded-3xl p-8 mb-16 shadow-2xl shadow-stone-200/40 relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-stone-200 via-stone-300 to-stone-200 opacity-50"></div>
          <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-stone-400 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            {mockMemory.featuredMemory.label}
          </p>
          <div className="text-xl font-serif text-stone-700 leading-relaxed italic mb-8">
            <TypewriterText text={`"${mockMemory.featuredMemory.excerpt}"`} delay={1200} />
          </div>
          <div className="flex justify-between items-center pt-6 border-t border-stone-100">
            <span className="text-xs font-medium text-stone-400 flex items-center gap-2">
              <Mic size={14} />
              From a {mockMemory.featuredMemory.source.toLowerCase()}
            </span>
            <button className="text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors group-hover:translate-x-1 duration-300">
              Explore more memories &rarr;
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-center"
        >
          <Link
            href="/legacy/chat"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-stone-900 text-white text-sm font-medium rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-stone-900/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-stone-800 to-stone-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <MessageCircle size={18} className="relative z-10" />
            <span className="relative z-10 tracking-wide">Talk to {mockMemory.name}'s memory</span>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-24 pt-12 border-t border-stone-200/50"
        >
          {!showUpload ? (
            <div className="text-center">
              <p className="text-sm font-medium text-stone-500 mb-6">Want to enrich the legacy?</p>
              <button 
                onClick={() => setShowUpload(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/50 backdrop-blur-md border border-stone-200 text-stone-600 text-xs font-bold tracking-wide uppercase rounded-full hover:bg-white hover:shadow-md transition-all duration-300"
              >
                <Plus size={14} /> Add to {mockMemory.name}'s legacy
              </button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-8 shadow-2xl shadow-stone-200/40"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold uppercase tracking-wider text-stone-600">Upload memories</span>
                <button onClick={() => setShowUpload(false)} className="text-xs font-medium text-stone-400 hover:text-stone-800 transition-colors">Cancel</button>
              </div>
              <div className="border-dashed border-2 border-stone-200 rounded-2xl p-10 text-center hover:border-stone-400 hover:bg-stone-50/50 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-400 group-hover:bg-stone-200 group-hover:text-stone-600 transition-colors">
                  <Plus size={20} />
                </div>
                <p className="text-sm font-semibold text-stone-700 mb-2">Drop WhatsApp exports or media files here</p>
                <p className="text-xs text-stone-500 mb-4">Or click to browse from your device</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {['ZIP', 'TXT', 'PDF', 'JPG', 'PNG', 'M4A', 'MP3'].map(ext => (
                    <span key={ext} className="text-[9px] font-bold tracking-wider uppercase bg-stone-100 text-stone-500 px-2 py-1 rounded">
                      {ext}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
