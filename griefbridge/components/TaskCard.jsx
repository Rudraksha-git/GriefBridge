import { Briefcase, Building2, Landmark, Mail, Globe, Shield } from "lucide-react";

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

const getStatusBadge = (status) => {
  switch (status) {
    case 'completed': return <span className="bg-memory-50 text-memory-600 text-[11px] font-medium px-2 py-0.5 rounded uppercase tracking-wider">Done</span>;
    case 'in_progress': return <span className="bg-brand-50 text-brand-600 text-[11px] font-medium px-2 py-0.5 rounded uppercase tracking-wider">In progress</span>;
    case 'needs_attention': return <span className="bg-amber-50 text-amber-700 text-[11px] font-medium px-2 py-0.5 rounded uppercase tracking-wider">Needs you</span>;
    case 'pending_approval': return <span className="bg-brand-50 text-brand-600 text-[11px] font-medium px-2 py-0.5 rounded uppercase tracking-wider">Needs you</span>;
    case 'pending': 
    case 'queued': return <span className="bg-stone-100 text-stone-500 text-[11px] font-medium px-2 py-0.5 rounded uppercase tracking-wider">Queued</span>;
    default: return null;
  }
};

export default function TaskCard({ task, onApprove }) {
  const needsReview = task.status === 'needs_attention' || task.status === 'pending_approval';

  return (
    <div className="py-4 border-b border-stone-100 flex items-start gap-4">
      <div className="text-stone-300 mt-0.5 group-hover:text-brand-400 transition-colors">
        {getCategoryIcon(task.category)}
      </div>
      
      <div className="flex-1">
        <h3 className="text-sm font-medium text-stone-700 mb-0.5">{task.title}</h3>
        <p className="text-xs text-stone-400">{task.description}</p>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        {getStatusBadge(task.status)}
        {needsReview && onApprove && (
          <button 
            onClick={() => onApprove(task)}
            className="text-[11px] font-medium px-3 py-1 rounded border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors"
          >
            Review &rarr;
          </button>
        )}
      </div>
    </div>
  );
}
