import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom'; // Fixed: Added Link to imports
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ChevronDown, 
  BookOpen, 
  UploadCloud, 
  Folder 
} from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin, loading } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading || !user) return null;

  return (
    <nav className="navbar">
      <div className="nav-left">
        {/* Interactive Logo */}
        <Link to="/dashboard" className="logo-container">
          <div className="logo-icon">
            <BookOpen size={24} className="main-icon" />
            <div className="icon-pulse"></div>
          </div>
          <span className="logo-text">
            Notes<span>X</span>
          </span>
        </Link>
      </div>

      <div className="nav-links">
        {!isAdmin && (
          <>
            <NavLink to="/dashboard"><BookOpen size={18} /> Notes</NavLink>
            <NavLink to="/upload"><UploadCloud size={18} /> Upload</NavLink>
            <NavLink to="/mine"><Folder size={18} /> My Notes</NavLink>
          </>
        )}
        {isAdmin && <NavLink to="/admin">Admin Control</NavLink>}
      </div>

      <div className="nav-right" ref={dropdownRef}>
        {/* User Profile Trigger */}
        <div 
          className={`user-profile-trigger ${showDropdown ? 'active' : ''}`} 
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="avatar-circle">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <ChevronDown size={16} className={`chevron ${showDropdown ? 'rotate' : ''}`} />
        </div>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="profile-dropdown">
            <div className="dropdown-header">
              <p className="user-name">{user.name}</p>
              <p className="user-email">{user.email || "student@notesx.com"}</p>
            </div>
            <hr />
            <div className="dropdown-menu">
              <button className="menu-item"><User size={18} /> Profile</button>
              <button className="menu-item"><Settings size={18} /> Settings</button>
              <button className="menu-item"><HelpCircle size={18} /> Help</button>
              <hr />
              <button className="menu-item logout-item" onClick={logout}>
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;