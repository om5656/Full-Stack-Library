import { useEffect, useState } from 'react';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { getMyBorrows, returnBorrow } from '../services/borrowService';

function BorrowsPage() {
  const { token } = useAuth();
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  const loadBorrows = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getMyBorrows(token);
      setBorrows(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBorrows();
  }, [token]);

  const handleReturn = async (borrowId) => {
    try {
      setBusyId(borrowId);
      await returnBorrow(borrowId, token);
      await loadBorrows();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId('');
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading your borrows..." />;
  }

  return (
    <section className="stack-lg">
      <div className="section-heading">
        <span className="eyebrow">My Activity</span>
        <h1>Borrowed books</h1>
      </div>

      {error && <div className="alert error">{error}</div>}

      {borrows.length ? (
        <div className="borrow-list">
          {borrows.map((borrow) => (
            <article key={borrow._id} className="borrow-card">
              <div>
                <h3>{borrow.book?.title || 'Deleted book'}</h3>
                <p>Status: {borrow.status}</p>
                <p>Borrowed at: {new Date(borrow.borrowDate).toLocaleDateString()}</p>
              </div>

              {borrow.status !== 'returned' && (
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => handleReturn(borrow._id)}
                  disabled={busyId === borrow._id}
                >
                  {busyId === borrow._id ? 'Returning...' : 'Return book'}
                </button>
              )}
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No borrowed books"
          description="??? ?????? ???? ?? ?????? ???????? ????? ??? ??????."
        />
      )}
    </section>
  );
}

export default BorrowsPage;
