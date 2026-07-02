import React, { useEffect, useRef } from 'react';
import { Chart, LineController, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Filler, Legend } from 'chart.js';

// Register required controllers, elements, scales and plugins for Chart.js v3+/v4
Chart.register(LineController, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Filler, Legend);

export default function LineChartCard({ title, labels, values, color = '#60a5fa' }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    // if a chart already exists on this ref, destroy it first (handles StrictMode double-mount)
    if (chartRef.current) {
      try { chartRef.current.destroy(); } catch (e) { /* ignore */ }
      chartRef.current = null;
    }

    const ctx = canvasRef.current && canvasRef.current.getContext ? canvasRef.current.getContext('2d') : canvasRef.current;
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: title,
            data: values,
            borderColor: color,
            backgroundColor: `${color}33`,
            fill: true,
            tension: 0.4,
            pointRadius: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.08)' } },
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
  }, [labels, values, color, title]);

  return (
    <div className="page-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">{title}</h3>
        <span className="text-xs uppercase tracking-[0.28em] text-slate-500">Live trend</span>
      </div>
      <div className="h-72">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
