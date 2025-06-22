import React, { useState } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasMinLength && hasUpper && hasNumber && hasSpecial;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let isValid = true;

    // Email validation
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 chars, contain uppercase, number, and special character');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!isValid) return;

    // API Call
    fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Login successful!');
          // window.location.href = '/dashboard'; // Future
        } else {
          alert(`Login failed: ${data.message}`);
        }
      })
      .catch(error => {
        console.error('Login error:', error);
        alert('An error occurred during login.');
      });
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
          style={{ ...inputStyle, borderColor: emailError ? 'red' : '#ccc' }}
        />
        {emailError && <p style={errorStyle}>{emailError}</p>}
      </div>

      <div style={fieldGroupStyle}>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ ...inputStyle, borderColor: passwordError ? 'red' : '#ccc' }}
        />
        {passwordError && <p style={errorStyle}>{passwordError}</p>}
      </div>

      <button type="submit" style={buttonStyle}>Login</button>
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

const errorStyle = {
  color: 'red',
  margin: '5px 0 0 0',
};

export default LoginForm;