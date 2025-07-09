const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/mysql');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, message: 'Login successful', token, user: userWithoutPassword });
  } catch (err) { res.status(500).json({ success: false, message: 'Internal server error' }); }
};

module.exports = { login };