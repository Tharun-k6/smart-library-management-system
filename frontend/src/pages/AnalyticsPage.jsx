import React, { useEffect, useState } from 'react';
import api from '../services/api';
import LineChartCard from '../components/LineChartCard';
import BarChartCard from '../components/BarChartCard';
import StatCard from '../components/StatCard';
import { useSeo } from '../hooks/useSeo';

export default function AnalyticsPage() {
  useSeo({
    title: 'Analytics',
    description: 'Track issues, returns, categories, and fine collection in Smart Library.',
  });
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/analytics')
      .then(({ data }) => setStats(data))
      .catch((err) => {
        console.error(err);
        setError('Unable to load analytics.');
      });
  }, []);

  const monthlyIssues = stats?.monthlyIssues || [
    { label: 'Jan', value: 12 },
    { label: 'Feb', value: 18 },
    { label: 'Mar', value: 21 },
  ];
  const monthlyReturns = stats?.monthlyReturns || [
    { label: 'Jan', value: 10 },
    { label: 'Feb', value: 16 },
    { label: 'Mar', value: 19 },
  ];

  return (
    <div className="space-y-6">
      <div className="page-card p-6 sm:p-8">
        <p className="section-label">Analytics</p>
        <h2 className="mt-4 text-3xl font-semibold text-white">Operational insights</h2>
        <p className="mt-3 text-sm text-slate-400">Track issues, returns, category trends, and fine collection from backend metrics.</p>
      </div>

      {error && <div className="rounded-3xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Books" value={stats?.totalBooks?.toLocaleString() || '-'} hint="Catalog size" icon="BK" />
        <StatCard title="Issued" value={stats?.issuedBooks?.toLocaleString() || '-'} hint="Currently on loan" icon="OUT" tone="from-amber-500 to-orange-400" />
        <StatCard title="Reserved" value={stats?.reservedBooks?.toLocaleString() || '-'} hint="Active reservations" icon="RSV" tone="from-purple-500 to-pink-400" />
        <StatCard title="Fines" value={`Rs ${Number(stats?.totalFines || 0).toLocaleString('en-IN')}`} hint="Tracked collection" icon="Rs" tone="from-rose-500 to-red-400" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <LineChartCard title="Monthly Issues" labels={monthlyIssues.map((point) => point.label)} values={monthlyIssues.map((point) => point.value)} color="#a78bfa" />
        <BarChartCard title="Monthly Returns" labels={monthlyReturns.map((point) => point.label)} values={monthlyReturns.map((point) => point.value)} color="#34d399" />
      </div>
    </div>
  );
}
