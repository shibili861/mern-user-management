// src/pages/AdminLogin.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import api from '../api';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    try {
      const { data } = await api.post('/api/users/login', { email, password });
      
      // ADMIN VALIDATION: Block normal users from using this login page
      if (!data.isAdmin) {
        alert('Access Denied: You are not authorized as an Admin.');
        return; // Stop the function here so they don't log in
      }

      dispatch(setCredentials(data));
      navigate('/admin/dashboard', { replace: true });
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '2px solid #f39c12', borderRadius: '8px' }}>
      <h2 style={{ color: '#f39c12', textAlign: 'center' }}>Admin Secure Portal</h2>
      
      <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <input 
          type="email" 
          placeholder="Admin Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '10px' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#f39c12', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
          Admin Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;