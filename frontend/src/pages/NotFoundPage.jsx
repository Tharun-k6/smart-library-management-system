import React from 'react';
import { useSeo } from '../hooks/useSeo';

export default function NotFoundPage() {
  useSeo({
    title: 'Page not found',
    description: 'The requested Smart Library page could not be found.',
  });
  return (
    <div className="flex min-h-screen items-center justify-center p-6 text-center">
      <div className="glass-panel max-w-lg rounded-3xl p-10">
        <h1 className="text-4xl font-bold text-white">404</h1>
        <p className="mt-3 text-slate-400">The page you're looking for does not exist.</p>
      </div>
    </div>
  );
}
