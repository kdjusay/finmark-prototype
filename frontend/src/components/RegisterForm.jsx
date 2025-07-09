import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterForm = ({ onSuccess }) => {
  const navigate = useNavigate();

  // State for form fields and validation errors
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');

  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Regex patterns
  const emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
  const namePattern = /^[A-Za-z\s'-]{2,50}$/;
  const lastNamePattern = /^[A-Za-z\s'-]{2,30}$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Realtime input validation and formatting
  const handleFirstName = (e) => {
    let v = e.target.value.replace(/[^A-Za-z\s'-]/g, '').slice(0, 50);
    setFirstName(v);
    if (v.length < 2) setFirstNameError('First name too short');
    else setFirstNameError('');
  };
  const handleLastName = (e) => {
    let v = e.target.value.replace(/[^A-Za-z\s'-]/g, '').slice(0, 30);
    setLastName(v);
    if (v.length < 2) setLastNameError('Last name too short');
    else setLastNameError('');
  };
  const handlePhone = (e) => {
    let v = e.target.value.replace(/\D/g, ''); // Remove all non-digits
    if (v.startsWith('639')) v = '+' + v;
    else if (v.startsWith('9')) v = '+63' + v;
    else if (v.startsWith('0')) v = '+63' + v.slice(1);
    else if (!v.startsWith('+63')) v = '+63' + v;
    v = v.slice(0, 13); // +639XXXXXXXXX
    setPhone(v);
    if (v.length < 13) setPhoneError('Phone must be +639XXXXXXXXX');
    else setPhoneError('');
  };

  const validateAll = () => {
    let valid = true;
    if (!email || !emailPattern.test(email)) {
      setEmailError('Invalid email');
      valid = false;
    } else setEmailError('');
    if (!firstName || !namePattern.test(firstName)) {
      setFirstNameError('First name required, letters only');
      valid = false;
    } else setFirstNameError('');
    if (!lastName || !lastNamePattern.test(lastName)) {
      setLastNameError('Last name required, letters only');
      valid = false;
    } else setLastNameError('');
    if (!password || !passwordPattern.test(password)) {
      setPasswordError('Min 8 chars, 1 upper, 1 lower, 1 digit, 1 symbol');
      valid = false;
    } else setPasswordError('');
    if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      valid = false;
    } else setConfirmPasswordError('');
    if (!phone || !/^\+639\d{9}$/.test(phone)) {
      setPhoneError('Phone must be +639XXXXXXXXX');
      valid = false;
    } else setPhoneError('');
    return valid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          phone,
          // Role will default to 'user' on backend
        })
      });
      const data = await res.json();
      if (data.success) {
        setModalMessage('Registration successful! Logging you in...');
        setShowModal(true);

        // After 1s, auto login and redirect
        setTimeout(async () => {
          setShowModal(false);
          // Auto login
          const loginRes = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const loginData = await loginRes.json();
          if (loginData.success) {
            localStorage.setItem('user', JSON.stringify(loginData.user));
            if (onSuccess) onSuccess(loginData.user);
            else navigate('/products');
          }
        }, 1200);
      } else {
        setModalMessage(data.message || 'Registration failed');
        setShowModal(true);
      }
    } catch (err) {
      setModalMessage('Registration error. Try again.');
      setShowModal(true);
    }
  };

  return (
    <form onSubmit={handleRegister} style={formStyle}>
      <h2 style={formTitle}>Sign Up</h2>
      <div style={fieldGroupStyle}>
        <label>First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={handleFirstName}
          style={{ ...inputStyle, borderColor: firstNameError ? 'red' : '#ccc' }}
          maxLength={50}
        />
        {firstNameError && <p style={errorStyle}>{firstNameError}</p>}
      </div>
      <div style={fieldGroupStyle}>
        <label>Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={handleLastName}
          style={{ ...inputStyle, borderColor: lastNameError ? 'red' : '#ccc' }}
          maxLength={30}
        />
        {lastNameError && <p style={errorStyle}>{lastNameError}</p>}
      </div>
      <div style={fieldGroupStyle}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ ...inputStyle, borderColor: emailError ? 'red' : '#ccc' }}
        />
        {emailError && <p style={errorStyle}>{emailError}</p>}
      </div>
      <div style={fieldGroupStyle}>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ ...inputStyle, borderColor: passwordError ? 'red' : '#ccc' }}
          placeholder="Min 8 chars, upper, lower, number, symbol"
        />
        {passwordError && <p style={errorStyle}>{passwordError}</p>}
      </div>
      <div style={fieldGroupStyle}>
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          style={{ ...inputStyle, borderColor: confirmPasswordError ? 'red' : '#ccc' }}
        />
        {confirmPasswordError && <p style={errorStyle}>{confirmPasswordError}</p>}
      </div>
      <div style={fieldGroupStyle}>
        <label>Phone (+639XXXXXXXXX):</label>
        <input
          type="tel"
          value={phone}
          onChange={handlePhone}
          style={{ ...inputStyle, borderColor: phoneError ? 'red' : '#ccc' }}
          maxLength={13}
        />
        {phoneError && <p style={errorStyle}>{phoneError}</p>}
      </div>
      <button type="submit" style={buttonStyle}>Create Account</button>
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <div style={modalIcon}>🔔</div>
            <p style={modalText}>{modalMessage}</p>
            <button onClick={() => setShowModal(false)} style={modalButton}>OK</button>
          </div>
        </div>
      )}
    </form>
  );
};

// ========== Styles (same as LoginForm) ==========
const formStyle = {
  border: '1px solid #ddd',
  padding: '30px',
  borderRadius: '10px',
  backgroundColor: '#fff',
  width: '320px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
};
const formTitle = { textAlign: 'center', marginBottom: '20px', color: '#333' };
const fieldGroupStyle = { marginBottom: '10px', textAlign: 'left' };
const inputStyle = {
  width: '100%', padding: '10px', marginTop: '5px', marginBottom: '12px',
  boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc', fontSize: '14px'
};
const buttonStyle = {
  backgroundColor: '#4c91af', color: 'white', padding: '10px 15px', border: 'none',
  borderRadius: '5px', cursor: 'pointer', marginTop: '10px', width: '100%', fontWeight: 'bold',
};
const errorStyle = { color: 'red', fontSize: '12px', marginTop: '2px' };
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
  border: 'none', borderRadius: '4px', cursor: 'pointer',
};

export default RegisterForm;