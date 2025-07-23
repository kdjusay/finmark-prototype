import React from 'react';
import { Navigate } from 'react-router-dom';

const UserRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return <Navigate to="/" />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" />;
  if (user.role === 'guest') return <Navigate to="/guest/products" />;
  if (user.role === 'hr') return <Navigate to="/hr/dashboard" />;
  // For executive/manager/finance, allow all dashboard navigation under /reports
  if (
    ['executive', 'manager', 'finance'].includes(user.role) &&
    !['/reports', '/products', '/checkout', '/track', '/feedback', '/settings'].some(path =>
      window.location.pathname.startsWith(path)
    )
  ) {
    // If they somehow hit a page outside their allowed set, redirect to /reports
    return <Navigate to="/reports" />;
  }
  // Otherwise, allow
  return children;
};

export default UserRoute;