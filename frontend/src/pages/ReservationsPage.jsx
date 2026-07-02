import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { useSeo } from '../hooks/useSeo';

const seats = ['A-12', 'A-14', 'B-03', 'B-08', 'C-08', 'C-10'];
const slots = ['09:00 AM - 11:00 AM', '10:00 AM - 12:00 PM', '01:00 PM - 03:00 PM', '03:00 PM - 05:00 PM'];

export default function ReservationsPage() {
  useSeo({
    title: 'Reservations',
    description: 'Reserve seats and manage book reservations in Smart Library.',
  });
  const [seatReservations, setSeatReservations] = useState([]);
  const [bookReservations, setBookReservations] = useState([]);
  const [form, setForm] = useState({ seatNumber: seats[0], timeSlot: slots[0] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadReservations = async () => {
    setLoading(true);
    setError('');
    try {
      const [seatResult, bookResult] = await Promise.all([
        api.get('/reservations/seats'),
        api.get('/reservations/books'),
      ]);
      setSeatReservations(seatResult.data);
      setBookReservations(bookResult.data);
    } catch (err) {
      console.error(err);
      setError('Unable to load reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const activeSeatKeys = useMemo(() => new Set(seatReservations.filter((item) => item.status !== 'CANCELLED').map((item) => `${item.seatNumber}|${item.timeSlot}`)), [seatReservations]);

  const reserveSeat = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await api.post('/reservations/seats', form);
      setNotice('Seat reservation confirmed.');
      await loadReservations();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Unable to reserve this seat.');
    } finally {
      setSaving(false);
    }
  };

  const cancelSeat = async (id) => {
    setError('');
    setNotice('');
    try {
      await api.patch(`/reservations/seats/${id}/cancel`);
      setNotice('Seat reservation cancelled.');
      await loadReservations();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Unable to cancel reservation.');
    }
  };

  const cancelBook = async (id) => {
    setError('');
    setNotice('');
    try {
      await api.patch(`/reservations/books/${id}/cancel`);
      setNotice('Book reservation cancelled.');
      await loadReservations();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Unable to cancel book reservation.');
    }
  };

  return (
    <div className="space-y-6">
      <section className="page-card p-6 sm:p-8">
        <p className="section-label">Reservations</p>
        <h2 className="mt-4 text-3xl font-semibold text-white">Seat and book reservations</h2>
        <p className="mt-3 text-sm text-slate-400">Book a reading hall seat, review active seat bookings, and track reserved catalog titles.</p>
      </section>

      {error && <div className="rounded-3xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
      {notice && <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{notice}</div>}

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <form onSubmit={reserveSeat} className="page-card space-y-4 p-5">
          <h3 className="text-xl font-semibold text-white">Reserve a seat</h3>
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-slate-500">Seat</span>
            <select value={form.seatNumber} onChange={(event) => setForm({ ...form, seatNumber: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none">
              {seats.map((seat) => <option key={seat} value={seat}>{seat}</option>)}
            </select>
          </label>
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-slate-500">Time slot</span>
            <select value={form.timeSlot} onChange={(event) => setForm({ ...form, timeSlot: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none">
              {slots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
            </select>
          </label>
          <button disabled={saving || activeSeatKeys.has(`${form.seatNumber}|${form.timeSlot}`)} className="w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white hover:bg-brand-600 disabled:opacity-50">
            {saving ? 'Reserving...' : activeSeatKeys.has(`${form.seatNumber}|${form.timeSlot}`) ? 'Slot unavailable' : 'Reserve seat'}
          </button>
        </form>

        <section className="page-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Seat bookings</h3>
            <button onClick={loadReservations} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 hover:bg-white/10">Refresh</button>
          </div>
          {loading ? <div className="py-8 text-slate-400">Loading reservations...</div> : (
            <div className="grid gap-4 md:grid-cols-2">
              {seatReservations.map((item) => (
                <article key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm text-slate-400">Reading Hall Seat</div>
                  <div className="mt-1 text-lg font-medium text-white">{item.seatNumber}</div>
                  <div className="mt-2 text-xs text-emerald-300">{item.timeSlot}</div>
                  <div className="mt-3 text-sm text-slate-400">{item.userName || 'Reserved user'} / {item.status}</div>
                  {item.status !== 'CANCELLED' && <button onClick={() => cancelSeat(item.id)} className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs text-red-200 hover:bg-red-500/20">Cancel</button>}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="page-card p-5">
        <h3 className="mb-4 text-xl font-semibold text-white">Book reservations</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {bookReservations.map((item) => (
            <article key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.25em] text-brand-300">{item.status}</div>
              <h4 className="mt-2 font-medium text-white">{item.bookTitle}</h4>
              <p className="mt-2 text-sm text-slate-400">{item.userName} / expires {item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : '-'}</p>
              {item.status !== 'CANCELLED' && <button onClick={() => cancelBook(item.id)} className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs text-red-200 hover:bg-red-500/20">Cancel</button>}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
