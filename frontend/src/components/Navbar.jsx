// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Navbar = () => {
  // 1. Grab the userInfo from our Redux store
  const { userInfo } = useSelector((state) => state.auth);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 2. Function to handle logging out
  const logoutHandler = () => {
    dispatch(logout()); // This wipes the user data from Redux and localStorage
    navigate('/login'); // Send them back to the login page
  };

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      padding: '15px 30px', 
      backgroundColor: '#222', 
      color: 'white' 
    }}>
      <div>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
          User System
        </Link>
      </div>

      <div>
        {/* 3. Conditional Rendering: Show different links based on login status */}
        {userInfo ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span>Hello, {userInfo.name}</span>
            
            {/* NEW: If the logged-in user is an admin, show the Dashboard link */}
            {userInfo.isAdmin && (
              <Link to="/admin/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', color: '#f39c12' }}>
                Dashboard
              </Link>
            )}
            
            {/* Added Profile Link Here */}
            <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>Profile</Link>
            
            <button onClick={logoutHandler} style={{ padding: '5px 10px', cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;