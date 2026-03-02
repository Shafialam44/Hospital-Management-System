import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await login(form);
      loginUser(data);
      toast.success(`Welcome back, ${data.name}!`);
      if (data.role === 'PATIENT') navigate('/patient/dashboard');
      else if (data.role === 'DOCTOR') navigate('/doctor/dashboard');
      else navigate('/admin/dashboard');
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-title">🏥 MediCare</div>
      <div className="form-subtitle">Sign in to your account</div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" required placeholder="Enter your email"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" required placeholder="Enter your password"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        </div>
        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
        Don't have an account? <Link to="/register" style={{ color: '#1a73e8' }}>Register here</Link>
      </p>
      <div style={{ marginTop: '20px', padding: '12px', background: '#f0f4f8', borderRadius: '8px', fontSize: '0.85rem', color: '#555' }}>
        <strong>Demo Accounts:</strong><br/>
        Admin: admin@hospital.com / admin123<br/>
        (Register to create Patient/Doctor accounts)
      </div>
    </div>
  );
};

export default Login;
