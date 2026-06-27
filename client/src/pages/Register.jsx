import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to BlogNest 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '85vh' }}>
      <div className="card bn-card shadow border-0 p-4" style={{ width: '100%', maxWidth: 440 }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary"><i className="bi bi-feather me-2"></i>BlogNest</h2>
          <p className="text-muted">Create your account and start writing.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input type="text" name="name" className="form-control" placeholder="Your name" value={form.name} onChange={handleChange} required style={{ borderRadius: 10 }} />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input type="email" name="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={handleChange} required style={{ borderRadius: 10 }} />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input type="password" name="password" className="form-control" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required style={{ borderRadius: 10 }} />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Confirm Password</label>
            <input type="password" name="confirm" className="form-control" placeholder="Repeat password" value={form.confirm} onChange={handleChange} required style={{ borderRadius: 10 }} />
          </div>
          <button type="submit" className="btn btn-primary w-100 rounded-pill py-2 fw-semibold" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
            Create Account
          </button>
        </form>

        <p className="text-center mt-3 mb-0 small text-muted">
          Already have an account? <Link to="/login" className="text-primary fw-semibold">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
