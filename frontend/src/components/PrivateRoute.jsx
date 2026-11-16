// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  // 1. Look inside Redux to see if a user is logged in
  const { userInfo } = useSelector((state) => state.auth);

  // 2. If they exist, render the protected page (<Outlet />). 
  // If they don't exist, navigate them to the login page.
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;