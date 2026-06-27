import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card bn-card shadow border-0 p-4" style={{ width: '100%', maxWidth: 440 }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary"><i className="bi bi-feather me-2"></i>BlogNest</h2>
          <p className="text-muted">Welcome back! Sign in to continue.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              style={{ borderRadius: 10 }}
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Your password"
              value={form.password}
              onChange={handleChange}
              required
              style={{ borderRadius: 10 }}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 rounded-pill py-2 fw-semibold" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
            Sign In
          </button>
        </form>

        <p className="text-center mt-3 mb-0 small text-muted">
          Don't have an account? <Link to="/register" className="text-primary fw-semibold">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
