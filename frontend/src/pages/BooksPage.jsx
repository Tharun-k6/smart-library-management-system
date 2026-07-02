import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSeo } from '../hooks/useSeo';

const emptyForm = {
  title: '',
  isbn: '',
  authorId: '',
  publisherId: '',
  categoryId: '',
  description: '',
  coverImageUrl: '',
  quantity: 1,
  shelfLocation: '',
  price: '',
  digitalAvailable: true,
};

const idFields = new Set(['authorId', 'publisherId', 'categoryId']);

export default function BooksPage() {
  const { user } = useAuth();
  useSeo({
    title: 'Catalog',
    description: 'Search and manage Smart Library inventory, books, and demo data.',
  });
  const canManageCatalog = ['ADMIN', 'LIBRARIAN'].includes(user?.role);
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reseedLoading, setReseedLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const loadBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/books');
      setBooks(data);
    } catch (err) {
      console.error(err);
      setError("We couldn't reach the library service. Please make sure the backend is running and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const categories = useMemo(() => {
    return ['All', ...new Set(books.map((book) => book.category?.name).filter(Boolean))];
  }, [books]);

  const summary = useMemo(() => {
    const totalCopies = books.reduce((sum, book) => sum + (book.quantity || 0), 0);
    const availableCopies = books.reduce((sum, book) => sum + (book.availableCopies || 0), 0);
    const digitalBooks = books.filter((book) => book.digitalAvailable).length;
    return { totalCopies, availableCopies, digitalBooks, totalBooks: books.length };
  }, [books]);

  const filteredBooks = useMemo(() => {
    const value = query.trim().toLowerCase();
    return books.filter((book) => {
      const matchesCategory = category === 'All' || book.category?.name === category;
      const matchesQuery = !value || [book.title, book.isbn, book.author?.name, book.category?.name].some((field) => field?.toLowerCase().includes(value));
      return matchesCategory && matchesQuery;
    });
  }, [books, query, category]);

  const featuredBooks = useMemo(() => filteredBooks.slice(0, 6), [filteredBooks]);

  const reseedDemoData = async () => {
    if (user?.role !== 'ADMIN') {
      setError('Only admins can reseed demo data.');
      return;
    }
    setReseedLoading(true);
    setNotice('');
    setError('');
    try {
      await api.post('/dev/reseed');
      setNotice('Demo data refreshed successfully.');
      await loadBooks();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err?.response?.data || 'Unable to refresh demo data.');
    } finally {
      setReseedLoading(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!canManageCatalog) {
      setError('Only admins and librarians can save catalog changes.');
      return;
    }
    setError('');
    setNotice('');

    const payload = {
      ...form,
      authorId: Number(form.authorId),
      publisherId: Number(form.publisherId),
      categoryId: Number(form.categoryId),
      quantity: Number(form.quantity),
      price: form.price === '' ? null : Number(form.price),
    };

    try {
      setSaving(true);
      if (editingId) {
        await api.put(`/books/${editingId}`, payload);
      } else {
        await api.post('/books', payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      setNotice(editingId ? 'Book updated successfully.' : 'Book created successfully.');
      await loadBooks();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Unable to save book. Check author, publisher, and category IDs.');
    } finally {
      setSaving(false);
    }
  };

  const editBook = (book) => {
    setEditingId(book.id);
    setForm({
      title: book.title || '',
      isbn: book.isbn || '',
      authorId: book.author?.id || '',
      publisherId: book.publisher?.id || '',
      categoryId: book.category?.id || '',
      description: book.description || '',
      coverImageUrl: book.coverImageUrl || '',
      quantity: book.quantity || 1,
      shelfLocation: book.shelfLocation || '',
      price: book.price ?? '',
      digitalAvailable: Boolean(book.digitalAvailable),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeBook = async (id) => {
    if (!canManageCatalog) {
      setError('Only admins and librarians can delete books.');
      return;
    }
    setError('');
    setNotice('');
    try {
      await api.delete(`/books/${id}`);
      setNotice('Book deleted successfully.');
      await loadBooks();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Unable to delete book.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const reserveBook = async (bookId) => {
    setError('');
    setNotice('');
    try {
      await api.post('/reservations/books', { bookId });
      setNotice('Book reservation created successfully.');
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Unable to reserve book.');
    }
  };

  return (
    <div className="space-y-6">
      <section className="page-card overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="bg-gradient-to-br from-brand-500/20 via-white/5 to-emerald-400/10 p-6 sm:p-8 lg:p-10">
            <p className="section-label">Catalog operations</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Library inventory management</h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              Search, edit, create, delete, and reseed demo books from a polished enterprise interface connected to your backend.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={loadBooks} className="rounded-2xl bg-brand-500 px-4 py-3 text-sm font-medium text-white hover:bg-brand-600">
                Refresh catalog
              </button>
              {user?.role === 'ADMIN' && <button onClick={reseedDemoData} disabled={reseedLoading} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 hover:bg-white/10 disabled:opacity-50">
                {reseedLoading ? 'Refreshing demo data...' : 'Reseed demo data'}
              </button>}
            </div>
          </div>

          <div className="border-t border-white/10 bg-slate-950/40 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['Books', summary.totalBooks],
                ['Available copies', summary.availableCopies],
                ['Total copies', summary.totalCopies],
                ['Digital titles', summary.digitalBooks],
              ].map(([label, value]) => (
                <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm text-slate-400">{label}</div>
                  <div className="mt-2 text-3xl font-semibold text-white">{value}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
              Signed in as <span className="font-medium text-white">{user?.fullName || 'Admin'}</span>. You can manage the catalog and reseed demo data at any time.
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="flex flex-col gap-4 rounded-3xl border border-red-400/20 bg-red-500/10 p-6 text-sm text-slate-200 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-semibold text-white">Catalog issue</div>
            <div className="mt-1 text-slate-300">{error}</div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadBooks} className="rounded-2xl bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">Retry</button>
            <button onClick={() => window.location.reload()} className="rounded-2xl border border-white/10 bg-transparent px-4 py-2 text-sm text-slate-300">Reload app</button>
          </div>
        </div>
      )}

      {notice && (
        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{notice}</div>
      )}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        {canManageCatalog && <form onSubmit={submit} className="page-card space-y-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-white">{editingId ? 'Edit Book' : 'Add Book'}</h3>
              <p className="text-sm text-slate-400">Use the demo IDs from the seeded backend records.</p>
            </div>
            {editingId && <button type="button" onClick={resetForm} className="text-sm text-slate-400 hover:text-white">Cancel</button>}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {['title', 'isbn', 'authorId', 'publisherId', 'categoryId', 'coverImageUrl', 'shelfLocation', 'price'].map((field) => (
              <label key={field} className="space-y-2">
                <span className="text-xs uppercase tracking-[0.25em] text-slate-500">{field.replace(/([A-Z])/g, ' $1')}</span>
                <input
                  value={form[field]}
                  onChange={(event) => setForm({ ...form, [field]: event.target.value })}
                  placeholder={idFields.has(field) ? 'e.g. 1' : field.replace(/([A-Z])/g, ' $1')}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
                />
              </label>
            ))}
          </div>

          <textarea
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            placeholder="Description"
            className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="number"
              min="1"
              value={form.quantity}
              onChange={(event) => setForm({ ...form, quantity: event.target.value })}
              placeholder="Quantity"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
            />
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              <input type="checkbox" checked={form.digitalAvailable} onChange={(event) => setForm({ ...form, digitalAvailable: event.target.checked })} />
              Digital available
            </label>
          </div>

          <button disabled={saving} className="w-full rounded-2xl bg-gradient-to-r from-brand-500 to-emerald-400 px-4 py-3 font-semibold text-white shadow-lg shadow-brand-500/20 hover:brightness-110 disabled:opacity-60">
            {saving ? 'Saving...' : editingId ? 'Update Book' : 'Create Book'}
          </button>
        </form>}

        <section className={`page-card p-5 ${canManageCatalog ? '' : 'xl:col-span-2'}`}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-white">Inventory</h3>
              <p className="text-sm text-slate-400">Browse and manage the live catalog.</p>
            </div>
            <button onClick={loadBooks} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10">Refresh</button>
          </div>

          <div className="mb-5 grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, author, ISBN..."
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
            />
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full border px-3 py-2 text-xs transition ${category === item ? 'border-brand-400/40 bg-brand-500/15 text-white' : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-8 text-slate-400">Loading books...</div>
          ) : filteredBooks.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-400">No books match the current filters.</div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {featuredBooks.map((book) => (
                  <article key={book.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.25em] text-brand-300">{book.category?.name || 'General'}</div>
                        <h4 className="mt-2 text-lg font-semibold text-white">{book.title}</h4>
                        <p className="mt-1 text-sm text-slate-400">{book.author?.name || 'Unknown author'} / {book.publisher?.name || 'Unknown publisher'}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2 text-right text-xs text-slate-300">
                        <div className="text-sm font-semibold text-white">{book.availableCopies ?? 0}</div>
                        copies
                      </div>
                    </div>
                    <p className="mt-4 line-clamp-3 text-sm text-slate-400">{book.description || 'No description available.'}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">ISBN {book.isbn || '-'}</span>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">{book.digitalAvailable ? 'Digital' : 'Print only'}</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      {canManageCatalog ? (
                        <>
                          <button onClick={() => editBook(book)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 hover:bg-white/10">Edit</button>
                          <button onClick={() => removeBook(book.id)} className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs text-red-200 hover:bg-red-500/20">Delete</button>
                        </>
                      ) : (
                        <button onClick={() => reserveBook(book.id)} className="rounded-xl border border-brand-400/30 bg-brand-500/15 px-3 py-2 text-xs text-white hover:bg-brand-500/25">Reserve book</button>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-slate-400">
                    <tr>
                      <th className="py-3">Title</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th>Availability</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBooks.map((book) => (
                      <tr key={book.id} className="border-t border-white/10 align-top text-slate-200">
                        <td className="py-4 pr-4 font-medium">
                          <div>{book.title}</div>
                          <div className="mt-1 text-xs text-slate-500">{book.isbn || '-'}</div>
                        </td>
                        <td className="pr-4">{book.author?.name || '-'}</td>
                        <td className="pr-4">{book.category?.name || '-'}</td>
                        <td className="pr-4"><span className="rounded-full bg-white/10 px-3 py-1">{book.availableCopies > 0 ? 'Available' : 'Issued out'}</span></td>
                        <td className="space-x-2 text-right">
                          {canManageCatalog ? (
                            <>
                              <button onClick={() => editBook(book)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 hover:bg-white/10">Edit</button>
                              <button onClick={() => removeBook(book.id)} className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs text-red-200 hover:bg-red-500/20">Delete</button>
                            </>
                          ) : (
                            <button onClick={() => reserveBook(book.id)} className="rounded-xl border border-brand-400/30 bg-brand-500/15 px-3 py-2 text-xs text-white hover:bg-brand-500/25">Reserve</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
