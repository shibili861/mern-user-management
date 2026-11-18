// src/pages/Register.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api'; 
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // State for handling error messages cleanly in the UI
  const [errorMsg, setErrorMsg] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/', { replace: true }); 
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMsg(''); // Clear previous errors

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    try {
      const { data } = await api.post('/api/users', { name, email, password });
      
      if (data.error) {
        setErrorMsg(data.error);
        return;
      }

      dispatch(setCredentials(data));
      navigate('/', { replace: true });
    } catch (error) {
      console.error("Registration Error details:", error.response?.data || error.message);
      
      const backendMessage = 
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message || 
        'Registration failed. Please try again.';

      setErrorMsg(backendMessage);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <h2>Create an Account</h2>
          <p>Enter your details to get started.</p>
        </div>

        {errorMsg && (
          <div className="error-message">
            {errorMsg}
          </div>
        )}
        
        <form className="register-form" onSubmit={submitHandler}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input 
              id="name"
              type="text" 
              placeholder="Enter your name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="form-input"
            />
          </div>

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
              placeholder="Create a password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              id="confirmPassword"
              type="password" 
              placeholder="Confirm your password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              className="form-input"
            />
          </div>
          
          <button type="submit" className="btn-submit">
            Sign Up
          </button>
        </form>

        <p className="login-prompt">
          Already have an account? <Link to="/login" className="login-link">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;