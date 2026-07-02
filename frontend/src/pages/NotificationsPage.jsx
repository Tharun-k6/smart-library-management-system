import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { useSeo } from '../hooks/useSeo';

export default function NotificationsPage() {
  useSeo({
    title: 'Notifications',
    description: 'Read Smart Library updates for reservations, catalog events, and system workflows.',
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const unreadCount = useMemo(() => items.filter((item) => !item.read).length, [items]);

  const loadNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/notifications');
      setItems(data);
    } catch (err) {
      console.error(err);
      setError('Unable to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markRead = async (id) => {
    setError('');
    try {
      await api.patch(`/notifications/${id}/read`);
      await loadNotifications();
    } catch (err) {
      console.error(err);
      setError('Unable to update notification.');
    }
  };

  return (
    <div className="space-y-6">
      <section className="page-card p-6 sm:p-8">
        <p className="section-label">Notifications</p>
        <h2 className="mt-4 text-3xl font-semibold text-white">Notification center</h2>
        <p className="mt-3 text-sm text-slate-400">{unreadCount} unread updates from reservations, catalog, security, and system workflows.</p>
      </section>

      {error && <div className="rounded-3xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

      <div className="page-card space-y-3 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Latest updates</h3>
          <button onClick={loadNotifications} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 hover:bg-white/10">Refresh</button>
        </div>
        {loading ? (
          <div className="py-8 text-slate-400">Loading notifications...</div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-400">No notifications yet.</div>
        ) : (
          items.map((item) => (
            <article key={item.id} className={`rounded-2xl border px-4 py-3 ${item.read ? 'border-white/10 bg-white/5 text-slate-400' : 'border-brand-400/30 bg-brand-500/10 text-slate-200'}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-brand-300">{item.type}</div>
                  <h4 className="mt-1 font-medium text-white">{item.title}</h4>
                  <p className="mt-1 text-sm leading-6">{item.message}</p>
                </div>
                {!item.read && <button onClick={() => markRead(item.id)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 hover:bg-white/10">Mark read</button>}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
