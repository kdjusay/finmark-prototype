import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasMinLength && hasUpper && hasNumber && hasSpecial;
  };

  const showModalDialog = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let isValid = true;

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    } else {
      setEmailError('');
    }

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

    fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success || data.message === 'Admin login successful') {
          const role = data.user?.role || data.admin?.role;
          if (role === 'admin') {
            showModalDialog('Welcome Admin!');
            setTimeout(() => navigate('/admin/dashboard'), 1000);
          } else {
            showModalDialog('Login successful!');
          }
        } else {
          showModalDialog(`Login failed: ${data.message}`);
        }
      })
      .catch(error => {
        console.error('Login error:', error);
        showModalDialog('An error occurred during login.');
      });
  };

  return (
    <div style={pageCenterStyle}>
      <div style={formWrapper}>
        <h1 style={headerText}>FinMark Corporation</h1>

        <form onSubmit={handleSubmit} style={formStyle}>
          <h2 style={formTitle}>Login</h2>

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
      </div>

      {showModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <div style={modalIcon}>🔔</div>
            <p style={modalText}>{modalMessage}</p>
            <button onClick={() => setShowModal(false)} style={modalButton}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const pageCenterStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#eef3f7',
};

const formWrapper = {
  textAlign: 'center',
};

const headerText = {
  fontSize: '32px',
  color: '#4c91af',
  marginBottom: '30px',
  fontWeight: 'bold',
  letterSpacing: '1px',
};

const formStyle = {
  border: '1px solid #ddd',
  padding: '30px',
  borderRadius: '10px',
  backgroundColor: '#fff',
  width: '320px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
};

const formTitle = {
  textAlign: 'center',
  marginBottom: '20px',
  color: '#333',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginTop: '5px',
  marginBottom: '12px',
  boxSizing: 'border-box',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '14px',
};

const buttonStyle = {
  backgroundColor: '#4c91af',
  color: 'white',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '10px',
  width: '100%',
  fontWeight: 'bold',
};

const fieldGroupStyle = {
  marginBottom: '10px',
  textAlign: 'left',
};

const errorStyle = {
  color: 'red',
  fontSize: '12px',
  marginTop: '2px',
};

// Modal Styles
const modalOverlay = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,
};

const modalBox = {
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '10px',
  textAlign: 'center',
  width: '300px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
};

const modalIcon = {
  fontSize: '30px',
  marginBottom: '15px',
};

const modalText = {
  fontSize: '16px',
  marginBottom: '20px',
};

const modalButton = {
  backgroundColor: '#4c91af',
  color: 'white',
  padding: '8px 20px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default LoginForm;