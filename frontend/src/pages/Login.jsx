// src/pages/Login.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '../store/authSlice';
import api from '../api'; 
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Grab user state from Redux
  const { userInfo } = useSelector((state) => state.auth);

  // PREVENT BACK-BUTTON BUG: If user is already logged in, force them away from this page
  useEffect(() => {
    if (userInfo) {
      navigate('/', { replace: true }); 
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/users/login', { email, password });
      dispatch(setCredentials(data));
      
      // Navigate to home and REPLACE the history so they can't click "Back" to return here
      navigate('/', { replace: true });
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Login</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      
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