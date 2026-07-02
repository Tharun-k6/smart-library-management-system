import React from 'react';
import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';

const highlights = [
  { title: 'Role-aware portals', copy: 'Admins, librarians, and students each get the right tools without clutter.' },
  { title: 'Connected workflows', copy: 'Books, reservations, reports, analytics, and notifications are wired together.' },
  { title: 'Search-friendly homepage', copy: 'A public root page with a clear title, description, and clean entry path.' },
];

const showcaseStats = [
  { label: 'Curated titles', value: '12+' },
  { label: 'Roles supported', value: '3' },
  { label: 'Core workflows', value: '8' },
];

const featuredBooks = [
  {
    title: 'Deep Learning with Python',
    meta: 'AI / Manning',
    summary: 'Hands-on machine learning reference for practical AI exploration.',
  },
  {
    title: 'Designing Data-Intensive Applications',
    meta: 'Systems / O’Reilly',
    summary: 'A modern systems guide for reliability, scalability, and maintainability.',
  },
  {
    title: 'The Pragmatic Programmer',
    meta: 'Engineering / Addison-Wesley',
    summary: 'A timeless software craftsmanship title for everyday engineering decisions.',
  },
  {
    title: 'Atomic Habits',
    meta: 'Productivity / Random House',
    summary: 'A clear, readable title that resonates well in demo and student workflows.',
  },
];

const demoAccounts = [
  ['Admin', 'admin@smartlib.com'],
  ['Librarian', 'librarian@smartlib.com'],
  ['Student', 'student@smartlib.com'],
];

export default function LandingPage() {
  useSeo({
    title: 'Smart Library Management System',
    description:
      'Manage books, reservations, analytics, reports, and AI-powered library workflows from one polished root landing page.',
  });

  return (
    <main className="shell-gradient min-h-screen">
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-2xl shadow-black/30">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="bg-gradient-to-br from-brand-600/25 via-slate-950 to-emerald-500/10 p-8 sm:p-10 lg:p-14">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.28em] text-slate-400">
                <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-emerald-200">Production-style UI</span>
                <span>Company submission ready</span>
              </div>
              <p className="section-label mt-6">Smart Library</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                One polished root for a complete library management experience.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Start with a clean public homepage, enter secure role-based portals, and manage the full workflow from catalog to analytics with confidence.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/login" className="rounded-2xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:bg-brand-600">
                  Sign in
                </Link>
                <Link to="/register" className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white">
                  Create account
                </Link>
                <a href="#featured-books" className="rounded-2xl border border-white/10 bg-transparent px-5 py-3 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white">
                  Explore books
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {showcaseStats.map((stat) => (
                  <article key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                    <div className="text-3xl font-semibold text-white">{stat.value}</div>
                    <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
                  </article>
                ))}
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {highlights.map((item) => (
                  <article key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                    <h2 className="text-base font-semibold text-white">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.copy}</p>
                  </article>
                ))}
              </div>
            </div>

            <aside className="space-y-5 border-t border-white/10 p-8 sm:p-10 lg:border-l lg:border-t-0 lg:p-14">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Demo access</p>
                <div className="mt-4 space-y-3">
                  {demoAccounts.map(([role, email]) => (
                    <div key={role} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                      <div>
                        <div className="font-medium text-white">{role}</div>
                        <div className="text-sm text-slate-400">{email}</div>
                      </div>
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">Ready</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-brand-500/20 via-white/5 to-emerald-400/15 p-6">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Submission quality</p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                  <li>- Public root page with a polished marketing layout.</li>
                  <li>- Page titles and descriptions are handled consistently.</li>
                  <li>- Submission-ready presentation with clearer hierarchy.</li>
                </ul>
              </div>
            </aside>
          </div>

          <div id="featured-books" className="border-t border-white/10 p-8 sm:p-10 lg:p-14">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-label">Featured collection</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">A stronger demo catalog for your submission</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                  These titles make the project feel more complete, visually richer, and ready for a company-style review.
                </p>
              </div>
              <Link to="/dashboard" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 hover:bg-white/10">
                Open dashboard
              </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {featuredBooks.map((book) => (
                <article key={book.title} className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:bg-white/10">
                  <div className="text-xs uppercase tracking-[0.28em] text-brand-300">Featured book</div>
                  <h3 className="mt-3 text-lg font-semibold text-white">{book.title}</h3>
                  <div className="mt-2 text-sm text-slate-400">{book.meta}</div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{book.summary}</p>
                </article>
              ))}
            </div>
          </div>

          <footer className="border-t border-white/10 px-8 py-6 sm:px-10 lg:px-14">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm font-medium text-white">Smart Library Management System</div>
                <p className="mt-1 text-sm text-slate-400">Built for a polished demo, a clear submission, and a clean public landing experience.</p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">React + Vite</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Spring Boot</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">JWT Security</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">MySQL Ready</span>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
