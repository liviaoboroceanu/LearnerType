// src/components/Header.js
import React, { useState } from 'react';
import './Header.css'; // Import the new CSS file

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    // The main header container
    <div className="header-container">
      {/* Arrow Icon - always visible on desktop, and part of the main header on mobile */}
      <svg className="header-icon" viewBox="0 0 448 512">
        <path d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"></path>
      </svg>

      {/* Desktop Navigation Links - hidden on mobile via CSS */}
      <div className="nav-links-desktop">
        <div className="nav-text">Home</div>
        <div className="nav-text">Features</div>
        <div className="nav-text">About Us</div>
        <div className="nav-text">Contact</div>
      </div>

      {/* Hamburger Icon for Mobile - shown only on mobile via CSS */}
      <div className="hamburger-icon" onClick={toggleSidebar}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      {/* Sidebar for Mobile Navigation */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button className="close-sidebar" onClick={toggleSidebar}>&times;</button>
        <div className="sidebar-nav-links">
          <div className="nav-text">Home</div>
          <div className="nav-text">Features</div>
          <div className="nav-text">About Us</div>
          <div className="nav-text">Contact</div>
        </div>
      </div>

      {/* Overlay that appears when sidebar is open */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </div>
  );
};

export default Header;