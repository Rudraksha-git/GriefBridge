"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const sentOrConfirmed = notifications.filter(
    i => i.status?.toLowerCase() === 'sent' || i.status?.toLowerCase() === 'resolved'
  ).length;
  const total = notifications.length;
  const progressPercent = total > 0 ? (sentOrConfirmed / total) * 100 : 0;

  const getCatName = (type) => {
    const t = type?.toLowerCase();
    switch (t) {
      case 'bank':
      case 'insurance':
      case 'employer':
        return 'Banks & Finance';
      case 'government':
        return 'Government Bodies';
      case 'digital':
      case 'utility':
        return 'Utilities & Subscriptions';
      default:
        return 'Other Institutions';
    }
  };

  const getMethod = (type) => {
    const t = type?.toLowerCase();
    if (t === 'digital' || t === 'government') return 'Portal';
    if (t === 'utility') return 'Web Form';
    return 'Email';
  };

  const getDepartment = (type) => {
    const t = type?.toLowerCase();
    if (t === 'bank') return 'Retail Claims';
    if (t === 'insurance') return 'Death Claims';
    if (t === 'government') return 'Deactivation';
    if (t === 'digital') return 'Memorialization';
    if (t === 'employer') return 'Human Resources';
    return 'Customer Care';
  };

  const displayStatus = (status) => {
    const s = status?.toLowerCase();
    if (s === 'resolved') return 'Confirmed';
    if (s === 'sent') return 'Sent';
    if (s === 'pending') return 'Pending';
    return status || 'Pending';
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-32 text-center flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin mb-4" />
        <p className="text-sm text-stone-400 font-serif italic">Accessing institution tracking status...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="mb-12">
        <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-stone-400 mb-3">
          Notifications
        </p>
        <h1 className="text-3xl font-serif italic text-stone-800 tracking-tight mb-2">
          Institutions we're contacting
        </h1>
        <p className="text-sm text-stone-400 mb-6">
          {sentOrConfirmed} of {total} institutions notified
        </p>
        
        <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-400 transition-all duration-1000" 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>
      </div>

      <div className="space-y-8">
        {['Banks & Finance', 'Government Bodies', 'Utilities & Subscriptions'].map(category => {
          const catNotifications = notifications.filter(i => getCatName(i.institutionType) === category);
          if (catNotifications.length === 0) return null;
          
          return (
            <div key={category}>
              <h3 className="text-[11px] font-medium tracking-[0.1em] uppercase text-stone-400 mb-4">{category}</h3>
              <div className="flex flex-col border-t border-stone-100">
                {catNotifications.map(notif => {
                  const method = getMethod(notif.institutionType);
                  const dept = getDepartment(notif.institutionType);
                  const statusLabel = displayStatus(notif.status);
                  
                  return (
                    <div 
                      key={notif.id} 
                      className={`py-4 border-b border-stone-100 flex items-center gap-4 ${notif.status?.toLowerCase() === 'failed' ? 'bg-red-50/30' : ''}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center text-xs font-medium shrink-0">
                        {notif.institutionName?.substring(0, 2).toUpperCase()}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-stone-700">{notif.institutionName}</h4>
                        <p className="text-xs text-stone-400">{dept}</p>
                      </div>
  
                      <div className="shrink-0 flex items-center gap-3">
                        <span className="bg-stone-100 text-stone-600 text-[10px] font-medium px-2 py-0.5 rounded tracking-wider uppercase">
                          {method}
                        </span>
                        
                        <span className={`text-xs font-medium w-16 text-right ${
                          notif.status?.toLowerCase() === 'failed' ? 'text-red-600' :
                          notif.status?.toLowerCase() === 'resolved' ? 'text-memory-600' :
                          notif.status?.toLowerCase() === 'sent' ? 'text-brand-600' :
                          'text-stone-400'
                        }`}>
                          {statusLabel}
                        </span>
  
                        {notif.status?.toLowerCase() === 'failed' && (
                          <button className="text-[11px] text-red-600 hover:underline ml-2">
                            Retry &rarr;
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
