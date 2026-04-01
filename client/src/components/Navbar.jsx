import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <header className="navbar-shell">
      <div className="container navbar">
        <Link to="/" className="brand-mark">
          Library Hub
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          {isAuthenticated && <NavLink to="/borrows">My Borrows</NavLink>}
          {isAdmin && <NavLink to="/admin/books">Admin</NavLink>}
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <span className="user-badge">{user?.username}</span>
              <button type="button" className="ghost-button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="ghost-button link-button">
                Login
              </Link>
              <Link to="/register" className="primary-button link-button">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
