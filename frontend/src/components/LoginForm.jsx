import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Google OAuth login: redirect to backend
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google`;
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

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
          const user = data.user || data.admin;
          localStorage.setItem('user', JSON.stringify(user));
          if (user.role === 'admin') {
            showModalDialog('Welcome Admin!');
            setTimeout(() => navigate('/admin/dashboard'), 1000);
          } else {
            showModalDialog('Login successful!');
            setTimeout(() => navigate('/products'), 1000);
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
      <div style={cardStyle}>
        <h1 style={headerText}>FinMark Corporation</h1>
        <div style={tabRowStyle}>
          <button style={tab === 'login' ? tabActiveStyle : tabStyle} onClick={() => setTab('login')}>Sign In</button>
          <button style={tab === 'register' ? tabActiveStyle : tabStyle} onClick={() => setTab('register')}>Sign Up</button>
        </div>
        {tab === 'login' ? (
          <form onSubmit={handleSubmit} style={formStyle} autoComplete="off">
            <h2 style={formTitle}>Login</h2>
            <div style={fieldGroupStyle}>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ ...inputStyle, borderColor: emailError ? 'red' : '#ccc' }}
                autoComplete="username"
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
                autoComplete="current-password"
              />
              {passwordError && <p style={errorStyle}>{passwordError}</p>}
            </div>
            <button type="submit" style={buttonStyle}>Login</button>
            <div style={orStyle}>or continue with</div>
            <button
              type="button"
              style={googleBtnStyle}
              onClick={handleGoogleLogin}
              title="Sign in with Google"
            >
              <span style={{ marginRight: 10 }}>🔵</span>
              Continue with Google
            </button>
          </form>
        ) : (
          <RegisterForm
            onSuccess={user => {
              localStorage.setItem('user', JSON.stringify(user));
              setModalMessage('Registration successful! Logging in...');
              setShowModal(true);
              setTimeout(() => navigate('/products'), 1200);
            }}
          />
        )}
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

// ======= Registration Form =======
function RegisterForm({ onSuccess }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role] = useState('user');

  // Errors
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePhone = (val) => /^(\+?\d{10,15})$/.test(val);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!firstName) newErrors.firstName = 'Required';
    if (!lastName) newErrors.lastName = 'Required';
    if (!email) newErrors.email = 'Required';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email format';
    if (!phone) newErrors.phone = 'Required';
    else if (!validatePhone(phone)) newErrors.phone = 'Invalid phone. Use +639XXXXXXXXX or 09XXXXXXXXX';
    if (!password) newErrors.password = 'Required';
    else if (password.length < 8) newErrors.password = 'At least 8 characters';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // API register call
    fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        password,
        role
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          onSuccess(data.user);
        } else {
          setErrors({ form: data.message || 'Registration failed.' });
        }
      })
      .catch(() => setErrors({ form: 'Error: could not register.' }));
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit} autoComplete="off">
      <h2 style={formTitle}>Sign Up</h2>
      {errors.form && <div style={errorStyle}>{errors.form}</div>}
      <div style={fieldGroupStyle}>
        <label>First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={e => setFirstName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
          style={{ ...inputStyle, borderColor: errors.firstName ? 'red' : '#ccc' }}
          autoComplete="given-name"
        />
        {errors.firstName && <p style={errorStyle}>{errors.firstName}</p>}
      </div>
      <div style={fieldGroupStyle}>
        <label>Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={e => setLastName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
          style={{ ...inputStyle, borderColor: errors.lastName ? 'red' : '#ccc' }}
          autoComplete="family-name"
        />
        {errors.lastName && <p style={errorStyle}>{errors.lastName}</p>}
      </div>
      <div style={fieldGroupStyle}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ ...inputStyle, borderColor: errors.email ? 'red' : '#ccc' }}
          autoComplete="email"
        />
        {errors.email && <p style={errorStyle}>{errors.email}</p>}
      </div>
      <div style={fieldGroupStyle}>
        <label>Phone:</label>
        <input
          type="tel"
          value={phone}
          placeholder="e.g. +639171234567"
          onChange={e => {
            let raw = e.target.value;
            // Accepts only digits and leading +
            raw = raw.replace(/(?!^\+)[^0-9]/g, '');
            setPhone(raw);
            if (errors.phone) setErrors({ ...errors, phone: '' });
          }}
          maxLength={16}
          style={{ ...inputStyle, borderColor: errors.phone ? 'red' : '#ccc' }}
          autoComplete="tel"
        />
        {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
      </div>
      <div style={fieldGroupStyle}>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ ...inputStyle, borderColor: errors.password ? 'red' : '#ccc' }}
          autoComplete="new-password"
        />
        {errors.password && <p style={errorStyle}>{errors.password}</p>}
      </div>
      <button type="submit" style={buttonStyle}>Register</button>
    </form>
  );
}

// ========== Styles ==========
const pageCenterStyle = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#eef3f7'
};
const cardStyle = {
  background: '#fff',
  borderRadius: '14px',
  boxShadow: '0 8px 32px rgba(60,120,200,0.10)',
  width: '370px',
  minHeight: '440px',
  padding: '36px 28px 24px 28px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  position: 'relative'
};
const headerText = {
  fontSize: '28px',
  color: '#4c91af',
  marginBottom: '24px',
  fontWeight: 'bold',
  letterSpacing: '1px',
  textAlign: 'center'
};
const tabRowStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0',
  marginBottom: '16px'
};
const tabStyle = {
  flex: 1,
  border: 'none',
  borderBottom: '2px solid #e3e3e3',
  background: 'transparent',
  color: '#4c91af',
  fontWeight: 'bold',
  fontSize: '17px',
  padding: '10px 0',
  cursor: 'pointer',
  outline: 'none',
  transition: 'border 0.2s'
};
const tabActiveStyle = {
  ...tabStyle,
  borderBottom: '2.5px solid #4c91af',
  color: '#247ebd',
  background: '#f7fcff'
};
const formStyle = {
  padding: '0',
  border: 'none',
  background: 'transparent'
};
const formTitle = { textAlign: 'center', marginBottom: '16px', color: '#333' };
const inputStyle = {
  width: '100%',
  padding: '9px',
  marginTop: '4px',
  marginBottom: '8px',
  boxSizing: 'border-box',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '15px'
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
  fontWeight: 'bold'
};
const googleBtnStyle = {
  ...buttonStyle,
  background: '#fff',
  color: '#333',
  border: '1px solid #b4d4e7',
  marginTop: '10px',
  marginBottom: '0'
};
const fieldGroupStyle = { marginBottom: '10px', textAlign: 'left' };
const errorStyle = { color: 'red', fontSize: '12px', marginTop: '2px' };
const orStyle = { margin: '20px 0 10px 0', color: '#888', textAlign: 'center' };
const modalOverlay = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center',
  alignItems: 'center', zIndex: 999,
};
const modalBox = {
  backgroundColor: '#fff', padding: '30px', borderRadius: '10px',
  textAlign: 'center', width: '300px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
};
const modalIcon = { fontSize: '30px', marginBottom: '15px' };
const modalText = { fontSize: '16px', marginBottom: '20px' };
const modalButton = {
  backgroundColor: '#4c91af', color: 'white', padding: '8px 20px',
  border: 'none', borderRadius: '4px', cursor: 'pointer'
};

export default LoginForm;