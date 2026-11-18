// src/pages/AdminLogin.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import api from '../api';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Added error state to replace alert()
  const [errorMsg, setErrorMsg] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  // If already logged in as admin, send to dashboard
  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMsg(''); // Clear previous errors

    try {
      const { data } = await api.post('/api/users/login', { email, password });
      
      // Handle backends that return 200 OK but send an error inside the data object
      if (data.error || data.message === "Invalid credentials") {
        setErrorMsg(data.error || data.message);
        return; 
      }
      
      // ADMIN VALIDATION: Block normal users from using this login page
      if (!data.isAdmin) {
        setErrorMsg('Access Denied: You are not authorized as an Admin.');
        return; 
      }

      dispatch(setCredentials(data));
      navigate('/admin/dashboard', { replace: true });
    } catch (error) {
      console.error("Admin Login Error:", error.response?.data || error.message);
      
      const backendMessage = 
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Login failed. Please try again.';

      setErrorMsg(backendMessage);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h2>Admin Secure Portal</h2>
          <p>Restricted access. Please sign in to continue.</p>
        </div>
        
        {/* Error Message Box */}
        {errorMsg && (
          <div className="error-message">
            {errorMsg}
          </div>
        )}

        <form className="admin-login-form" onSubmit={submitHandler}>
          <div className="form-group">
            <label htmlFor="email">Admin Email</label>
            <input 
              id="email"
              type="email" 
              placeholder="Enter admin email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              placeholder="Enter password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="form-input"
            />
          </div>
          
          <button type="submit" className="btn-admin-submit">
            Authorize & Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;