import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import '../styles/MainMenuLayout.css';

const navs = [
  { to: '/reports', label: '📊 Reports' },
  { to: '/products', label: '🔍 View Products' },
  { to: '/checkout', label: '🛒 Checkout' },
  { to: '/track', label: '🚚 Track Orders' },
  { to: '/feedback', label: '💬 Feedback' },
  { to: '/settings', label: '🔒 Account Settings' },
];

const ManagerDashboard = () => {
  const location = useLocation();
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-title">Finmark Corporation</div>
        <nav className="nav-links">
          {navs.map(nav => (
            <Link
              key={nav.to}
              to={nav.to}
              className={location.pathname === nav.to ? 'active' : ''}
            >
              {nav.label}
            </Link>
          ))}
        </nav>
        <button className="logout-btn" onClick={() => { localStorage.clear(); window.location = "/"; }}>
          Logout
        </button>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default ManagerDashboard;