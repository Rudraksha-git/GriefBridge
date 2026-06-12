"use client";

import Link from "next/link";
import { Upload, Loader2, Download, Check, Save } from "lucide-react";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function DocumentReview({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(false);
  const [formFields, setFormFields] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchDoc = async () => {
    try {
      const res = await fetch(`/api/documents/${params.id}`);
      if (!res.ok) throw new Error("Document not found");
      const data = await res.json();
      setDoc(data.document);
      setFormFields(data.document.content || {});
      setIsApproved(data.document.status?.toLowerCase() === "signed");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoc();
  }, [params.id]);

  const handleFieldChange = (key, value) => {
    setFormFields(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/documents/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: formFields
        })
      });
      if (!res.ok) throw new Error("Failed to save changes");
      const data = await res.json();
      setDoc(data.document);
      alert("Changes saved and PDF regenerated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save changes: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async () => {
    try {
      const res = await fetch(`/api/documents/${params.id}/approve`, {
        method: "POST"
      });
      if (!res.ok) throw new Error("Failed to approve document");
      setIsApproved(true);
      
      // Also complete the task in background
      if (doc.taskId) {
        await fetch(`/api/tasks/${doc.taskId}/approve`, { method: "POST" });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to approve: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-32 text-center flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin mb-4" />
        <p className="text-sm text-stone-400 font-serif italic">Loading draft details...</p>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="max-w-2xl mx-auto py-32 text-center">
        <p className="text-xl font-serif italic text-stone-400">Document not found.</p>
        <Link href="/documents" className="text-sm text-brand-600 hover:underline mt-4 inline-block">
          Back to documents
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12">
      <div className="mb-8 flex justify-between items-center">
        <Link href="/documents" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
          &larr; Back to documents
        </Link>
        
        {doc.fileUrl && (
          <a 
            href={doc.fileUrl} 
            download
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors shadow-sm"
          >
            <Download size={14} />
            Download PDF
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
        {/* Left column: Letter template preview */}
        <div className="md:col-span-3">
          <div className="bg-white border border-stone-100 rounded-2xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-4">
              <div>
                <p className="text-xs text-stone-400 uppercase tracking-widest font-bold">Document Preview</p>
                <p className="text-sm font-serif italic text-stone-700 font-medium mt-1">{doc.title}</p>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${isApproved ? 'bg-memory-50 text-memory-600' : 'bg-brand-50 text-brand-600'}`}>
                {isApproved ? 'Approved' : 'Draft'}
              </span>
            </div>
            
            <div className="font-serif text-stone-700 space-y-4 leading-relaxed text-sm bg-stone-50/30 p-4 rounded-xl border border-stone-100">
              <p className="font-sans text-xs text-stone-400">Date: {formFields.currentDate || new Date().toLocaleDateString()}</p>
              <p className="font-sans text-xs text-stone-500 font-medium">To,</p>
              <p className="font-sans text-xs text-stone-500">
                The Authorized Officer / Support Team,<br />
                {formFields.bankName || formFields.insuranceCompany || formFields.uidaiOfficeName || formFields.employerName || "Authorized Institution"}
              </p>
              
              <div className="w-full h-[1px] bg-stone-200/50 my-2" />
              
              <p className="font-medium text-stone-800">
                Subject: Demise notification and record processing request for late {formFields.deceasedName || "[Name]"}.
              </p>
              <p>Dear Sir/Madam,</p>
              <p>
                I am writing to notify you of the demise of my relative, 
                <span className="bg-brand-50/80 px-1 mx-1 rounded text-brand-800 font-medium border border-brand-100">{formFields.deceasedName || "Deceased Name"}</span>, 
                who passed away on <span className="bg-brand-50/80 px-1 mx-1 rounded text-brand-800 font-medium border border-brand-100">{formFields.dateOfDeath || "Date of Death"}</span>.
              </p>
              <p>
                Please find the required reference numbers filled on the right panel, including the official Death Certificate number: 
                <span className="bg-brand-50/80 px-1 mx-1 rounded text-brand-800 font-medium border border-brand-100">{formFields.deathCertificateNo || "DC Number"}</span>.
              </p>
              <p>
                Kindly guide me on the next steps to process the settlement and transfer balance/benefits to the next of kin account.
              </p>
              <p className="pt-4">Sincerely,</p>
              <p className="font-sans text-xs text-stone-600 font-medium">{formFields.claimantName || "Claimant Name"}</p>
              <p className="font-sans text-[11px] text-stone-400">GriefBridge Estate Agent on behalf of the family</p>
            </div>
          </div>
        </div>

        {/* Right column: Form details & approval */}
        <div className="md:col-span-2">
          <div className="space-y-8 sticky top-8">
            <section className="bg-white border border-stone-100 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-[11px] font-bold tracking-[0.1em] uppercase text-stone-400">Agent Fill Fields</h4>
                <button 
                  onClick={handleSaveChanges} 
                  disabled={saving}
                  className="text-[11px] font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                  Save Draft
                </button>
              </div>
              
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {Object.keys(formFields).filter(k => k !== 'legalHeirs').map(key => (
                  <div key={key}>
                    <label className="text-[10px] text-stone-400 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                    <input 
                      type="text" 
                      value={formFields[key] || ""} 
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                      className="w-full bg-stone-50 border border-stone-100 rounded-lg px-3 py-1.5 text-xs text-stone-700 font-medium focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300"
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white border border-stone-100 rounded-2xl p-6 shadow-sm">
              <h4 className="text-[11px] font-bold tracking-[0.1em] uppercase text-stone-400 mb-4">Attachment Required</h4>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-xs text-stone-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Copy of Death Certificate
                </li>
              </ul>
              
              <div className="border-dashed border border-stone-200 rounded-xl p-5 text-center hover:bg-stone-50/50 transition-colors cursor-pointer">
                <Upload className="w-5 h-5 text-stone-300 mx-auto mb-2" />
                <p className="text-xs text-stone-400 mb-1 font-medium">Verify Death Certificate</p>
                <p className="text-[10px] text-stone-300">File is automatically linked</p>
              </div>
            </section>

            <div className="pt-4 border-t border-stone-100">
              {isApproved ? (
                <div className="bg-memory-50/50 border border-memory-100 text-memory-700 p-4 rounded-xl flex items-center justify-center gap-2">
                  <Check size={16} className="text-memory-600" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Approved & Signed</span>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={handleApprove}
                    className="w-full px-4 py-2.5 text-sm font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-800 transition-colors shadow-sm"
                  >
                    Approve & Sign PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
