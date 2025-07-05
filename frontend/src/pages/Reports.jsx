import React from 'react';
import '../styles/Reports.css';

const Reports = () => {
  return (
    <div className="reports-page">
      <div className="reports-header">
        <h2>📊 Reports Summary</h2>
        <button className="logout-btn">Logout</button>
      </div>

      <div className="reports-container">
        <div className="metric-grid">
          <div className="metric-card">
            <h4>Total Orders</h4>
            <div className="value">200</div>
          </div>
          <div className="metric-card">
            <h4>Total Revenue</h4>
            <div className="value">₱32,000</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
