import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSeo } from '../hooks/useSeo';

const roleConfig = {
  ADMIN: {
    title: 'Admin Login',
    email: 'admin@smartlib.com',
    password: 'Admin@123',
    copy: 'Full access for security, catalog, reports, users, analytics, and demo reset tools.',
  },
  LIBRARIAN: {
    title: 'Librarian Login',
    email: 'librarian@smartlib.com',
    password: 'Librarian@123',
    copy: 'Operational access for catalog work, reservations, circulation, reports, and notifications.',
  },
  STUDENT: {
    title: 'Student Login',
    email: 'student@smartlib.com',
    password: 'Student@123',
    copy: 'Student access for browsing books, reserving seats, notifications, and assistant help.',
  },
};

const loginTips = [
  'Choose the portal that matches your role before signing in.',
  'Use the seeded demo account that matches the selected portal.',
  'If you see a role mismatch, switch to the correct portal and try again.',
];

export default function LoginPage({ expectedRole }) {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const config = roleConfig[expectedRole] || roleConfig.ADMIN;
  useSeo({
    title: expectedRole ? config.title : 'Sign in',
    description: 'Sign in to Smart Library using your role-based portal.',
  });
  const [form, setForm] = useState({ email: config.email, password: config.password });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = useMemo(() => Object.entries(roleConfig), []);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      if (expectedRole && data.role !== expectedRole) {
        logout();
        setError(`This is the ${expectedRole.toLowerCase()} portal. Please use a ${expectedRole.toLowerCase()} account.`);
        return;
      }
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to sign in. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const selectRole = (role) => {
    navigate(`/login/${role.toLowerCase()}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 shell-gradient lg:p-8">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-2xl shadow-black/30 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="border-b border-white/10 bg-gradient-to-br from-brand-600/20 via-slate-950 to-emerald-500/10 p-8 lg:border-b-0 lg:border-r lg:p-12">
          <p className="section-label">Smart Library</p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-white lg:text-5xl">
            Separate secure portals for every library role.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">{config.copy}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {roles.map(([role, item]) => (
              <button
                key={role}
                type="button"
                onClick={() => selectRole(role)}
                className={`rounded-3xl border p-4 text-left transition ${expectedRole === role ? 'border-brand-400/40 bg-brand-500/15 text-white' : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'}`}
              >
                <div className="font-medium">{role}</div>
                <div className="mt-2 text-xs leading-5 text-slate-400">{item.email}</div>
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/50 p-5">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Login guide</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              {loginTips.map((tip) => (
                <li key={tip} className="flex gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs text-emerald-200">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

        </section>

        <form onSubmit={submit} className="space-y-5 p-8 lg:p-12">
          <div>
            <p className="section-label">Sign in</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">{expectedRole ? config.title : 'Choose a portal'}</h2>
            <p className="mt-2 text-sm text-slate-400">Use the seeded credentials or your own account for this role.</p>
          </div>
          {error && <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
          <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20" placeholder="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <p className="text-sm leading-6 text-slate-400">
            Tip: if you are reviewing the app, pick a role on the left, then use the matching seeded account to enter the dashboard.
          </p>
          <button disabled={loading || !expectedRole} className="w-full rounded-2xl bg-gradient-to-r from-brand-500 to-emerald-400 px-4 py-3 font-semibold text-white shadow-lg shadow-brand-500/20 hover:brightness-110 disabled:opacity-60">
            {loading ? 'Signing in...' : expectedRole ? `Enter ${expectedRole.toLowerCase()} portal` : 'Select a role first'}
          </button>
          <button type="button" onClick={() => navigate('/register')} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 hover:bg-white/10 hover:text-white">
            Create an account
          </button>
        </form>
      </div>
    </div>
  );
}
