import React from 'react';
import { Navigate } from 'react-router-dom';

const UserRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return <Navigate to="/" />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" />;
  
  return children;
};

export default UserRoute;
