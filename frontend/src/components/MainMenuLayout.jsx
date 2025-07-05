import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../styles/MainMenuLayout.css';

const MainMenuLayout = () => {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-title">FinMark Corporation</div>
        <nav className="nav-links">
          <Link to="/products">🔍 View Products</Link>
          <Link to="/checkout">🛒 Checkout</Link>
          <Link to="/track">🚚 Track Orders</Link>
          <Link to="/feedback">💬 Feedback</Link>
          <Link to="/reports">📊 Reports</Link>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainMenuLayout;
