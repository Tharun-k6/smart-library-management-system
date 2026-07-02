import React, { useState } from 'react';
import { useSeo } from '../hooks/useSeo';

export default function SettingsPage() {
  useSeo({
    title: 'Settings',
    description: 'Customize Smart Library preferences and interface options.',
  });
  const [darkMode, setDarkMode] = useState(true);
  return (
    <div className="glass-panel rounded-2xl p-5 space-y-4">
      <h2 className="text-2xl font-semibold text-white">Settings</h2>
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
        <div>
          <p className="text-white">Dark Mode</p>
          <p className="text-sm text-slate-400">Persist theme preferences across sessions.</p>
        </div>
        <button onClick={() => setDarkMode((value) => !value)} className="rounded-2xl bg-brand-500 px-4 py-2 text-sm font-medium text-white">
          {darkMode ? 'Enabled' : 'Disabled'}
        </button>
      </div>
    </div>
  );
}
