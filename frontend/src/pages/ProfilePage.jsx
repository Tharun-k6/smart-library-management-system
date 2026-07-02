import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useSeo } from '../hooks/useSeo';

export default function ProfilePage() {
  const { user } = useAuth();
  useSeo({
    title: 'Profile',
    description: 'Review your Smart Library profile information and access role details.',
  });
  return (
    <div className="glass-panel rounded-2xl p-5 space-y-3">
      <h2 className="text-2xl font-semibold text-white">User Profile</h2>
      <p className="text-slate-400">Manage personal details, preferences, and access roles.</p>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-300">
        <p><span className="text-slate-400">Name:</span> {user?.fullName}</p>
        <p><span className="text-slate-400">Email:</span> {user?.email}</p>
        <p><span className="text-slate-400">Role:</span> {user?.role}</p>
      </div>
    </div>
  );
}
