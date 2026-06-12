"use client";

import { useState, useEffect } from "react";
import TaskCard from "../../components/TaskCard";
import ApprovalModal from "../../components/ApprovalModal";
import { mockTasks } from "../../lib/mockData";
import { ChevronDown, CheckCircle2 } from "lucide-react";

export default function Dashboard() {
  const [tasks, setTasks] = useState(mockTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
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

  const confirmApprove = (task) => {
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'in_progress' } : t));
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const completedTasks = tasks.filter(t => t.status === 'completed');
  const activeTasks = tasks.filter(t => t.status !== 'completed');
  const needsAttentionTasks = activeTasks.filter(t => t.status === 'needs_attention');
  const otherActiveTasks = activeTasks.filter(t => t.status !== 'needs_attention');

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
          <TaskCard key={task.id} task={task} onApprove={handleApprove} />
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
    </div>
  );
}
