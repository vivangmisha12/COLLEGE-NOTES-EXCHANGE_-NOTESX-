import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { User, Mail, Lock, GraduationCap, BookOpen, Calendar, Chrome, Apple, Facebook, Users, TrendingUp } from 'lucide-react';
import './Auth.css';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', college: '', branch: '', year: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await api.post('/auth/register', { ...form, year: Number(form.year) });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="login-container">
        <div className="login-left" style={{padding: '40px 60px'}}>
          <div className="form-wrapper">
            <h1>Create Account</h1>
            <p className="subtitle">Join the NotesX community today.</p>
            {error && <div className="auth-error" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <User className="input-icon" size={20} />
                <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <Mail className="input-icon" size={20} />
                <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <Lock className="input-icon" size={20} />
                <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <GraduationCap className="input-icon" size={20} />
                <input name="college" placeholder="College Name" value={form.college} onChange={handleChange} required />
              </div>
              
              <div style={{display: 'flex', gap: '12px'}}>
                <div className="input-group" style={{flex: 2}}>
                  <BookOpen className="input-icon" size={20} />
                  <input name="branch" placeholder="Branch" value={form.branch} onChange={handleChange} required />
                </div>
                <div className="input-group" style={{flex: 1}}>
                  <Calendar className="input-icon" size={20} />
                  <input name="year" type="number" placeholder="Year" value={form.year} onChange={handleChange} required />
                </div>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Creating...' : 'Register'}
              </button>
              
              <div className="divider"><span>or sign up with</span></div>
              
              <div className="social-login">
                <button type="button" className="social-icon"><Chrome size={20} /></button>
                <button type="button" className="social-icon"><Apple size={20} /></button>
                <button type="button" className="social-icon"><Facebook size={20} /></button>
              </div>
              
              <p style={{textAlign: 'center', marginTop: '20px', fontSize: '14px'}}>
                Already registered? <Link to="/login" style={{fontWeight: '600', textDecoration: 'none', color: '#0f172a'}}>Login now</Link>
              </p>
            </form>
          </div>
        </div>

        <div className="login-right">
          <div className="illustration-card register-card">
            <img src="https://res.cloudinary.com/dnodl6md7/image/upload/v1769019953/Add_notes-bro_krcvpj.svg" alt="NotesX Community" />
            <div className="dots">
              <span className="dot active"></span><span className="dot"></span><span className="dot"></span>
            </div>
            <div className="interactive-headline">
              <h2>
                <span className="collab-text"><Users size={24} className="hover-icon" /> Collaborate</span> and 
                <span className="grow-text"> grow <TrendingUp size={24} className="grow-icon" /></span>
                <br /> with NotesX
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;