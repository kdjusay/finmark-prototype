import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'user'
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('User fetch failed:', err);
      showMessage('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    alert('Logged out!');
    window.location.href = '/';
  };

  const cancelLogout = () => setShowLogoutModal(false);

  const confirmDelete = async (user) => {
    const confirm = window.confirm(`Delete user ${user.email}?`);
    if (confirm) {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${user.id}`, {
          method: 'DELETE'
        });
        const data = await res.json();
        
        if (data.success) {
          showMessage('User deleted successfully', 'success');
          fetchUsers();
        } else {
          showMessage(data.message || 'Failed to delete user', 'error');
        }
      } catch (err) {
        console.error('Delete user failed:', err);
        showMessage('Failed to delete user', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      
      if (data.success) {
        showMessage('User created successfully', 'success');
        setShowCreateModal(false);
        setNewUser({ email: '', password: '', firstName: '', lastName: '', phone: '', role: 'user' });
        fetchUsers();
      } else {
        showMessage(data.message || 'Failed to create user', 'error');
      }
    } catch (err) {
      console.error('Create user failed:', err);
      showMessage('Failed to create user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: editingUser.email,
          firstName: editingUser.profile.firstName,
          lastName: editingUser.profile.lastName,
          phone: editingUser.profile.phone,
          role: editingUser.role,
          ...(editingUser.password && { password: editingUser.password })
        })
      });
      const data = await res.json();
      
      if (data.success) {
        showMessage('User updated successfully', 'success');
        setShowEditModal(false);
        setEditingUser(null);
        fetchUsers();
      } else {
        showMessage(data.message || 'Failed to update user', 'error');
      }
    } catch (err) {
      console.error('Update user failed:', err);
      showMessage('Failed to update user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user) => {
    setEditingUser({ ...user, password: '' });
    setShowEditModal(true);
  };

  const handleSearch = async (searchTerm) => {
    setSearch(searchTerm);
    if (!searchTerm.trim()) {
      fetchUsers();
      return;
    }
    
    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Search failed:', err);
      showMessage('Search failed', 'error');
    } finally {
      setLoading(false);
    }
  };

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
            onChange={(e) => handleSearch(e.target.value)}
            style={searchInput}
          />
          <button style={createBtn} onClick={() => setShowCreateModal(true)} disabled={loading}>
            + Create New User
          </button>
        </div>

        {message && (
          <div style={{
            ...messageStyle,
            backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
            color: messageType === 'success' ? '#155724' : '#721c24',
            borderColor: messageType === 'success' ? '#c3e6cb' : '#f5c6cb'
          }}>
            {message}
          </div>
        )}

        <p style={tableTitle}>List of Registered Users:</p>

        {loading && <div style={loadingStyle}>Loading...</div>}
        
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={tdStyle}>{u.email}</td>
                <td style={tdStyle}>{u.profile?.firstName} {u.profile?.lastName}</td>
                <td style={tdStyle}>
                  <span style={{
                    ...roleStyle,
                    backgroundColor: u.role === 'admin' ? '#007bff' : u.role === 'demo' ? '#ffc107' : '#28a745'
                  }}>
                    {u.role}
                  </span>
                </td>
                <td style={tdStyle}>{u.profile?.phone || '-'}</td>
                <td style={tdStyle}>
                  <button style={actionBtn} onClick={() => openEditModal(u)} disabled={loading}>
                    Edit
                  </button>
                  <button 
                    style={{
                      ...deleteBtn,
                      opacity: u.role === 'admin' ? 0.5 : 1,
                      cursor: u.role === 'admin' ? 'not-allowed' : 'pointer'
                    }} 
                    onClick={() => confirmDelete(u)} 
                    disabled={loading || u.role === 'admin'}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && !loading && (
              <tr>
                <td colSpan="5" style={{ ...tdStyle, textAlign: 'center', fontStyle: 'italic' }}>
                  {search ? 'No users found matching your search.' : 'No users found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div style={modalOverlay}>
          <div style={largeModalBox}>
            <h3 style={{ marginTop: 0 }}>Create New User</h3>
            <form onSubmit={handleCreateUser}>
              <div style={formRow}>
                <div style={formGroup}>
                  <label>Email *</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    style={inputStyle}
                    required
                  />
                </div>
                <div style={formGroup}>
                  <label>Password *</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    style={inputStyle}
                    placeholder="Min 8 chars, uppercase, lowercase, number, special char"
                    required
                  />
                </div>
              </div>
              <div style={formRow}>
                <div style={formGroup}>
                  <label>First Name *</label>
                  <input
                    type="text"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                    style={inputStyle}
                    required
                  />
                </div>
                <div style={formGroup}>
                  <label>Last Name *</label>
                  <input
                    type="text"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>
              <div style={formRow}>
                <div style={formGroup}>
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                    style={inputStyle}
                  />
                </div>
                <div style={formGroup}>
                  <label>Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    style={inputStyle}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="demo">Demo</option>
                  </select>
                </div>
              </div>
              <div style={modalActions}>
                <button type="submit" style={confirmButton} disabled={loading}>
                  {loading ? 'Creating...' : 'Create User'}
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)} style={cancelButton} disabled={loading}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div style={modalOverlay}>
          <div style={largeModalBox}>
            <h3 style={{ marginTop: 0 }}>Edit User</h3>
            <form onSubmit={handleEditUser}>
              <div style={formRow}>
                <div style={formGroup}>
                  <label>Email *</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                    style={inputStyle}
                    required
                  />
                </div>
                <div style={formGroup}>
                  <label>New Password (leave blank to keep current)</label>
                  <input
                    type="password"
                    value={editingUser.password}
                    onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                    style={inputStyle}
                    placeholder="Min 8 chars, uppercase, lowercase, number, special char"
                  />
                </div>
              </div>
              <div style={formRow}>
                <div style={formGroup}>
                  <label>First Name *</label>
                  <input
                    type="text"
                    value={editingUser.profile?.firstName || ''}
                    onChange={(e) => setEditingUser({
                      ...editingUser, 
                      profile: {...editingUser.profile, firstName: e.target.value}
                    })}
                    style={inputStyle}
                    required
                  />
                </div>
                <div style={formGroup}>
                  <label>Last Name *</label>
                  <input
                    type="text"
                    value={editingUser.profile?.lastName || ''}
                    onChange={(e) => setEditingUser({
                      ...editingUser, 
                      profile: {...editingUser.profile, lastName: e.target.value}
                    })}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>
              <div style={formRow}>
                <div style={formGroup}>
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={editingUser.profile?.phone || ''}
                    onChange={(e) => setEditingUser({
                      ...editingUser, 
                      profile: {...editingUser.profile, phone: e.target.value}
                    })}
                    style={inputStyle}
                  />
                </div>
                <div style={formGroup}>
                  <label>Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                    style={inputStyle}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="demo">Demo</option>
                  </select>
                </div>
              </div>
              <div style={modalActions}>
                <button type="submit" style={confirmButton} disabled={loading}>
                  {loading ? 'Updating...' : 'Update User'}
                </button>
                <button type="button" onClick={() => setShowEditModal(false)} style={cancelButton} disabled={loading}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

const messageStyle = {
  padding: '10px 15px',
  borderRadius: '4px',
  border: '1px solid',
  marginBottom: '15px',
  fontSize: '14px',
};

const loadingStyle = {
  textAlign: 'center',
  padding: '20px',
  fontSize: '16px',
  color: '#666',
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

const roleStyle = {
  padding: '4px 8px',
  borderRadius: '12px',
  color: 'white',
  fontSize: '12px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
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
  zIndex: 1000,
};

const modalBox = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  width: '300px',
};

const largeModalBox = {
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '8px',
  width: '600px',
  maxHeight: '80vh',
  overflowY: 'auto',
};

const formRow = {
  display: 'flex',
  gap: '20px',
  marginBottom: '20px',
};

const formGroup = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
};

const inputStyle = {
  padding: '8px 12px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '14px',
  marginTop: '5px',
};

const modalActions = {
  marginTop: '20px',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
};

const confirmButton = {
  backgroundColor: '#4c91af',
  color: 'white',
  padding: '8px 16px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const cancelButton = {
  backgroundColor: '#6c757d',
  color: 'white',
  padding: '8px 16px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default AdminDashboard;