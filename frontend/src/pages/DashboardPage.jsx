import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import LineChartCard from '../components/LineChartCard';
import BarChartCard from '../components/BarChartCard';
import { useSeo } from '../hooks/useSeo';

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  useSeo({
    title: 'Dashboard',
    description: 'View books, reservations, analytics, and operations inside Smart Library.',
  });
  const [stats, setStats] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      refreshUser().catch(() => {}),
      api.get('/dashboard/stats').then(({ data }) => data).catch(() => null),
      api.get('/books').then(({ data }) => data).catch(() => []),
      api.get('/util/recommendations').then(({ data }) => data.slice(0, 4)).catch(() => []),
    ]).then(([, nextStats, nextBooks, nextRecommendations]) => {
      if (!mounted) return;
      setStats(nextStats);
      setBooks(nextBooks);
      setRecommended(nextRecommendations);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const formattedStats = useMemo(() => {
    if (!stats) {
      return [
        { title: 'Loading metrics', value: '-', hint: 'Fetching backend data...', icon: '...' },
      ];
    }

    return [
      { title: 'Total Books', value: stats.totalBooks.toLocaleString(), hint: 'Current catalog size', icon: 'BK' },
      { title: 'Available Books', value: stats.availableBooks.toLocaleString(), hint: 'Copies ready for checkout', icon: 'OK', tone: 'from-emerald-500 to-cyan-400' },
      { title: 'Issued Books', value: stats.issuedBooks.toLocaleString(), hint: 'Currently on loan', icon: 'OUT', tone: 'from-amber-500 to-orange-400' },
      { title: 'Reserved Books', value: stats.reservedBooks.toLocaleString(), hint: 'Queued reservations', icon: 'RSV', tone: 'from-purple-500 to-pink-400' },
      { title: 'Active Users', value: stats.activeUsers.toLocaleString(), hint: 'Current account base', icon: 'USR', tone: 'from-sky-500 to-indigo-400' },
      { title: 'Total Fines', value: `Rs ${Number(stats.totalFines || 0).toLocaleString('en-IN')}`, hint: 'Collections tracked in real time', icon: 'Rs', tone: 'from-rose-500 to-red-400' },
    ];
  }, [stats]);

  const featuredBooks = useMemo(() => {
    return [...books]
      .sort((a, b) => (b.availableCopies || 0) - (a.availableCopies || 0))
      .slice(0, 4);
  }, [books]);

  const fallbackBooks = ['Deep Learning with Python', 'Designing Data-Intensive Applications', 'Atomic Habits', 'Clean Architecture'];
  const collection = featuredBooks.length ? featuredBooks : recommended.length ? recommended : fallbackBooks;

  return (
    <div className="space-y-6">
      <section className="page-card overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="bg-gradient-to-br from-brand-500/20 via-white/5 to-emerald-400/10 p-6 sm:p-8 lg:p-10">
            <p className="section-label">Command center</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Welcome back, {user?.fullName || 'team member'}.
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              Track inventory, issues, reservations, analytics, and reports from a fully connected backend with seeded demo books.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/books" className="rounded-2xl bg-brand-500 px-4 py-3 text-sm font-medium text-white hover:bg-brand-600">
                Manage books
              </Link>
              <Link to="/reports" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 hover:bg-white/10">
                Open reports
              </Link>
            </div>
          </div>
          <div className="border-t border-white/10 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Current role</p>
              <h3 className="mt-1 text-2xl font-semibold text-white">{user?.role || 'ADMIN'}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Your session is authenticated and wired to the backend API.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                  <div className="text-slate-400">Status</div>
                  <div className="mt-1 text-white">Connected</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                  <div className="text-slate-400">Books</div>
                  <div className="mt-1 text-white">{books.length || '-'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {formattedStats.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <LineChartCard title="Monthly Issues" labels={stats?.monthlyIssues?.map((point) => point.label) || ['Jan', 'Feb', 'Mar']} values={stats?.monthlyIssues?.map((point) => point.value) || [18, 25, 32]} />
        <BarChartCard title="Monthly Returns" labels={stats?.monthlyReturns?.map((point) => point.label) || ['Jan', 'Feb', 'Mar']} values={stats?.monthlyReturns?.map((point) => point.value) || [12, 18, 21]} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <div className="page-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-white">Featured Collection</h3>
            <span className="text-xs uppercase tracking-[0.28em] text-slate-500">Seeded demo books</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {collection.map((book) => (
              <div key={typeof book === 'string' ? book : book.id} className="rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
                <div className="text-xs uppercase tracking-[0.3em] text-brand-300">Featured</div>
                <h4 className="mt-2 font-medium text-white">{typeof book === 'string' ? book : book.title}</h4>
                <p className="mt-2 text-sm text-slate-400">
                  {typeof book === 'string'
                    ? 'A recommended title from the demo catalog.'
                    : `${book.author?.name || 'Unknown author'} / ${book.category?.name || 'General'} / ${book.availableCopies || 0} copies ready`}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="page-card p-5">
          <h3 className="mb-4 font-semibold text-white">Live Highlights</h3>
          <ul className="space-y-3 text-sm leading-6 text-slate-300">
            <li>- {stats?.reservedBooks || 0} reservations currently active.</li>
            <li>- {stats?.overdueBooks || 0} overdue loans need attention today.</li>
            <li>- {stats?.readingHallOccupancy || 0}% reading hall occupancy across the latest window.</li>
            <li>- Demo data can be refreshed instantly from the catalog page if you want a clean reset.</li>
          </ul>
          {loading && <div className="mt-4 text-sm text-slate-500">Loading dashboard data...</div>}
        </div>
      </section>
    </div>
  );
}
