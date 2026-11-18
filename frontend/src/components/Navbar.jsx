// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import './Navbar.css'; // Make sure to create and import this CSS file

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout()); 
    navigate('/login'); 
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand-container">
        <Link to="/" className="navbar-brand">
          User System
        </Link>
      </div>

      <div>
        {userInfo ? (
          <div className="navbar-menu">
            <span className="navbar-greeting">
              Hello, <strong>{userInfo.name}</strong>
            </span>
            
            {userInfo.isAdmin && (
              <Link to="/admin/dashboard" className="nav-link admin-link">
                Dashboard
              </Link>
            )}
            
            <Link to="/profile" className="nav-link">Profile</Link>
            
            <button onClick={logoutHandler} className="btn-logout">
              Logout
            </button>
          </div>
        ) : (
          <div className="navbar-menu">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn-primary">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;