import { useEffect, useState } from 'react';
import BookCard from '../components/BookCard';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { getBooks } from '../services/bookService';
import { borrowBook } from '../services/borrowService';

function HomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busyBookId, setBusyBookId] = useState('');
  
  const { user, isAuthenticated, token } = useAuth();
  const loadBooks = async () => {
    try {
      setLoading(true);
      setError('');
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

  const handleBorrow = async (bookId) => {
    try {
      setBusyBookId(bookId);
      setMessage('');
      setError('');
      await borrowBook(bookId, token);
      setMessage('Book borrowed successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyBookId('');
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading books..." />;
  }

  return (
    <section className="stack-lg">
      <div className="hero-panel">
        <div>
          <span className="eyebrow"></span>
          <h1> Hello {user?.username?.[0]?.toUpperCase() + user?.username?.slice(1) || ""}</h1>

        </div>
      </div>

      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}

      {books.length ? (
        <div className="book-grid">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              canBorrow={isAuthenticated}
              onBorrow={handleBorrow}
              busy={busyBookId === book._id}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No books yet"
          description="???? ?????? ???? ?? ???? ??????? ?????? ????? ??? ????????."
        />
      )}
    </section>
  );
}

export default HomePage;
