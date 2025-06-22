// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import AdminDashboard from './components/AdminDashboard';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      {/* Optionally add a default catch-all route */}
    </Routes>
  </Router>
);

export default App;