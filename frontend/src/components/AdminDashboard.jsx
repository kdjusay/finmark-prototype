import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/users`)
      .then(res => res.json())
      .then(data => setUsers(data.users || []))
      .catch(err => console.error('User fetch failed:', err));
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(false);
    alert('Logged out!');
    window.location.href = '/';
  };

  const cancelLogout = () => setShowLogoutModal(false);

  const confirmDelete = (email) => {
    const confirm = window.confirm(`Delete user ${email}?`);
    if (confirm) {
      alert(`Deleted user ${email}`);
      // TODO: Implement actual DELETE request
    }
  };

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    `${u.profile?.firstName} ${u.profile?.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={dashboardContainer}>
      {/* Header */}
      <div style={headerBar}>
        <span style={companyTitle}>FinMark Corporation</span>
        <button onClick={() => setShowLogoutModal(true)} style={logoutBtn}>Logout</button>
      </div>

      {/* Content */}
      <div style={contentBox}>
        <h2 style={sectionTitle}>Admin Dashboard</h2>

        <div style={topBar}>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchInput}
          />
          <button style={createBtn} onClick={() => alert('Create user stub')}>+ Create New User</button>
        </div>

        <p style={tableTitle}>List of Registered Users:</p>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id}>
                <td style={tdStyle}>{u.email}</td>
                <td style={tdStyle}>{u.profile?.firstName} {u.profile?.lastName}</td>
                <td style={tdStyle}>{u.role}</td>
                <td style={tdStyle}>
                  <button style={actionBtn} onClick={() => alert(`Edit user ${u.email}`)}>Edit</button>
                  <button style={deleteBtn} onClick={() => confirmDelete(u.email)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3 style={{ marginTop: 0 }}>Logout Confirmation</h3>
            <p>Do you want to end your session?</p>
            <div style={modalActions}>
              <button onClick={handleLogout} style={confirmButton}>Yes</button>
              <button onClick={cancelLogout} style={cancelButton}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// === STYLES ===
const dashboardContainer = {
  fontFamily: 'sans-serif',
  backgroundColor: '#f9f9f9',
  minHeight: '100vh',
};

const headerBar = {
  backgroundColor: '#4c91af',
  padding: '15px 30px',
  color: '#fff',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const companyTitle = {
  fontSize: '20px',
  fontWeight: 'bold',
};

const logoutBtn = {
  backgroundColor: '#fff',
  color: '#4c91af',
  border: '1px solid #4c91af',
  borderRadius: '4px',
  padding: '6px 12px',
  cursor: 'pointer',
};

const contentBox = {
  padding: '40px 60px',
};

const sectionTitle = {
  marginBottom: '25px',
  fontSize: '24px',
  fontWeight: 'bold',
};

const tableTitle = {
  fontWeight: 'bold',
  marginBottom: '15px',
  marginTop: '10px',
};

const topBar = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '20px',
  marginBottom: '25px',
};

const searchInput = {
  flex: 1,
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '14px',
};

const createBtn = {
  backgroundColor: '#4c91af',
  color: 'white',
  border: 'none',
  padding: '10px 16px',
  borderRadius: '4px',
  fontSize: '14px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: '#fff',
  border: '1px solid #e0e0e0',
};

const thStyle = {
  textAlign: 'left',
  padding: '12px',
  backgroundColor: '#f2f2f2',
  borderBottom: '1px solid #ddd',
};

const tdStyle = {
  padding: '12px',
  borderBottom: '1px solid #eee',
  verticalAlign: 'top',
};

const actionBtn = {
  marginRight: '10px',
  backgroundColor: '#f0ad4e',
  border: 'none',
  color: 'white',
  padding: '6px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
};

const deleteBtn = {
  backgroundColor: '#d9534f',
  border: 'none',
  color: 'white',
  padding: '6px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
};

// Modal styles
const modalOverlay = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const modalBox = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  width: '300px',
};

const modalActions = {
  marginTop: '20px',
  display: 'flex',
  justifyContent: 'flex-end',
};

const confirmButton = {
  backgroundColor: '#4c91af',
  color: 'white',
  padding: '8px 12px',
  border: 'none',
  borderRadius: '4px',
  marginRight: '10px',
  cursor: 'pointer',
};

const cancelButton = {
  backgroundColor: '#ccc',
  color: 'black',
  padding: '8px 12px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default AdminDashboard;