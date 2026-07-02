import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSeo } from '../hooks/useSeo';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  useSeo({
    title: 'Create account',
    description: 'Create a Smart Library account to access the library platform.',
  });
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'STUDENT' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/register', form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to create account.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-md glass-panel rounded-3xl p-8 space-y-5">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Smart Library</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Create account</h1>
        </div>
        {error && <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
        <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none" placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="STUDENT">Student</option>
          <option value="LIBRARIAN">Librarian</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button className="w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white hover:bg-brand-600">Register</button>
        <button type="button" onClick={() => navigate('/login')} className="w-full text-sm text-slate-400 hover:text-white">Back to login</button>
      </form>
    </div>
  );
}
