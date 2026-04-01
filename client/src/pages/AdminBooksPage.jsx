import { useEffect, useState } from 'react';
import BookCard from '../components/BookCard';
import { useAuth } from '../context/AuthContext';
import { createBook, deleteBook } from '../services/adminService';
import { getBooks } from '../services/bookService';

function AdminBooksPage() {
  const { token } = useAuth();
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', price: '' });
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [busyDeleteId, setBusyDeleteId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await getBooks();
      setBooks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');
      setMessage('');

      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('price', formData.price);

      if (pdfFile) {
        payload.append('pdf', pdfFile);
      }

      await createBook(payload, token);
      setFormData({ title: '', description: '', price: '' });
      setPdfFile(null);
      setMessage('Book created successfully.');
      await loadBooks();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (bookId) => {
    try {
      setBusyDeleteId(bookId);
      setError('');
      setMessage('');
      await deleteBook(bookId, token);
      setMessage('Book deleted successfully.');
      await loadBooks();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyDeleteId('');
    }
  };

  return (
    <section className="admin-grid">
      <form className="form-card" onSubmit={handleSubmit}>
        <div>
          <span className="eyebrow">Admin Panel</span>
          <h1>Add a new book</h1>
        </div>

        {error && <div className="alert error">{error}</div>}
        {message && <div className="alert success">{message}</div>}

        <label>
          Title
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </label>

        <label>
          Description
          <textarea name="description" value={formData.description} onChange={handleChange} rows="4" />
        </label>

        <label>
          Price
          <input type="number" name="price" value={formData.price} onChange={handleChange} min="0" step="0.01" required />
        </label>

        <label>
          PDF file
          <input type="file" accept="application/pdf" onChange={(event) => setPdfFile(event.target.files?.[0] || null)} />
        </label>

        <button type="submit" className="primary-button" disabled={submitting}>
          {submitting ? 'Saving...' : 'Add book'}
        </button>
      </form>

      <div className="stack-lg">
        <div className="section-heading">
          <span className="eyebrow">Catalog</span>
          <h2>All books</h2>
        </div>

        {loading ? (
          <p className="muted-text">Loading books...</p>
        ) : (
          <div className="book-grid">
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                canDelete
                onDelete={handleDelete}
                busy={busyDeleteId === book._id}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminBooksPage;
