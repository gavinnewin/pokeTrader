import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import './MobileMenu.css';

export default function MobileMenu({ dark, setDark, profilePic, fullName }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mobile-menu-container">
      <button className="hamburger-button" onClick={toggleMenu} aria-label="Toggle menu">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-header">
            <img src={profilePic} alt="Profile" className="profile-pic" />
            <span className="username">{fullName}</span>
          </div>
          
          <div className="mobile-menu-nav">
            <NavLink to="/home" className="nav-link" onClick={toggleMenu}>Home</NavLink>
            <NavLink to="/search" className="nav-link" onClick={toggleMenu}>Search</NavLink>
            <NavLink to="/marketplace" className="nav-link" onClick={toggleMenu}>Marketplace</NavLink>
          </div>

          <div className="mobile-menu-footer">
            <button
              className="mode-toggle"
              onClick={() => setDark(d => !d)}
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun size={20} /> : <Moon size={20} />}
              <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 