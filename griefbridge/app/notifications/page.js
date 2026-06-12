"use client";

import { mockInstitutions } from "../../lib/mockData";

export default function Notifications() {
  const sentOrConfirmed = mockInstitutions.filter(i => i.status === 'Sent' || i.status === 'Confirmed').length;
  const total = mockInstitutions.length;
  const progressPercent = (sentOrConfirmed / total) * 100;

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
        {/* Group by category for demo */}
        {['Banks & Finance', 'Government Bodies', 'Utilities & Subscriptions'].map(category => {
          // Adjust mock properties for mapping backwards compatibility
          const getCatName = (name) => {
            if (name === 'HDFC Bank' || name === 'SBI' || name === 'LIC') return 'Banks & Finance';
            if (name === 'Income Tax') return 'Government Bodies';
            if (name === 'Airtel') return 'Utilities & Subscriptions';
            return 'Other';
          }

          const catInstitutions = mockInstitutions.filter(i => getCatName(i.name) === category);
          if (catInstitutions.length === 0) return null;
          
          return (
            <div key={category}>
              <h3 className="text-[11px] font-medium tracking-[0.1em] uppercase text-stone-400 mb-4">{category}</h3>
              <div className="flex flex-col border-t border-stone-100">
                {catInstitutions.map(inst => (
                  <div 
                    key={inst.id} 
                    className={`py-4 border-b border-stone-100 flex items-center gap-4 ${inst.status === 'Failed' ? 'bg-red-50/30' : ''}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center text-xs font-medium shrink-0">
                      {inst.name.substring(0, 2).toUpperCase()}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-stone-700">{inst.name}</h4>
                      <p className="text-xs text-stone-400">{inst.department}</p>
                    </div>

                    <div className="shrink-0 flex items-center gap-3">
                      <span className="bg-stone-100 text-stone-600 text-[10px] font-medium px-2 py-0.5 rounded tracking-wider uppercase">
                        {inst.method}
                      </span>
                      
                      <span className={`text-xs font-medium w-16 text-right ${
                        inst.status === 'Failed' ? 'text-red-600' :
                        inst.status === 'Confirmed' ? 'text-memory-600' :
                        inst.status === 'Sent' ? 'text-brand-600' :
                        'text-stone-400'
                      }`}>
                        {inst.status}
                      </span>

                      {inst.status === 'Failed' && (
                        <button className="text-[11px] text-red-600 hover:underline ml-2">
                          Retry &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
