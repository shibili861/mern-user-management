// src/pages/Register.jsx
import React, { useState, useEffect } from 'react'; // Added useEffect here
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api'; 

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Grab user state from Redux
  const { userInfo } = useSelector((state) => state.auth);

  // PREVENT BACK-BUTTON BUG
  useEffect(() => {
    if (userInfo) {
      navigate('/', { replace: true }); 
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const { data } = await api.post('/api/users', { name, email, password });
      dispatch(setCredentials(data));
      navigate('/', { replace: true });
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Register</h2>
      
      <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="Enter Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
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
        <input 
          type="password" 
          placeholder="Confirm Password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          required 
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Register;