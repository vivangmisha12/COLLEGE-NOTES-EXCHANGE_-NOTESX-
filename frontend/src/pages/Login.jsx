import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, Chrome, Apple, Facebook, Users, TrendingUp } from 'lucide-react';
import './Auth.css';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="login-container">
        <div className="login-left">
          <div className="form-wrapper">
            <h1>Welcome back!</h1>
            <p className="subtitle">Simplify your workflow and boost your productivity with NotesX.</p>
            
            {error && <div className="auth-error" style={{color: 'red', marginBottom: '15px', fontSize: '14px'}}>{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <Mail className="input-icon" size={20} />
                <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="input-group">
                <Lock className="input-icon" size={20} />
                <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
              <div className="form-options">
                 <Link to="/forgot-password" style={{float: 'right', fontSize: '13px', color: '#64748b', textDecoration: 'none'}}>Forgot Password?</Link>
              </div>
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Signing In...' : 'Login'}
              </button>
              
              <div className="divider"><span>or continue with</span></div>
              
              <div className="social-login">
                <button type="button" className="social-icon"><Chrome size={20} /></button>
                <button type="button" className="social-icon"><Apple size={20} /></button>
                <button type="button" className="social-icon"><Facebook size={20} /></button>
              </div>
              
              <p style={{textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748b'}}>
                Not a member? <Link to="/register" style={{color: '#0f172a', fontWeight: '600', textDecoration: 'none'}}>Register now</Link>
              </p>
            </form>
          </div>
        </div>

        <div className="login-right">
          <div className="illustration-card">
            <img src="https://res.cloudinary.com/dnodl6md7/image/upload/v1769019953/Notes-bro_segpoc.svg" alt="NotesX" />
            <div className="dots">
              <span className="dot"></span><span className="dot active"></span><span className="dot"></span>
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

export default Login;