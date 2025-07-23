import React, { useState, useEffect } from 'react';
import ViewProducts from './ViewProducts';
import Checkout from './Checkout';
import TrackOrders from './TrackOrders';
import Feedback from './Feedback';
import UserSettings from './UserSettings';
import '../styles/MainMenuLayout.css';

// Color scheme for badges (update: NO "demo")
const badgeColors = {
  admin: { bg: '#2386eb', text: '#fff' },
  hr: { bg: '#e84393', text: '#fff' },
  guest: { bg: '#636e72', text: '#fff' },
  employee: { bg: '#00b894', text: '#fff' },
  finance: { bg: '#00b894', text: '#fff' },
  manager: { bg: '#00b894', text: '#fff' },
  executive: { bg: '#00b894', text: '#fff' }
};

const HRDashboard = () => {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'guest'
  });

  // --- FETCH USERS ---
  useEffect(() => {
    if (tab !== 'users') return;
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/api/users`)
      .then(res => res.json())
      .then(data => {
        setUsers((data.users || []).map(u => ({
          id: u.id,
          email: u.email,
          firstName: u.first_name || '',
          lastName: u.last_name || '',
          phone: u.phone || '',
          role: u.role
        })));
        setLoading(false);
      })
      .catch(() => {
        showMessage('Failed to fetch users', 'error');
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [tab]); // Only runs when tab changes

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const reloadUsers = () => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/api/users`)
      .then(res => res.json())
      .then(data => {
        setUsers((data.users || []).map(u => ({
          id: u.id,
          email: u.email,
          firstName: u.first_name || '',
          lastName: u.last_name || '',
          phone: u.phone || '',
          role: u.role
        })));
        setLoading(false);
      })
      .catch(() => {
        showMessage('Failed to fetch users', 'error');
        setLoading(false);
      });
  };

  const confirmDelete = async (user) => {
    if (window.confirm(`Delete user ${user.email}?`)) {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${user.id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          showMessage('User deleted successfully', 'success');
          reloadUsers();
        } else {
          showMessage(data.message || 'Failed to delete user', 'error');
        }
      } catch {
        showMessage('Failed to delete user', 'error');
      }
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      if (data.success) {
        showMessage('User created successfully', 'success');
        setShowCreateModal(false);
        setNewUser({ email: '', password: '', firstName: '', lastName: '', phone: '', role: 'guest' });
        reloadUsers();
      } else {
        showMessage(data.message || 'Failed to create user', 'error');
      }
    } catch {
      showMessage('Failed to create user', 'error');
    }
    setLoading(false);
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = {
        email: editingUser.email,
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        phone: editingUser.phone,
        role: editingUser.role
      };
      if (editingUser.password) body.password = editingUser.password;
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        showMessage('User updated successfully', 'success');
        setShowEditModal(false);
        setEditingUser(null);
        reloadUsers();
      } else {
        showMessage(data.message || 'Failed to update user', 'error');
      }
    } catch {
      showMessage('Failed to update user', 'error');
    }
    setLoading(false);
  };

  const openEditModal = (user) => {
    setEditingUser({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      password: ''
    });
    setShowEditModal(true);
  };

  // --- RENDER ---
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-title">FinMark HR</div>
        <nav className="nav-links">
          <button className={`sidebar-btn${tab === 'users' ? ' active' : ''}`} onClick={() => setTab('users')}>👥 Manage Users</button>
          <button className={`sidebar-btn${tab === 'products' ? ' active' : ''}`} onClick={() => setTab('products')}>🔍 View Products</button>
          <button className={`sidebar-btn${tab === 'checkout' ? ' active' : ''}`} onClick={() => setTab('checkout')}>🛒 Checkout</button>
          <button className={`sidebar-btn${tab === 'track' ? ' active' : ''}`} onClick={() => setTab('track')}>🚚 Track Orders</button>
          <button className={`sidebar-btn${tab === 'feedback' ? ' active' : ''}`} onClick={() => setTab('feedback')}>💬 Feedback</button>
          <button className={`sidebar-btn${tab === 'settings' ? ' active' : ''}`} onClick={() => setTab('settings')}>🔒 Account Settings</button>
        </nav>
        <button className="logout-btn" onClick={() => { localStorage.clear(); window.location = "/"; }}>Logout</button>
      </aside>
      <main className="main-content">
        {tab === 'users' && (
          <div className="admin-content-card" style={{
            background: '#fff',
            borderRadius: '10px',
            padding: '34px 32px 28px 32px',
            boxShadow: '0 6px 32px rgba(60,120,200,0.06)'
          }}>
            <h2 style={{ marginTop: 0, marginBottom: 22 }}>User Management (HR)</h2>
            {message && (
              <div style={{
                padding: '10px 15px',
                borderRadius: '4px',
                border: '1px solid',
                marginBottom: '15px',
                fontSize: '14px',
                backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
                color: messageType === 'success' ? '#155724' : '#721c24',
                borderColor: messageType === 'success' ? '#c3e6cb' : '#f5c6cb'
              }}>
                {message}
              </div>
            )}
            <button
              style={{
                background: '#4c91af',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                fontWeight: 'bold',
                fontSize: '15px',
                padding: '8px 18px',
                marginBottom: 15,
                cursor: 'pointer',
                float: 'right'
              }}
              onClick={() => setShowCreateModal(true)}
              disabled={loading}
            >
              + Create New User
            </button>
            <div style={{ clear: 'both' }} />
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: 0,
                background: '#fff',
                boxShadow: '0 2px 6px rgba(80,140,200,0.02)',
                marginTop: '12px',
                borderRadius: '7px',
                overflow: 'hidden'
              }}>
                <thead>
                  <tr style={{ background: '#f2f2f2' }}>
                    <th style={{ padding: '13px 14px', textAlign: 'left' }}>Email</th>
                    <th style={{ padding: '13px 14px', textAlign: 'left' }}>Name</th>
                    <th style={{ padding: '13px 14px', textAlign: 'left' }}>Role</th>
                    <th style={{ padding: '13px 14px', textAlign: 'left' }}>Phone</th>
                    <th style={{ padding: '13px 14px', textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid #f1f1f1' }}>{u.email}</td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid #f1f1f1' }}>{u.firstName} {u.lastName}</td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid #f1f1f1' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 13px',
                          borderRadius: '14px',
                          fontWeight: 'bold',
                          fontSize: '13px',
                          textTransform: 'uppercase',
                          letterSpacing: '.5px',
                          background: badgeColors[u.role]?.bg || '#636e72',
                          color: badgeColors[u.role]?.text || '#fff'
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid #f1f1f1' }}>{u.phone || '-'}</td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid #f1f1f1' }}>
                        <button
                          style={{
                            background: '#f0ad4e',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            padding: '7px 18px',
                            marginRight: 9,
                            cursor: 'pointer',
                            opacity: loading ? 0.7 : 1
                          }}
                          onClick={() => openEditModal(u)}
                          disabled={loading}
                        >Edit</button>
                        <button
                          style={{
                            background: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            padding: '7px 18px',
                            cursor: u.role === 'admin' ? 'not-allowed' : 'pointer',
                            opacity: u.role === 'admin' ? 0.4 : 1
                          }}
                          onClick={() => confirmDelete(u)}
                          disabled={loading || u.role === 'admin'}
                        >Delete</button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && !loading && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', fontStyle: 'italic', padding: '20px 0' }}>
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* CREATE USER MODAL */}
            {showCreateModal && (
              <div className="modal-overlay" style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.32)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1002
              }}>
                <div className="modal-box" style={{
                  width: 440, background: '#fff', borderRadius: '10px',
                  boxShadow: '0 12px 44px rgba(52,90,140,0.18)', padding: '34px 26px'
                }}>
                  <h3 style={{ margin: 0, marginBottom: 18 }}>Create New User</h3>
                  <form onSubmit={handleCreateUser}>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <div style={{ flex: 1 }}>
                        <label>Email*</label>
                        <input type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required style={inputFieldStyle} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label>Password*</label>
                        <input type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required style={inputFieldStyle} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                      <div style={{ flex: 1 }}>
                        <label>First Name*</label>
                        <input type="text" value={newUser.firstName} onChange={e => setNewUser({ ...newUser, firstName: e.target.value })} required style={inputFieldStyle} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label>Last Name*</label>
                        <input type="text" value={newUser.lastName} onChange={e => setNewUser({ ...newUser, lastName: e.target.value })} required style={inputFieldStyle} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                      <div style={{ flex: 1 }}>
                        <label>Phone</label>
                        <input type="tel" value={newUser.phone} onChange={e => setNewUser({ ...newUser, phone: e.target.value })} style={inputFieldStyle} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label>Role</label>
                        <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} style={inputFieldStyle}>
                          <option value="guest">Guest</option>
                          <option value="employee">Employee</option>
                          <option value="hr">HR</option>
                          <option value="finance">Finance</option>
                          <option value="manager">Manager</option>
                          <option value="executive">Executive</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ marginTop: 22, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                      <button type="submit" disabled={loading} style={confirmBtnStyle}>{loading ? 'Creating...' : 'Create'}</button>
                      <button type="button" onClick={() => setShowCreateModal(false)} style={cancelBtnStyle}>Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* EDIT USER MODAL */}
            {showEditModal && editingUser && (
              <div className="modal-overlay" style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.32)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1002
              }}>
                <div className="modal-box" style={{
                  width: 440, background: '#fff', borderRadius: '10px',
                  boxShadow: '0 12px 44px rgba(52,90,140,0.18)', padding: '34px 26px'
                }}>
                  <h3 style={{ margin: 0, marginBottom: 18 }}>Edit User</h3>
                  <form onSubmit={handleEditUser}>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <div style={{ flex: 1 }}>
                        <label>Email*</label>
                        <input type="email" value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} required style={inputFieldStyle} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label>New Password</label>
                        <input type="password" value={editingUser.password} onChange={e => setEditingUser({ ...editingUser, password: e.target.value })} placeholder="(leave blank to keep current)" style={inputFieldStyle} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                      <div style={{ flex: 1 }}>
                        <label>First Name*</label>
                        <input type="text" value={editingUser.firstName} onChange={e => setEditingUser({ ...editingUser, firstName: e.target.value })} required style={inputFieldStyle} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label>Last Name*</label>
                        <input type="text" value={editingUser.lastName} onChange={e => setEditingUser({ ...editingUser, lastName: e.target.value })} required style={inputFieldStyle} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                      <div style={{ flex: 1 }}>
                        <label>Phone</label>
                        <input type="tel" value={editingUser.phone} onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })} style={inputFieldStyle} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label>Role</label>
                        <select value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })} style={inputFieldStyle}>
                          <option value="guest">Guest</option>
                          <option value="employee">Employee</option>
                          <option value="hr">HR</option>
                          <option value="finance">Finance</option>
                          <option value="manager">Manager</option>
                          <option value="executive">Executive</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ marginTop: 22, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                      <button type="submit" disabled={loading} style={confirmBtnStyle}>{loading ? 'Updating...' : 'Update'}</button>
                      <button type="button" onClick={() => setShowEditModal(false)} style={cancelBtnStyle}>Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
        {tab === 'products' && <ViewProducts />}
        {tab === 'checkout' && <Checkout />}
        {tab === 'track' && <TrackOrders />}
        {tab === 'feedback' && <Feedback />}
        {tab === 'settings' && <UserSettings />}
      </main>
    </div>
  );
};

const inputFieldStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: '4px',
  border: '1px solid #e0e0e0',
  fontSize: '15px',
  marginTop: 5,
  marginBottom: 2
};

const confirmBtnStyle = {
  background: '#4c91af',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  fontWeight: 'bold',
  fontSize: '15px',
  padding: '8px 20px',
  cursor: 'pointer'
};
const cancelBtnStyle = {
  background: '#888',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  fontWeight: 'bold',
  fontSize: '15px',
  padding: '8px 20px',
  cursor: 'pointer'
};

export default HRDashboard;