function BookCard({ book, onBorrow, onDelete, canBorrow = false, canDelete = false, busy = false }) {
  const pdfLink = book.pdfUrl ? `/${book.pdfUrl.replace(/\\/g, '/')}` : null;

  return (
    <article className="book-card">
      <div className="book-card__top">
        <span className={`status-pill ${book.available ? 'available' : 'unavailable'}`}>
          {book.available ? 'Available' : 'Unavailable'}
        </span>
        <span className="price-tag">${book.price}</span>
      </div>

      <h3>{book.title}</h3>
      <p>{book.description || 'No description added for this book yet.'}</p>

      <div className="book-card__actions">
        {pdfLink && (
          <a href={pdfLink} target="_blank" rel="noreferrer" className="ghost-button link-button">
            Open PDF
          </a>
        )}
        {canBorrow && (
          <button type="button" className="primary-button" onClick={() => onBorrow(book._id)} disabled={busy}>
            {busy ? 'Borrowing...' : 'Borrow'}
          </button>
        )}
        {canDelete && (
          <button type="button" className="danger-button" onClick={() => onDelete(book._id)} disabled={busy}>
            {busy ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>
    </article>
  );
}

export default BookCard;
