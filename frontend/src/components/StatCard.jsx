import React from 'react';

export default function StatCard({ title, value, hint, icon, tone = 'from-blue-500 to-cyan-400' }) {
  return (
    <div className="page-card relative overflow-hidden p-5">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tone}`} />
      <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${tone}`} />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</h3>
          <p className="mt-2 text-xs text-slate-400">{hint}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl shadow-inner shadow-white/5">{icon}</div>
      </div>
    </div>
  );
}
