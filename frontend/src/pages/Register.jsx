// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Auth.css';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    branch: '',
    year: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/register', {
        ...form,
        year: Number(form.year)
      });

      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join College Notes Exchange</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input name="name" value={form.name} onChange={handleChange} required />
            <label>Full Name</label>
          </div>

          <div className="input-group">
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
            <label>Email</label>
          </div>

          <div className="input-group">
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <label>Password</label>
          </div>

          <div className="input-group">
            <input name="college" value={form.college} onChange={handleChange} required />
            <label>College Name</label>
          </div>

          <div className="input-group">
            <input name="branch" value={form.branch} onChange={handleChange} required />
            <label>Branch (IT / CSE)</label>
          </div>

          <div className="input-group">
            <input
              name="year"
              type="number"
              min="1"
              max="4"
              value={form.year}
              onChange={handleChange}
              required
            />
            <label>Year (1 – 4)</label>
          </div>

          <button className="auth-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
