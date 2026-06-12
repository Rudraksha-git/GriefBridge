"use client";

import Link from "next/link";
import { Upload } from "lucide-react";
import { mockDocuments } from "../../../lib/mockData";
import { useState } from "react";

export default function DocumentReview({ params }) {
  const [isApproved, setIsApproved] = useState(false);
  const doc = mockDocuments.find(d => d.id === params.id) || mockDocuments[0];

  return (
    <div className="max-w-5xl mx-auto py-12">
      <div className="mb-8">
        <Link href="/documents" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
          &larr; Back to documents
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
        <div className="md:col-span-3">
          <div className="bg-white border border-stone-100 rounded-2xl p-8 shadow-sm">
            <p className="text-xs text-stone-500 mb-1">{doc.title}</p>
            <p className="text-sm font-medium text-stone-800 mb-8">{doc.institution}</p>
            
            <div className="font-serif text-stone-700 space-y-4 leading-relaxed">
              <p>To Whom It May Concern,</p>
              <p>
                I am writing to formally request the closure of the account associated with the late 
                <span className="bg-brand-50 agent-filled px-1 mx-1 rounded text-brand-800">Robert Kumar</span>, 
                who passed away on <span className="bg-brand-50 agent-filled px-1 mx-1 rounded text-brand-800">January 10, 2025</span>.
              </p>
              <p>
                The account number in question is <span className="bg-brand-50 agent-filled px-1 mx-1 rounded text-brand-800">4821 0092 1102</span>.
              </p>
              <p>
                Please find the required documentation attached, including the death certificate. Kindly advise on the next steps to process the account closure and transfer any remaining balance to the designated executor account.
              </p>
              <p className="pt-4">Sincerely,</p>
              <p>The Executor Agent on behalf of the family</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="space-y-8 sticky top-8">
            <section>
              <h4 className="text-[11px] font-medium tracking-[0.1em] uppercase text-stone-400 mb-4">Filled by the agent</h4>
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-xs text-stone-400">Account holder</p>
                  <p className="text-sm text-stone-700 font-medium">Robert Kumar</p>
                </div>
                <div>
                  <p className="text-xs text-stone-400">Date of death</p>
                  <p className="text-sm text-stone-700 font-medium">Jan 10, 2025</p>
                </div>
                <div>
                  <p className="text-xs text-stone-400">Account number</p>
                  <p className="text-sm text-stone-700 font-medium">4821 0092 1102</p>
                </div>
              </div>
            </section>

            <section>
              <h4 className="text-[11px] font-medium tracking-[0.1em] uppercase text-stone-400 mb-4">Still needed from you</h4>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-sm text-stone-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Copy of Death Certificate
                </li>
              </ul>
              
              <div className="border-dashed border border-stone-200 rounded-xl p-6 text-center hover:bg-stone-50 transition-colors cursor-pointer">
                <Upload className="w-6 h-6 text-stone-300 mx-auto mb-2" />
                <p className="text-sm text-stone-400 mb-1">Drop files here or click to upload</p>
                <p className="text-[11px] text-stone-300">PDF, JPG, PNG</p>
              </div>
            </section>

            <div className="pt-4 border-t border-stone-100">
              {isApproved ? (
                <p className="text-sm text-memory-600 font-medium text-center py-2">
                  Approved. We'll send this shortly.
                </p>
              ) : (
                <>
                  <button className="w-full mb-2 px-4 py-2.5 text-sm font-medium border border-stone-200 text-stone-600 rounded-lg hover:bg-stone-50 transition-colors">
                    Request changes
                  </button>
                  <button 
                    onClick={() => setIsApproved(true)}
                    className="w-full px-4 py-2.5 text-sm font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-800 transition-colors"
                  >
                    Approve & send
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
