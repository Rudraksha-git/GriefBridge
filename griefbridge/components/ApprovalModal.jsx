export default function ApprovalModal({ task, isOpen, onClose, onConfirm }) {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-stone-100 rounded-xl p-6 max-w-md w-full shadow-xl">
        <h2 className="text-2xl font-[family-name:var(--font-lora)] italic text-stone-800 mb-4">Approve Task</h2>
        
        <div className="bg-stone-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-stone-800 mb-1">{task.title}</h3>
          <p className="text-sm text-stone-600">{task.description}</p>
        </div>

        <p className="text-sm text-stone-600 leading-relaxed mb-6">
          By approving, you authorize GriefBridge to proceed with this action on your behalf.
        </p>

        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="border border-stone-200 text-stone-600 text-sm px-4 py-2.5 rounded-lg hover:bg-stone-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onConfirm(task)}
            className="bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-brand-800 transition-colors"
          >
            Confirm & Approve
          </button>
        </div>
      </div>
    </div>
  );
}
