// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api'; 
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // THIS LINE WAS MISSING: It creates the errorMsg state and setErrorMsg function
  const [errorMsg, setErrorMsg] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

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
    
    // Clear previous errors
    setErrorMsg('');

    try {
      const { data } = await api.post('/api/users/login', { email, password });
      
      // Handle backends that return 200 OK but send an error inside the data object
      if (data.error || data.message === "Invalid credentials") {
         setErrorMsg(data.error || data.message);
         return; 
      }

      dispatch(setCredentials(data));
      
      if (data.isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error("Login Error details:", error.response?.data || error.message);

      // Check multiple common places where backends hide their error messages
      const backendMessage = 
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message || 
        'Invalid email or password. Please try again.';

      setErrorMsg(backendMessage);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Please enter your details to sign in.</p>
        </div>
        
        {/* Displays the error message if one exists */}
        {errorMsg && (
          <div className="error-message">
            {errorMsg}
          </div>
        )}
        
        <form className="login-form" onSubmit={submitHandler}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              placeholder="Enter your email" 
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
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="form-input"
            />
          </div>
          
          <button type="submit" className="btn-submit">
            Sign In
          </button>
        </form>

        <p className="register-prompt">
          Don't have an account? <Link to="/register" className="register-link">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;