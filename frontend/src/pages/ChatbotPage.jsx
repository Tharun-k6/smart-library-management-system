import React, { useState } from 'react';
import api from '../services/api';
import { useSeo } from '../hooks/useSeo';

const starterPrompts = [
  'Recommend books on AI',
  'How do I reserve a seat?',
  'What should I do about due dates?',
];

export default function ChatbotPage() {
  useSeo({
    title: 'AI Assistant',
    description: 'Ask Smart Library AI about books, due dates, reservations, and workflows.',
  });
  const [prompt, setPrompt] = useState(starterPrompts[0]);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I can help with catalog recommendations, reservations, due dates, and library workflows.', suggestions: starterPrompts },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendPrompt = async (event) => {
    event?.preventDefault();
    const text = prompt.trim();
    if (!text) return;

    setMessages((current) => [...current, { role: 'user', text }]);
    setPrompt('');
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/ai/chat', { prompt: text });
      setMessages((current) => [...current, { role: 'assistant', text: data.answer, suggestions: data.suggestions || [] }]);
    } catch (err) {
      console.error(err);
      setError('Unable to reach the AI assistant.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="page-card p-6 sm:p-8">
        <p className="section-label">AI Assistant</p>
        <h2 className="mt-4 text-3xl font-semibold text-white">Library workflow assistant</h2>
        <p className="mt-3 text-sm text-slate-400">Ask about recommendations, reservations, reports, fines, and catalog workflows.</p>
      </section>

      {error && <div className="rounded-3xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

      <div className="page-card flex min-h-[32rem] flex-col p-5">
        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`max-w-3xl rounded-3xl border p-4 ${message.role === 'user' ? 'ml-auto border-brand-400/30 bg-brand-500/15 text-white' : 'border-white/10 bg-white/5 text-slate-300'}`}>
              <p className="text-sm leading-6">{message.text}</p>
              {message.suggestions?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.suggestions.map((item) => (
                    <button key={item} type="button" onClick={() => setPrompt(item)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 hover:bg-white/10">
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">Thinking...</div>}
        </div>

        <form onSubmit={sendPrompt} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask the assistant..." className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20" />
          <button disabled={loading} className="rounded-2xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60">Send</button>
        </form>
      </div>
    </div>
  );
}
