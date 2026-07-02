import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

export default function Topbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [apiStatus, setApiStatus] = useState('checking');

  const section = location.pathname === '/' || location.pathname === '/dashboard'
    ? 'Dashboard'
    : location.pathname.slice(1).replace(/-/g, ' ');
  const statusLabel = apiStatus === 'online' ? 'Backend online' : apiStatus === 'offline' ? 'Backend offline' : 'Checking backend';
  const statusClass = apiStatus === 'online' ? 'text-emerald-200' : apiStatus === 'offline' ? 'text-red-200' : 'text-amber-200';

  useEffect(() => {
    let mounted = true;
    api.get('/health')
      .then(() => {
        if (mounted) setApiStatus('online');
      })
      .catch(() => {
        if (mounted) setApiStatus('offline');
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <header className="w-full rounded-3xl border border-white/10 bg-slate-950/50 px-5 py-4 shadow-glass backdrop-blur-xl">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-400 font-bold text-white shadow-lg shadow-brand-500/20">SL</div>
          <div>
            <div className="section-label">Smart Library</div>
            <div className="mt-1 text-lg font-semibold capitalize text-white">{section}</div>
            <div className="text-sm text-slate-400">{user?.fullName || 'Company Admin'} / {user?.role || 'ADMIN'}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className={`rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm ${statusClass}`}>
            {statusLabel}
          </div>
          <button onClick={toggleTheme} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <button onClick={logout} className="rounded-2xl bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
