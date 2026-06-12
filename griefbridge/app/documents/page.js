"use client";

import Link from "next/link";
import { FileText, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch("/api/documents");
        const data = await res.json();
        if (data.documents) {
          setDocuments(data.documents);
        }
      } catch (err) {
        console.error("Error fetching documents:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'draft': return <span className="bg-brand-50 text-brand-600 text-[11px] font-medium px-2 py-0.5 rounded uppercase tracking-wider">Draft ready</span>;
      case 'generated': return <span className="bg-brand-100 text-brand-700 text-[11px] font-medium px-2 py-0.5 rounded uppercase tracking-wider">Generated</span>;
      case 'signed': return <span className="bg-memory-50 text-memory-600 text-[11px] font-medium px-2 py-0.5 rounded uppercase tracking-wider">Approved</span>;
      case 'submitted': return <span className="bg-stone-100 text-stone-500 text-[11px] font-medium px-2 py-0.5 rounded uppercase tracking-wider">Sent</span>;
      default: return <span className="bg-stone-50 text-stone-500 text-[11px] font-medium px-2 py-0.5 rounded uppercase tracking-wider">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-32 text-center flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin mb-4" />
        <p className="text-sm text-stone-400 font-serif italic">Accessing document records...</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <FileText className="w-8 h-8 text-stone-200 mx-auto mb-4" />
        <p className="text-stone-800 font-medium mb-1">Nothing drafted yet.</p>
        <p className="text-sm text-stone-400">
          The Executor Agent will prepare documents as tasks progress. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-stone-400 mb-3">
        Documents
      </p>
      <h1 className="text-3xl font-serif italic text-stone-800 tracking-tight mb-2">
        Drafted on your behalf
      </h1>
      <p className="text-sm text-stone-400 mb-10">
        Review each document before it's sent. Nothing goes out without your approval.
      </p>

      <div className="flex flex-col border-t border-stone-100">
        {documents.map(doc => (
          <div key={doc.id} className="py-4 border-b border-stone-100 flex items-start gap-4">
            <div className="text-stone-300 mt-0.5">
              <FileText size={18} />
            </div>
            
            <div className="flex-1">
              <h3 className="text-sm font-medium text-stone-700 mb-0.5">{doc.title}</h3>
              <p className="text-xs text-stone-400">{doc.type?.toUpperCase()} &middot; Drafted</p>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              {getStatusBadge(doc.status)}
              {doc.status?.toLowerCase() !== 'submitted' && (
                <Link 
                  href={`/documents/${doc.id}`}
                  className="text-[11px] font-medium px-3 py-1 rounded border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors"
                >
                  Review &rarr;
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
