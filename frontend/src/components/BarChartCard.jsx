import React, { useEffect, useRef } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// Register required controllers, elements, scales and plugins for Chart.js
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function BarChartCard({ title, labels, values, color = '#34d399' }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    // destroy existing chart if any (handles StrictMode double-mount)
    if (chartRef.current) {
      try { chartRef.current.destroy(); } catch (e) { /* ignore */ }
      chartRef.current = null;
    }

    const ctx = canvasRef.current && canvasRef.current.getContext ? canvasRef.current.getContext('2d') : canvasRef.current;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ data: values, backgroundColor: color, borderRadius: 10 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.08)' } },
        },
      },
    });
    chartRef.current = chart;
    return () => {
      if (chartRef.current) {
        try { chartRef.current.destroy(); } catch (e) { /* ignore */ }
        chartRef.current = null;
      }
    };
  }, [labels, values, color]);

  return (
    <div className="page-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">{title}</h3>
        <span className="text-xs uppercase tracking-[0.28em] text-slate-500">Category mix</span>
      </div>
      <div className="h-72">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
