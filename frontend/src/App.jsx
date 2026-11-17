// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile'; // <-- Import Profile
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>
      
      <Navbar /> 
      
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<h2 style={{ textAlign: 'center' }}>Home Page</h2>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* Private Routes (Only logged-in users can get past this point) */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;