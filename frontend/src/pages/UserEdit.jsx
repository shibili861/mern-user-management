// src/pages/UserEdit.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api';

const UserEdit = () => {
  const { id: userId } = useParams(); // Grabs the ID from the URL
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');

  // 1. Fetch the user's current data when the page loads
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get(`/api/admin/users/${userId}`);
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching user data');
      }
    };
    fetchUser();
  }, [userId]);

  // 2. Submit the new data to the backend
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/admin/users/${userId}`, { name, email, isAdmin });
      // If successful, send the admin back to the dashboard
      navigate('/admin/dashboard'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating user');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', border: '1px solid #e5e7eb', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
      <Link to="/admin/dashboard" style={{ textDecoration: 'none', color: '#6b7280', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>
        ← Go Back
      </Link>
      
      <h2 style={{ color: '#111827', marginBottom: '20px' }}>Edit User</h2>
      
      {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '6px', marginBottom: '15px' }}>{error}</div>}
      
      <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#374151', fontWeight: '500' }}>Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#374151', fontWeight: '500' }}>Email Address</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
          <input 
            type="checkbox" 
            checked={isAdmin} 
            onChange={(e) => setIsAdmin(e.target.checked)} 
            style={{ width: '18px', height: '18px' }}
          />
          <label style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>Set as Admin User</label>
        </div>

        <button type="submit" style={{ marginTop: '15px', backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
          Update User
        </button>
      </form>
    </div>
  );
};

export default UserEdit;