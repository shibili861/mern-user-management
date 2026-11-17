// src/pages/Login.jsx
import React, { useState, useEffect } from 'react'; // Added useEffect here
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Grab user state from Redux
  const { userInfo } = useSelector((state) => state.auth);

  // PREVENT BACK-BUTTON BUG
  useEffect(() => {
    if (userInfo) {
      if (userInfo.isAdmin) {
        navigate('/admin/dashboard', { replace: true }); 
      } else {
        navigate('/', { replace: true }); 
      }
    }
  }, [userInfo, navigate]);

 const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/users/login', { email, password });
      dispatch(setCredentials(data));
      
      // Check rank and navigate accordingly
      if (data.isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Login</h2>
      
      <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          placeholder="Enter Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Enter Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Login</button>
      </form>

      <p style={{ marginTop: '15px', fontSize: '14px' }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;