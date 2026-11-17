// src/App.jsx
import React from 'react';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile'; // <-- Import Profile
import AdminLogin from"./pages/AdminLogin";
import PrivateRoute from './components/PrivateRoute';
import UserEdit from "./pages/UserEdit";
import UserAdd from './pages/UserAdd';

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>
      
      <Navbar /> 
      
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<h2 style={{ textAlign: 'center' }}>Home Page</h2>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          {/* Private Routes (Only logged-in users can get past this point) */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Protected Admin Routes */}
<Route element={<AdminRoute />}>
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
  <Route path="/admin/user/:id/edit" element={<UserEdit />} />
  <Route path="/admin/user/add" element={<UserAdd />} />
</Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;