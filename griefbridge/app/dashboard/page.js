"use client";

import { useState, useEffect } from "react";
import TaskCard from "../../components/TaskCard";
import ApprovalModal from "../../components/ApprovalModal";
import { ChevronDown, CheckCircle2, Loader2 } from "lucide-react";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [initiatingTaskId, setInitiatingTaskId] = useState(null);

  // Onboarding configuration state
  const [userProfile, setUserProfile] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [deceasedInput, setDeceasedInput] = useState("");
  const [relationInput, setRelationInput] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      if (data.tasks) {
        setTasks(data.tasks);
      }
      if (data.user) {
        setUserProfile(data.user);
        if (!data.user.deceasedName || !data.user.relationship) {
          setShowOnboarding(true);
        }
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    const timer = setTimeout(() => {
      const header = document.getElementById('dashboard-header');
      if (header) header.classList.add('in-view');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const rows = document.querySelectorAll('.task-row');
    rows.forEach((row, i) => {
      setTimeout(() => row.classList.add('in-view'), 80 + i * 60);
    });
  }, [tasks]);

  const handleApprove = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleInitiate = async (task) => {
    setInitiatingTaskId(task.id);
    try {
      // Determine close matching template based on category
      let documentType = null;
      const cat = task.category?.toLowerCase();
      if (cat === "financial" || task.title.toLowerCase().includes("sbi")) {
        documentType = "bank_closure";
      } else if (task.title.toLowerCase().includes("lic")) {
        documentType = "insurance_claim";
      } else if (task.title.toLowerCase().includes("aadhaar")) {
        documentType = "aadhaar";
      } else if (cat === "digital") {
        documentType = "digital_account";
      }

      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: task.id,
          documentType,
          additionalContext: {}
        })
      });

      if (!res.ok) {
        throw new Error("Failed to draft document");
      }

      await fetchTasks();
    } catch (err) {
      console.error("Error initiating document agent:", err);
    } finally {
      setInitiatingTaskId(null);
    }
  };

  const confirmApprove = async (task) => {
    try {
      const res = await fetch(`/api/tasks/${task.id}/approve`, {
        method: "POST"
      });
      if (!res.ok) throw new Error("Failed to approve task");
      await fetchTasks();
    } catch (err) {
      console.error("Error approving task:", err);
    } finally {
      setIsModalOpen(false);
      setSelectedTask(null);
    }
  };

  const handleOnboardingSubmit = async (e) => {
    e.preventDefault();
    if (!deceasedInput.trim() || !relationInput) return;

    setSavingProfile(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deceasedName: deceasedInput.trim(),
          relationship: relationInput
        })
      });

      if (!res.ok) {
        throw new Error("Failed to save profile");
      }

      setShowOnboarding(false);
      await fetchTasks();
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Error saving profile: " + err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const completedTasks = tasks.filter(t => t.status?.toLowerCase() === 'completed');
  const activeTasks = tasks.filter(t => t.status?.toLowerCase() !== 'completed');
  const needsAttentionTasks = activeTasks.filter(t => t.status?.toLowerCase() === 'needs_attention');
  const otherActiveTasks = activeTasks.filter(t => t.status?.toLowerCase() !== 'needs_attention');

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-32 text-center flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin mb-4" />
        <p className="text-sm text-stone-400 font-serif italic">Accessing estate checklist...</p>
      </div>
    );
  }

  if (tasks.length === 0 || activeTasks.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-32 text-center">
        <p className="text-xl font-serif italic text-stone-400">
          Everything is handled. Take your time.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div id="dashboard-header" className="anim-fade-up mb-12">
        <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-stone-400 mb-3">
          Executor agent
        </p>
        <h1 className="text-3xl font-serif italic text-stone-800 tracking-tight mb-2">
          We're handling it.
        </h1>
        <p className="text-sm text-stone-400">
          {activeTasks.length} tasks in progress &middot; {completedTasks.length} completed
          {needsAttentionTasks.length > 0 && ` · ${needsAttentionTasks.length} needs your attention`}
        </p>
      </div>

      {needsAttentionTasks.length > 0 && (
        <div className="mb-8 space-y-4">
          {needsAttentionTasks.map(task => (
            <div key={task.id} className="task-row anim-fade-up bg-amber-50 border-l-[3px] border-amber-400 p-5 rounded-r-xl">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-sm font-medium text-stone-800 mb-1">{task.title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed mb-3">{task.description}</p>
                </div>
              </div>
              <button 
                onClick={() => handleApprove(task)}
                className="text-sm font-medium text-amber-700 hover:text-amber-800 inline-flex items-center gap-1"
              >
                Review &rarr;
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col border-t border-stone-100">
        {otherActiveTasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onApprove={handleApprove} 
            onInitiate={handleInitiate}
            initiatingTaskId={initiatingTaskId}
          />
        ))}
      </div>

      {completedTasks.length > 0 && (
        <div className="mt-8">
          <button 
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 text-sm text-stone-400 hover:text-stone-600 transition-colors"
          >
            {completedTasks.length} tasks completed
            <ChevronDown size={14} className={`transform transition-transform ${showCompleted ? "rotate-180" : ""}`} />
          </button>
          
          {showCompleted && (
            <div className="mt-4 flex flex-col space-y-1">
              {completedTasks.map(task => (
                <div key={task.id} className="task-row anim-fade-up py-3 flex items-center gap-3 opacity-70">
                  <CheckCircle2 size={16} className="text-stone-400" />
                  <span className="text-sm text-stone-500">{task.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <ApprovalModal 
        isOpen={isModalOpen}
        task={selectedTask}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmApprove}
      />

      {showOnboarding && (
        <div className="fixed inset-0 bg-stone-950/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border border-stone-100 rounded-3xl p-8 shadow-2xl relative animate-fade-up">
            <h2 className="text-xl font-serif italic text-stone-800 mb-2">Personalize Your Assistant</h2>
            <p className="text-xs text-stone-400 mb-6 leading-relaxed">
              Welcome to GriefBridge. Please provide the details of your loved one and your relationship so that our AI agents can draft custom, print-ready bereavement documents on your behalf.
            </p>

            <form onSubmit={handleOnboardingSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-400 mb-2">
                  Deceased Person's Full Name
                </label>
                <input 
                  type="text" 
                  value={deceasedInput}
                  onChange={(e) => setDeceasedInput(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  required
                  disabled={savingProfile}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-100 rounded-xl text-xs text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-400 mb-2">
                  Your Relationship to Them
                </label>
                <select 
                  value={relationInput}
                  onChange={(e) => setRelationInput(e.target.value)}
                  required
                  disabled={savingProfile}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-100 rounded-xl text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
                >
                  <option value="">Select your relationship</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Wife">Wife</option>
                  <option value="Husband">Husband</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Next of Kin">Next of Kin</option>
                </select>
              </div>

              <button 
                type="submit"
                disabled={savingProfile || !deceasedInput.trim() || !relationInput}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs uppercase tracking-wider rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingProfile ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    Customizing Estate Vault...
                  </>
                ) : (
                  "Complete Setup"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
