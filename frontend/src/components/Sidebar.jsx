import React from 'react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: 'DB' },
  { to: '/books', label: 'Catalog', icon: 'BK' },
  { to: '/reports', label: 'Reports', icon: 'RP' },
  { to: '/analytics', label: 'Analytics', icon: 'AN' },
  { to: '/reservations', label: 'Reservations', icon: 'RS' },
  { to: '/notifications', label: 'Notifications', icon: 'NT' },
  { to: '/chatbot', label: 'AI Assistant', icon: 'AI' },
  { to: '/profile', label: 'Profile', icon: 'PF' },
  { to: '/settings', label: 'Settings', icon: 'ST' },
];

export default function Sidebar() {
  return (
    <aside className="glass-panel sticky top-0 hidden min-h-screen flex-col gap-6 rounded-r-[2rem] border-r border-white/10 p-5 lg:flex lg:w-80">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-400 font-bold text-white shadow-lg shadow-brand-500/20">SL</div>
          <div>
            <div className="section-label">Smart Library</div>
            <div className="mt-1 text-xl font-semibold text-white">Operations Hub</div>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-400">A polished control center for books, circulation, reports, analytics, and support tasks.</p>
      </div>
      <nav className="space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `group flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${isActive ? 'border-brand-400/30 bg-brand-500/10 text-white shadow-lg shadow-brand-500/10' : 'border-transparent text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-white'}`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-xs font-semibold group-hover:bg-white/10">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto rounded-3xl border border-white/10 bg-gradient-to-br from-brand-500/20 via-white/5 to-emerald-400/15 p-5">
        <p className="text-sm text-slate-300">Platform status</p>
        <div className="mt-2 text-4xl font-semibold text-white">Live</div>
        <p className="mt-2 text-xs text-slate-400">API, catalog, analytics, and reports are wired for demo mode.</p>
      </div>
    </aside>
  );
}
