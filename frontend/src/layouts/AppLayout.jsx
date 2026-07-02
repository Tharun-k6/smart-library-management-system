import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[18rem_1fr] shell-gradient">
      <Sidebar />
      <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
        <Topbar />
        {children}
      </main>
    </div>
  );
}
