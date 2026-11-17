
import { Link } from 'react-router-dom';

import React, { useEffect, useState } from 'react';
import api from '../api'; 
import './AdminDashboard.css'; // Import the new premium stylesheet

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/api/admin/users');
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteHandler = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await api.delete(`/api/admin/users/${id}`);
        fetchUsers(); 
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="admin-container">
      <div className="admin-header-section">
        <h2 className="admin-title">User Management</h2>
        
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="admin-search-input"
        />

        {/* NEW: Add User Button */}
        <Link 
          to="/admin/user/add" 
          style={{ backgroundColor: '#10b981', color: 'white', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: '500' }}
        >
          + Add User
        </Link>
      </div>
      
      {error && <div className="admin-error">{error}</div>}

      <div className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <img 
                      src={user.profileImage || 'https://via.placeholder.com/40'} 
                      alt={user.name} 
                      className="admin-avatar" 
                    />
                  </td>
                  <td style={{ fontWeight: '500' }}>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.isAdmin ? 'role-admin' : 'role-user'}`}>
                      {user.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/admin/user/${user._id}/edit`} className="btn-edit">
                        Edit
                      </Link>
                      <button 
                        onClick={() => deleteHandler(user._id, user.name)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                  No users found matching "{searchQuery}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;