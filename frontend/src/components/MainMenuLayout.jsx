import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../styles/MainMenuLayout.css';

const MainMenuLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optional: Clear any local storage or session here
    navigate('/');
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-title">Finmark Corporation</div>
        <nav className="nav-links">
          <Link to="/products">🔍 View Products</Link>
          <Link to="/checkout">🛒 Checkout</Link>
          <Link to="/track">🚚 Track Orders</Link>
          <Link to="/feedback">💬 Feedback</Link>
          <Link to="/reports">📊 Reports</Link>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainMenuLayout;
