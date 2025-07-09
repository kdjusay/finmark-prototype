import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Import your modal style (reuse from LoginForm)
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

const GoogleLoginSuccess = () => {
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userStr = params.get("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        localStorage.setItem("user", JSON.stringify(user));
        // Set modal message based on role
        if (user.role === "admin") setModalMessage('Welcome Admin! Google login successful!');
        else setModalMessage('Login successful! Welcome to FinMark.');
        // Redirect after short delay or after OK is clicked
      } catch (err) {
        setModalMessage("Google login failed. Please try again.");
      }
    } else {
      setModalMessage("Google login failed or cancelled.");
    }
  }, []);

  const handleOk = () => {
    setShowModal(false);
    // Get user from localStorage to check role
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    if (user && user.role === "admin") navigate("/admin/dashboard");
    else if (user && user.role) navigate("/products");
    else navigate("/");
  };

  // Show nothing until modal is rendered
  if (!showModal) return null;

  return (
    <div style={modalOverlay}>
      <div style={modalBox}>
        <div style={modalIcon}>🔵</div>
        <p style={modalText}>{modalMessage}</p>
        <button onClick={handleOk} style={modalButton}>OK</button>
      </div>
    </div>
  );
};

export default GoogleLoginSuccess;