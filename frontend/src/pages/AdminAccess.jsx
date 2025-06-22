import React, { useState } from 'react';
import axios from 'axios';

const AdminAccess = () => {
  const [email, setEmail] = useState('');
  const [access, setAccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // call API later
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Admin Access Control</h2>
      <label>Email:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <label>Access Level:</label>
      <input type="text" value={access} onChange={(e) => setAccess(e.target.value)} required />
      <button type="submit">Submit</button>
    </form>
  );
};

export default AdminAccess;