"use client";

import Link from "next/link";
import { MessageCircle, Mic, Image as ImageIcon, Plus, Loader2, FileText, X } from "lucide-react";
import { useState, useEffect } from "react";
import { TypewriterText } from "../../components/TypewriterText";
import { FloatingMemories } from "../../components/FloatingMemories";
import MemoryGraph from "../../components/MemoryGraph";
import { motion, AnimatePresence } from "framer-motion";

export default function LegacyPortal() {
  const [showUpload, setShowUpload] = useState(false);
  const [stats, setStats] = useState({
    name: "Ramesh",
    years: "1954 – 2026",
    conversations: 0,
    voiceRecordings: 0,
    photos: 0,
    documents: 0,
    total: 0
  });
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [featuredMemory, setFeaturedMemory] = useState({
    label: "A memory — June 2026",
    excerpt: "He always valued patience in all things. \"Low heat, beta. Good things take time.\"",
    source: "Voice memo"
  });

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/memory/status");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching memory stats:", err);
    }
  };

  const fetchGraphData = async () => {
    try {
      const res = await fetch("/api/memory/graph");
      const data = await res.json();
      setGraphData(data);
    } catch (err) {
      console.error("Error fetching graph data:", err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      await Promise.all([fetchStats(), fetchGraphData()]);
      setLoading(false);
    };
    loadAll();
  }, []);

  // Update featured memory dynamically if memories are loaded
  useEffect(() => {
    if (graphData.nodes?.length > 3) {
      setFeaturedMemory({
        label: "Primary Legacy Insight",
        excerpt: "State Bank of India account balance is designated for Savitri Devi. LIC insurance claims are routed to Amit Kumar.",
        source: "Financial & Legal Records"
      });
    }
  }, [graphData]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadStatus("Uploading files...");

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append("files", file);
    });
    formData.append("speakerLabel", "Papa");

    try {
      setUploadStatus("Agent processing files (Whisper speech-to-text & Vision captioning)...");
      const res = await fetch("/api/memory/ingest", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        throw new Error("Failed to process ingestion");
      }

      const data = await res.json();
      alert(`Ingested successfully! Stored ${data.totalStored} memory chunks.`);
      
      setShowUpload(false);
      setSelectedFiles([]);
      setLoading(true);
      
      await Promise.all([fetchStats(), fetchGraphData()]);
    } catch (err) {
      console.error("Ingestion upload error:", err);
      alert("Error ingesting memory: " + err.message);
    } finally {
      setUploading(false);
      setUploadStatus("");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-32 text-center flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin mb-4" />
        <p className="text-sm text-stone-400 font-serif italic">Accessing legacy vault...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-y-auto bg-gradient-to-b from-stone-50 to-stone-100/50 -mt-8 pt-8 px-4 sm:px-6">
      <FloatingMemories />
      
      <div className="relative z-10 max-w-4xl mx-auto py-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-stone-200/50 shadow-sm">
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-stone-500">
              Living Memory Vault
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif italic text-stone-800 tracking-tight mb-4 drop-shadow-sm">
            {stats.name}'s memory
          </h1>
          <p className="text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
            An interactive archive built from {stats.conversations} chats, {stats.voiceRecordings} voice notes, and {stats.photos} photographs.
          </p>
        </motion.div>

        {/* Stats Blocks */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          {[
            { icon: MessageCircle, value: stats.conversations, label: "Chat Messages" },
            { icon: Mic, value: stats.voiceRecordings, label: "Recordings" },
            { icon: ImageIcon, value: stats.photos, label: "Photos" },
            { icon: FileText, value: stats.documents, label: "Documents" }
          ].map((stat, i) => (
            <motion.div 
              whileHover={{ y: -3, scale: 1.01 }}
              key={i} 
              className="bg-white/80 backdrop-blur-xl border border-stone-100 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm"
            >
              <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center mb-3">
                <stat.icon className="w-4 h-4 text-stone-400" />
              </div>
              <span className="text-2xl font-serif text-stone-800 mb-0.5">{stat.value}</span>
              <span className="text-[9px] uppercase tracking-wider font-semibold text-stone-400">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Dynamic Knowledge Graph Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mb-8"
        >
          <div className="bg-white border border-stone-100 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-semibold text-stone-700">Preserved Memory Relationships</h3>
                <p className="text-[11px] text-stone-400">Click entities inside the memory graph to view context</p>
              </div>
            </div>
            <MemoryGraph graphNodes={graphData.nodes} graphEdges={graphData.edges} />
          </div>
        </motion.div>

        {/* Featured Memory Insight */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white/90 backdrop-blur-2xl border border-stone-100 rounded-3xl p-8 mb-12 shadow-sm relative overflow-hidden group"
        >
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-stone-400 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            {featuredMemory.label}
          </p>
          <div className="text-lg font-serif text-stone-700 leading-relaxed italic mb-6">
            <TypewriterText text={`"${featuredMemory.excerpt}"`} delay={1200} />
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-stone-100">
            <span className="text-xs font-medium text-stone-400 flex items-center gap-2">
              <Mic size={13} className="text-stone-300" />
              Source: {featuredMemory.source}
            </span>
            <Link 
              href="/legacy/chat"
              className="text-xs font-medium text-brand-600 hover:text-brand-800 transition-colors group-hover:translate-x-1 duration-300"
            >
              Ask Companion &rarr;
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center flex flex-col sm:flex-row justify-center gap-4 items-center"
        >
          <Link
            href="/legacy/chat"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-md shadow-stone-900/10"
          >
            <MessageCircle size={16} />
            Talk to {stats.name}'s legacy
          </Link>

          <button 
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white border border-stone-200 text-stone-600 text-xs font-semibold tracking-wider uppercase rounded-full hover:bg-stone-50 hover:shadow-sm transition-all duration-300"
          >
            <Plus size={16} /> Ingest raw files
          </button>
        </motion.div>

        {/* Upload Overlay Modal */}
        <AnimatePresence>
          {showUpload && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-stone-950/20 backdrop-blur-md z-50 flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="max-w-md w-full bg-white border border-stone-100 rounded-3xl p-6 shadow-2xl relative"
              >
                <button 
                  onClick={() => !uploading && setShowUpload(false)}
                  disabled={uploading}
                  className="absolute right-4 top-4 text-stone-400 hover:text-stone-700 disabled:opacity-50 transition-colors"
                >
                  <X size={18} />
                </button>

                <h3 className="text-base font-serif italic text-stone-800 mb-2">Ingest Memories</h3>
                <p className="text-xs text-stone-400 mb-6">Upload raw voice notes, chat files or scanned records to structuralize into the legacy graph.</p>

                <form onSubmit={handleUploadSubmit} className="space-y-4">
                  <div className="border-dashed border-2 border-stone-200 rounded-2xl p-8 text-center hover:border-brand-300 hover:bg-stone-50/50 transition-all cursor-pointer relative">
                    <input 
                      type="file" 
                      multiple 
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center mx-auto mb-3 text-stone-400">
                      <Plus size={18} />
                    </div>
                    <p className="text-xs font-semibold text-stone-700 mb-1">
                      {selectedFiles.length > 0 ? `${selectedFiles.length} files selected` : "Select files to ingest"}
                    </p>
                    <p className="text-[10px] text-stone-400">ZIP chats, WAV recordings, PDF/images</p>
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="bg-stone-50 rounded-xl p-3 max-h-[100px] overflow-y-auto border border-stone-100">
                      <p className="text-[10px] font-bold text-stone-400 uppercase mb-2">Files queue</p>
                      <ul className="space-y-1">
                        {selectedFiles.map((f, idx) => (
                          <li key={idx} className="text-[10px] text-stone-600 truncate">{f.name} ({(f.size / 1024).toFixed(1)} KB)</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {uploading ? (
                    <div className="flex flex-col items-center gap-2 py-3">
                      <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
                      <p className="text-xs text-brand-700 font-medium animate-pulse text-center">{uploadStatus}</p>
                    </div>
                  ) : (
                    <button 
                      type="submit"
                      disabled={selectedFiles.length === 0}
                      className="w-full py-2.5 bg-brand-600 text-white font-medium text-xs uppercase tracking-wider rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50"
                    >
                      Process Ingestion
                    </button>
                  )}
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
