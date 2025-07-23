import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import '../styles/MainMenuLayout.css';

const GuestDashboard = () => (
  <div className="dashboard-layout">
    <aside className="sidebar">
      <div className="sidebar-title">FinMark Corporation</div>
      <nav className="nav-links">
        <Link to="/guest/products">🔍 View Products</Link>
        <Link to="/guest/checkout">🛒 Checkout</Link>
        <Link to="/guest/track">🚚 Track Orders</Link>
        <Link to="/guest/feedback">💬 Feedback</Link>
        {/* Reports is intentionally hidden for Guest */}
        <Link to="/guest/settings">🔒 Account Settings</Link>
      </nav>
      <button className="logout-btn" onClick={() => { localStorage.clear(); window.location = "/"; }}>Logout</button>
    </aside>
    <main className="main-content">
      <Outlet />
    </main>
  </div>
);

export default GuestDashboard;