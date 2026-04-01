import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from?.pathname || '/';

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError('');
      const user = await login(formData);
      navigate(user.role === 'admin' ? '/admin/books' : redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="form-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <div>
          <span className="eyebrow">Welcome back</span>
          <h1>Login to your account</h1>
        </div>

        {error && <div className="alert error">{error}</div>}

        <label>
          Email
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>

        <label>
          Password
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="muted-text">
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </p>
      </form>
    </section>
  );
}

export default LoginPage;
