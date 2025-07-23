import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import googleLogo from '../assets/google-logo.png'; // Make sure the path is correct

// --- LoginForm with Error Handling, 2FA, and Full Role-based Routing ---
const LoginForm = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  // 2FA states
  const [pending2FA, setPending2FA] = useState(null); // { userId, email }
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFAError, setTwoFAError] = useState('');

  // Google OAuth login: redirect to backend
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google`;
  };

  // --- Validators ---
  const validateEmail = (value) => {
    if (!value) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email address (e.g. your@email.com)';
    return '';
  };
  const validatePassword = (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  // On submit: validate all, and show errors if any
  const handleSubmit = (e) => {
    e.preventDefault();

    setTwoFAError('');
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);

    if (eErr || pErr) return;

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
          // === ROLE-BASED NAVIGATION LOGIC ===
          if (user.role === 'admin') {
            showModalDialog('Welcome Admin!');
            setTimeout(() => navigate('/admin/dashboard'), 1000);
          } else if (user.role === 'employee') {
            showModalDialog('Login successful!');
            setTimeout(() => navigate('/products'), 1000);
          } else if (user.role === 'guest') {
            showModalDialog('Login successful! Welcome, Guest.');
            setTimeout(() => navigate('/guest'), 1000);
          } else if (
            user.role === 'executive' ||
            user.role === 'manager' ||
            user.role === 'finance'
          ) {
            showModalDialog('Login successful! Welcome.');
            setTimeout(() => navigate('/reports'), 1000);
          } else if (user.role === 'hr') {
            showModalDialog('Welcome HR!');
            setTimeout(() => navigate('/hr/dashboard'), 1000);
          } else {
            showModalDialog('Login successful!');
            setTimeout(() => navigate('/products'), 1000);
          }
        } else if (data.requires2FA) {
          setPending2FA({ userId: data.userId, email: data.email });
          setModalMessage('A 2FA code was sent to your email.');
          setShowModal(true);
        } else if (data.message && data.message.includes('Account locked')) {
          showModalDialog(data.message);
        } else {
          showModalDialog(`Login failed: ${data.message}`);
        }
      })
      .catch(error => {
        console.error('Login error:', error);
        showModalDialog('An error occurred during login.');
      });
  };

  // 2FA code submit
  const handle2FASubmit = (e) => {
    e.preventDefault();
    if (!twoFACode.match(/^\d{6}$/)) {
      setTwoFAError('Code must be 6 digits');
      return;
    }
    fetch(`${process.env.REACT_APP_API_URL}/api/login/verify-2fa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: pending2FA.userId, code: twoFACode })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('user', JSON.stringify(data.user));
          showModalDialog('2FA successful! Logging in...');
          setTimeout(() => navigate('/products'), 1000);
          setPending2FA(null);
          setTwoFACode('');
        } else {
          setTwoFAError(data.message || 'Invalid or expired code');
        }
      });
  };

  const showModalDialog = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  // Clear errors when user starts typing again
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError('');
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
                onChange={handleEmailChange}
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
                onChange={handlePasswordChange}
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
              <img
                src={googleLogo}
                alt="Google Logo"
                style={{
                  width: 22,
                  height: 22,
                  marginRight: 10,
                  verticalAlign: 'middle',
                  objectFit: 'contain',
                  display: 'inline-block'
                }}
                draggable={false}
              />
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

      {/* 2FA Modal - IMPROVED UI */}
      {pending2FA && (
        <div style={modalOverlay}>
          <div style={modalBox2FA}>
            <div style={modalIcon2FA}>🔑</div>
            <div style={modalText2FA}>
              Enter the 6-digit code sent to<br />
              <b>{pending2FA.email}</b>
            </div>
            <form onSubmit={handle2FASubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <input
                type="text"
                maxLength={6}
                value={twoFACode}
                onChange={e => {
                  setTwoFACode(e.target.value.replace(/\D/g, ''));
                  setTwoFAError('');
                }}
                style={modalInput2FA}
                autoFocus
              />
              {twoFAError && <div style={errorStyle}>{twoFAError}</div>}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '10px' }}>
                <button type="submit" style={modalButton2FA}>Verify</button>
                <button type="button" onClick={() => { setPending2FA(null); setTwoFACode(''); }} style={{ ...modalButton2FA, backgroundColor: '#6c757d' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Regular Modal */}
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

// ======= Registration Form (unchanged, but included in full for completeness) =======
function RegisterForm({ onSuccess }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role] = useState('user');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Regex patterns
  const emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
  const namePattern = /^[A-Za-z\s'-]{2,50}$/;
  const lastNamePattern = /^[A-Za-z\s'-]{2,30}$/;
  // At least 8 chars, 1 upper, 1 lower, 1 number, 1 symbol
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  function formatPhone(value) {
    let v = value.replace(/[^\d+]/g, '');
    if (v.startsWith('09')) v = '+639' + v.slice(2);
    else if (v.startsWith('9')) v = '+639' + v.slice(1);
    else if (v.startsWith('639')) v = '+639' + v.slice(3);
    else if (v.startsWith('+63')) v = '+63' + v.slice(3);
    else if (!v.startsWith('+639')) v = '+639';

    v = v.slice(0, 13);
    return v;
  }

  // Only show errors if submitted
  const validate = () => {
    const newErrors = {};
    if (!firstName) newErrors.firstName = 'First name is required';
    else if (!namePattern.test(firstName)) newErrors.firstName = 'First name must contain only letters and spaces';
    else if (firstName.length < 2) newErrors.firstName = 'First name too short';

    if (!lastName) newErrors.lastName = 'Last name is required';
    else if (!lastNamePattern.test(lastName)) newErrors.lastName = 'Last name must contain only letters and spaces';
    else if (lastName.length < 2) newErrors.lastName = 'Last name too short';

    if (!email) newErrors.email = 'Email is required';
    else if (!emailPattern.test(email)) newErrors.email = 'Invalid email address';

    if (!phone) newErrors.phone = 'Phone number is required';
    else if (!/^\+639\d{9}$/.test(phone)) newErrors.phone = 'Phone must be +639XXXXXXXXX';

    if (!password) newErrors.password = 'Password is required';
    else if (!passwordPattern.test(password)) newErrors.password = 'Password must be at least 8 chars, upper, lower, number, symbol';

    // Only validate confirmPassword if password field is valid
    if (passwordPattern.test(password)) {
      if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      else if (confirmPassword !== password) newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  // Phone onChange (live formatting)
  const handlePhoneChange = (value) => {
    setPhone(formatPhone(value));
    if (errors.phone) setErrors(e => ({ ...e, phone: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.values(newErrors).length > 0) return;

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
          setErrors(e => ({ ...e, form: data.message || 'Registration failed.' }));
        }
      })
      .catch(() => setErrors(e => ({ ...e, form: 'Error: could not register.' })));
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
          onChange={e => setFirstName(e.target.value.replace(/[^A-Za-z\s'-]/g, '').slice(0, 50))}
          autoComplete="given-name"
          style={{ ...inputStyle, borderColor: submitted && errors.firstName ? 'red' : '#ccc' }}
        />
        {submitted && errors.firstName && <p style={errorStyle}>{errors.firstName}</p>}
      </div>
      <div style={fieldGroupStyle}>
        <label>Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={e => setLastName(e.target.value.replace(/[^A-Za-z\s'-]/g, '').slice(0, 30))}
          autoComplete="family-name"
          style={{ ...inputStyle, borderColor: submitted && errors.lastName ? 'red' : '#ccc' }}
        />
        {submitted && errors.lastName && <p style={errorStyle}>{errors.lastName}</p>}
      </div>
      <div style={fieldGroupStyle}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          style={{ ...inputStyle, borderColor: submitted && errors.email ? 'red' : '#ccc' }}
        />
        {submitted && errors.email && <p style={errorStyle}>{errors.email}</p>}
      </div>
      <div style={fieldGroupStyle}>
        <label>Phone (+639XXXXXXXXX):</label>
        <input
          type="tel"
          value={phone}
          placeholder="e.g. +639171234567"
          onChange={e => handlePhoneChange(e.target.value)}
          maxLength={13}
          autoComplete="tel"
          style={{ ...inputStyle, borderColor: submitted && errors.phone ? 'red' : '#ccc' }}
        />
        {submitted && errors.phone && <p style={errorStyle}>{errors.phone}</p>}
      </div>
      <div style={fieldGroupStyle}>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="new-password"
          placeholder="Min 8 chars, upper, lower, number, symbol"
          style={{ ...inputStyle, borderColor: submitted && errors.password ? 'red' : '#ccc' }}
        />
        {submitted && errors.password && <p style={errorStyle}>{errors.password}</p>}
      </div>
      <div style={fieldGroupStyle}>
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          disabled={!passwordPattern.test(password)}
          autoComplete="off"
          style={{
            ...inputStyle,
            borderColor: submitted && errors.confirmPassword ? 'red' : '#ccc',
            background: !passwordPattern.test(password) ? '#eee' : '#fff',
            cursor: !passwordPattern.test(password) ? 'not-allowed' : 'text'
          }}
        />
        {submitted && errors.confirmPassword && <p style={errorStyle}>{errors.confirmPassword}</p>}
      </div>
      <button type="submit" style={buttonStyle}>Register</button>
    </form>
  );
}

// ========== Styles (Unchanged, included for reference) ==========
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
  marginBottom: '0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 0,
  fontWeight: 500
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
// ==== NEW: Improved 2FA Modal Styles ====
const modalBox2FA = {
  backgroundColor: '#fff',
  padding: '36px 38px 32px 38px',
  borderRadius: '12px',
  textAlign: 'center',
  width: '370px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};
const modalIcon2FA = {
  fontSize: '38px',
  marginBottom: '20px'
};
const modalText2FA = {
  fontSize: '17px',
  marginBottom: '20px',
  color: '#2b2e33',
  fontWeight: 500,
  lineHeight: 1.4,
  textAlign: 'center',
};
const modalInput2FA = {
  width: '100%',
  maxWidth: '200px',
  fontSize: '28px',
  letterSpacing: '9px',
  textAlign: 'center',
  padding: '12px 0',
  margin: '18px 0 25px 0',
  border: '1.5px solid #4c91af',
  borderRadius: '6px',
  outline: 'none',
  background: '#f5f7fa',
  fontWeight: 'bold',
};
const modalButton2FA = {
  backgroundColor: '#4c91af',
  color: 'white',
  padding: '12px 24px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '16px',
  margin: '0 10px'
};

export default LoginForm;