// frontend/src/components/Navbar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin, loading } = useAuth();

  // ✅ Do NOT render navbar while auth is loading
  if (loading) return null;

  // ✅ Do NOT render navbar if user is not logged in
  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="nav-left">
        <span className="logo">📘 NotesX</span>
      </div>

      <div className="nav-links">
        {!isAdmin && (
          <>
            <NavLink to="/dashboard">Notes</NavLink>
            <NavLink to="/upload">Upload</NavLink>
            <NavLink to="/mine">My Notes</NavLink>
          </>
        )}

        {isAdmin && <NavLink to="/admin">Admin</NavLink>}
      </div>

      <div className="nav-right">
        <span className="user-chip">
          🎓 {user.name}
        </span>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
