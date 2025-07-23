import React from 'react';
import User2FAToggle from '../components/User2FAToggle';

const UserSettings = () => (
  <div style={{ maxWidth: 460, margin: '30px auto', padding: '0 10px' }}>
    <h1 style={{
      fontSize: '26px',
      color: '#4c91af',
      fontWeight: 'bold',
      marginBottom: '26px',
      letterSpacing: 1
    }}>
      🔒 Account Settings
    </h1>
    <User2FAToggle />
  </div>
);

export default UserSettings;