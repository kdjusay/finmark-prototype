import React, { useEffect, useState } from 'react';

const modalOverlay = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center',
  alignItems: 'center', zIndex: 999,
};
const modalBox = {
  backgroundColor: '#fff', padding: '30px', borderRadius: '10px',
  textAlign: 'center', width: '320px', boxShadow: '0 8px 24px rgba(0,0,0,0.18)'
};
const modalButton = {
  backgroundColor: '#4c91af', color: 'white', padding: '8px 20px',
  border: 'none', borderRadius: '4px', cursor: 'pointer', margin: '10px'
};

const User2FAToggle = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState('');
  const [pendingValue, setPendingValue] = useState(null); // true/false
  const [message, setMessage] = useState('');

  // Fetch user from localStorage and backend
  const fetchUser = async () => {
    let localUser = null;
    try {
      localUser = JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      localUser = null;
    }
    if (!localUser || !localUser.id) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${localUser.id}`);
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify({ ...localUser, is_2fa_enabled: data.user.is_2fa_enabled }));
      }
    } catch {
      setUser(localUser); // fallback
    }
  };

  useEffect(() => {
    fetchUser();
    // (Optional: listen for localStorage change for multi-tab)
    const handler = () => fetchUser();
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const is2FAEnabled = !!(user && user.is_2fa_enabled);

  const handleToggle = (toEnable) => {
    setPendingValue(toEnable);
    setModalText(toEnable
      ? 'Are you sure you want to ENABLE Two-Factor Authentication (2FA)?\nA code will be required every login.'
      : 'Are you sure you want to DISABLE Two-Factor Authentication (2FA)?\nLogin will not require a code.');
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/${user.id}/2fa`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enable2FA: pendingValue })
        }
      );
      const data = await res.json();
      if (data.success) {
        setMessage(`2FA ${pendingValue ? 'enabled' : 'disabled'} successfully.`);
        setShowModal(false);
        setPendingValue(null);
        await fetchUser(); // Always refetch after update
      } else {
        setMessage(data.message || 'Error updating 2FA setting.');
      }
    } catch (err) {
      setMessage('Network/server error while updating 2FA.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(''), 2500);
      return () => clearTimeout(t);
    }
  }, [message]);

  if (!user) return null; // or loading indicator

  return (
    <div style={{
      background: '#fff', borderRadius: '10px', padding: '34px 22px', maxWidth: '390px', margin: '0 auto', boxShadow: '0 2px 12px rgba(60,120,200,0.08)'
    }}>
      <h2 style={{ color: '#2d6b88', fontWeight: 'bold', marginBottom: '18px' }}>Account Security</h2>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px'
      }}>
        <span style={{ fontSize: '17px', color: '#222' }}>Two-Factor Authentication (2FA):</span>
        <span style={{
          color: is2FAEnabled ? '#1cbb43' : '#d32f2f',
          fontWeight: 'bold',
          fontSize: '15px'
        }}>{is2FAEnabled ? 'ENABLED' : 'DISABLED'}</span>
      </div>
      <button
        style={{
          ...modalButton,
          backgroundColor: is2FAEnabled ? '#d32f2f' : '#1cbb43',
          color: '#fff',
          marginTop: '12px'
        }}
        disabled={loading}
        onClick={() => handleToggle(!is2FAEnabled)}
      >
        {is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
      </button>
      {message && (
        <div style={{
          color: message.includes('success') ? '#218838' : '#c0392b',
          background: message.includes('success') ? '#d4edda' : '#f8d7da',
          padding: '8px', borderRadius: '5px', marginTop: '20px'
        }}>
          {message}
        </div>
      )}
      {/* Confirmation Modal */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <div style={{ fontSize: '34px', marginBottom: 18 }}>{pendingValue ? '🔒' : '⚠️'}</div>
            <div style={{ fontSize: '17px', marginBottom: 24, whiteSpace: 'pre-line' }}>
              {modalText}
            </div>
            <button onClick={handleConfirm} style={{ ...modalButton, backgroundColor: '#4c91af' }} disabled={loading}>
              {loading ? 'Updating...' : 'Yes, Confirm'}
            </button>
            <button onClick={() => setShowModal(false)} style={modalButton} disabled={loading}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default User2FAToggle;