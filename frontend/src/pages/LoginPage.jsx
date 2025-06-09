import React from 'react';
import LoginForm from '../components/LoginForm';
import axios from 'axios';

const LoginPage = () => {
  const handleLogin = async ({ email, password }) => {
    try {
      const res = await axios.post('http://localhost:3000/auth/login', { email, password });
      alert("Login successful! Token: " + res.data.token);
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.error || "Something went wrong"));
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
};

export default LoginPage;
