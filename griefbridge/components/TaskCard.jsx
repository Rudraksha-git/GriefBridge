import { Briefcase, Building2, Landmark, Mail, Globe, Shield, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

const getCategoryIcon = (category) => {
  const cat = category?.toLowerCase() || "";
  switch (cat) {
    case 'legal': return <Briefcase size={18} />;
    case 'banking':
    case 'financial': return <Building2 size={18} />;
    case 'government': return <Landmark size={18} />;
    case 'notifications': return <Mail size={18} />;
    case 'digital':
    case 'digital accounts': return <Globe size={18} />;
    case 'insurance': return <Shield size={18} />;
    default: return <Briefcase size={18} />;
  }
};

export default function TaskCard({ task, onApprove, onInitiate, initiatingTaskId }) {
  const [justApproved, setJustApproved] = useState(false);
  const [prevStatus, setPrevStatus] = useState(task.status);

  useEffect(() => {
    if (prevStatus === 'needs_attention' && task.status === 'in_progress') {
      setJustApproved(true);
      setTimeout(() => setJustApproved(false), 3000);
    }
    setPrevStatus(task.status);
  }, [task.status, prevStatus]);

  const statusLower = task.status?.toLowerCase();
  const needsReview = statusLower === 'needs_attention' || statusLower === 'pending_approval';
  const isPending = statusLower === 'pending' || statusLower === 'queued';
  const isInProgress = statusLower === 'in_progress';
  const isCompleted = statusLower === 'completed';

  let badgeClasses = "text-[11px] font-medium px-2 py-0.5 rounded uppercase tracking-wider transition-all duration-400 ease-in-out ";
  let badgeText = "";

  switch (statusLower) {
    case 'completed': 
      badgeClasses += "bg-memory-50 text-memory-600"; badgeText = "Done"; break;
    case 'in_progress': 
      badgeClasses += "bg-brand-50 text-brand-600"; badgeText = "In progress"; break;
    case 'needs_attention': 
    case 'pending_approval':
      badgeClasses += "bg-amber-50 text-amber-700 badge-attention"; badgeText = "Needs you"; break;
    case 'pending': 
    case 'queued': 
      badgeClasses += "bg-stone-100 text-stone-500"; badgeText = "Queued"; break;
    default: 
      badgeClasses += "bg-stone-100 text-stone-500"; badgeText = task.status;
  }

  const associatedDoc = task.documents && task.documents.length > 0 ? task.documents[0] : null;

  return (
    <div className="task-row anim-fade-up py-4 border-b border-stone-100 flex items-start gap-4">
      <div className="text-stone-300 mt-0.5 group-hover:text-brand-400 transition-colors">
        {getCategoryIcon(task.category)}
      </div>
      
      <div className="flex-1">
        <h3 className="text-sm font-medium text-stone-700 mb-0.5">{task.title}</h3>
        <p className="text-xs text-stone-400">{task.description}</p>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0 relative min-h-[50px] min-w-[120px]">
        <span className={badgeClasses}>{badgeText}</span>
        
        <div className="relative w-full flex justify-end">
          {needsReview && (
            <button 
              onClick={() => onApprove && onApprove(task)}
              className="text-[11px] font-medium px-3 py-1 rounded border border-brand-200 text-brand-600 hover:bg-brand-50 transition-all duration-300"
            >
              Review &rarr;
            </button>
          )}

          {isPending && (
            <button 
              onClick={() => onInitiate && onInitiate(task)}
              disabled={initiatingTaskId === task.id}
              className="text-[11px] font-medium px-3 py-1 rounded bg-brand-600 text-white hover:bg-brand-700 transition-all duration-300 flex items-center gap-1 disabled:opacity-50"
            >
              {initiatingTaskId === task.id ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Drafting...
                </>
              ) : (
                "Initiate Agent"
              )}
            </button>
          )}

          {isInProgress && associatedDoc && (
            <Link 
              href={`/documents/${associatedDoc.id}`}
              className="text-[11px] font-medium px-3 py-1 rounded border border-brand-100 text-brand-500 hover:bg-brand-50 transition-all duration-300"
            >
              Review Draft &rarr;
            </Link>
          )}
          
          <div className={`absolute right-1 top-1 text-brand-500 transition-all duration-500 delay-300 ${justApproved ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <CheckCircle2 size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}
