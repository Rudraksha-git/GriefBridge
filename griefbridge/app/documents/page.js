"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { mockDocuments } from "../../lib/mockData";

export default function Documents() {
  if (mockDocuments.length === 0) {
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'draft_ready': return <span className="bg-brand-50 text-brand-600 text-[11px] font-medium px-2 py-0.5 rounded uppercase tracking-wider">Draft ready</span>;
      case 'pending_approval': return <span className="bg-amber-50 text-amber-700 text-[11px] font-medium px-2 py-0.5 rounded uppercase tracking-wider">Awaiting your approval</span>;
      case 'approved': return <span className="bg-memory-50 text-memory-600 text-[11px] font-medium px-2 py-0.5 rounded uppercase tracking-wider">Approved</span>;
      case 'sent': return <span className="bg-stone-100 text-stone-500 text-[11px] font-medium px-2 py-0.5 rounded uppercase tracking-wider">Sent</span>;
      default: return null;
    }
  };

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
        {mockDocuments.map(doc => (
          <div key={doc.id} className="py-4 border-b border-stone-100 flex items-start gap-4">
            <div className="text-stone-300 mt-0.5">
              <FileText size={18} />
            </div>
            
            <div className="flex-1">
              <h3 className="text-sm font-medium text-stone-700 mb-0.5">{doc.title}</h3>
              <p className="text-xs text-stone-400">{doc.institution} &middot; {doc.category}</p>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              {getStatusBadge(doc.status)}
              {doc.status !== 'sent' && (
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
