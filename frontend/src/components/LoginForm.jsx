import React, { useState } from 'react';

const LoginForm = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate email
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }

    // Only submit if valid
    if (isValid) {
      onSubmit({ email, password });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={{ textAlign: 'center' }}>Login</h2>
      <div style={fieldGroupStyle}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        {/* Display email error */}
        {emailError && <p style={{ color: 'red', margin: '5px 0 0 0' }}>{emailError}</p>}
      </div>
      <div style={fieldGroupStyle}>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        {/* Display password error */}
        {passwordError && <p style={{ color: 'red', margin: '5px 0 0 0' }}>{passwordError}</p>}
      </div>
      <button type="submit" style={buttonStyle}>
        Login
      </button>
    </form>
  );
};

// Styles
const formStyle = {
  border: '1px solid #ddd',
  padding: '20px',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9',
  width: '300px',
  boxSizing: 'border-box',
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  marginTop: '5px',
  marginBottom: '10px',
  boxSizing: 'border-box',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  backgroundColor: '#4c91af',
  color: 'white',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '10px',
  width: '100%',
};

const fieldGroupStyle = {
  marginBottom: '10px',
};

export default LoginForm;