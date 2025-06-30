import React, { useState } from 'react';
import '../styles/TrackOrders.css';

const mockOrders = [
  { id: 'ORD001', status: 'Delivered', date: '2025-06-25' },
  { id: 'ORD002', status: 'In Transit', date: '2025-06-26' },
  { id: 'ORD003', status: 'Processing', date: '2025-06-27' },
];

const TrackOrders = () => {
  const [search, setSearch] = useState('');
  const filtered = mockOrders.filter(o => o.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="track-page">
      <div className="track-header">
        <h2>🚚 Track Orders</h2>
        <button className="logout-btn">Logout</button>
      </div>

      <div className="track-container">
        <input
          type="text"
          placeholder="Enter Order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="track-search"
        />

        <div className="track-list">
          {filtered.length > 0 ? filtered.map(order => (
            <div className="track-card" key={order.id}>
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Date:</strong> {order.date}</p>
            </div>
          )) : <p className="no-results">No orders found.</p>}
        </div>
      </div>
    </div>
  );
};

export default TrackOrders;
