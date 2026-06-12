import { Briefcase, Building2, Landmark, Mail, Globe, Shield, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Legal': return <Briefcase size={18} />;
    case 'Banking': return <Building2 size={18} />;
    case 'Government': return <Landmark size={18} />;
    case 'Notifications': return <Mail size={18} />;
    case 'Digital':
    case 'Digital Accounts': return <Globe size={18} />;
    case 'Insurance': return <Shield size={18} />;
    default: return <Briefcase size={18} />;
  }
};

export default function TaskCard({ task, onApprove }) {
  const [justApproved, setJustApproved] = useState(false);
  const [prevStatus, setPrevStatus] = useState(task.status);

  useEffect(() => {
    if (prevStatus === 'needs_attention' && task.status === 'in_progress') {
      setJustApproved(true);
      setTimeout(() => setJustApproved(false), 3000);
    }
    setPrevStatus(task.status);
  }, [task.status, prevStatus]);

  const needsReview = task.status === 'needs_attention' || task.status === 'pending_approval';

  let badgeClasses = "text-[11px] font-medium px-2 py-0.5 rounded uppercase tracking-wider transition-all duration-400 ease-in-out ";
  let badgeText = "";

  switch (task.status) {
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

  return (
    <div className="task-row anim-fade-up py-4 border-b border-stone-100 flex items-start gap-4">
      <div className="text-stone-300 mt-0.5 group-hover:text-brand-400 transition-colors">
        {getCategoryIcon(task.category)}
      </div>
      
      <div className="flex-1">
        <h3 className="text-sm font-medium text-stone-700 mb-0.5">{task.title}</h3>
        <p className="text-xs text-stone-400">{task.description}</p>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0 relative min-h-[50px] min-w-[100px]">
        <span className={badgeClasses}>{badgeText}</span>
        
        <div className="relative w-full flex justify-end">
          <button 
            onClick={() => needsReview && onApprove && onApprove(task)}
            className={`absolute right-0 text-[11px] font-medium px-3 py-1 rounded border border-brand-200 text-brand-600 hover:bg-brand-50 transition-all duration-300 ease-in-out
              ${needsReview ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            Review &rarr;
          </button>
          
          <div className={`absolute right-1 top-1 text-brand-500 transition-all duration-500 delay-300 ${justApproved ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <CheckCircle2 size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}
