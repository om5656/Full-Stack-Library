import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="state-card not-found-card">
      <span className="eyebrow">404</span>
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="primary-button link-button">
        Back home
      </Link>
    </section>
  );
}

export default NotFoundPage;
