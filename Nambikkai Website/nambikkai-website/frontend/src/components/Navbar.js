import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus, FaShoppingCart, FaSignOutAlt, FaCog, FaUserShield } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container">
      <div className="nav-content">
          <div className="logo" onClick={() => navigate('/')}>
            <img src="/Images/nambikkai-logo" alt="Nambikkai Logo" />
            <p>Natural Products</p>
          </div>

          <div className="nav-right">
            <button onClick={() => navigate('/')} className="nav-link">
              Home
            </button>
            <div className={`nav-links ${isOpen ? 'active' : ''}`}>
              <button onClick={() => navigate('/products')} className="nav-link">
                Products
              </button>

              {user ? (
                <>
                  <button onClick={() => navigate('/cart')} className="nav-link">
                    <FaShoppingCart /> Cart
                  </button>

                  {user.role === 'admin' && (
                    <button onClick={() => navigate('/admin')} className="nav-link">
                      <FaCog /> Admin
                    </button>
                  )}

                  <div className="user-menu">
                    <span className="user-name">{user.name}</span>
                    <button onClick={onLogout} className="btn-logout">
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button onClick={() => navigate('/login')} className="nav-link">
                    <FaSignInAlt /> Login
                  </button>
                  <button onClick={() => navigate('/signup')} className="nav-link">
                    <FaUserPlus /> Signup
                  </button>
                  <button onClick={() => navigate('/admin/login')} className="nav-link admin-link">
                    <FaUserShield /> Admin
                  </button>
                </>
              )}
            </div>

            <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
