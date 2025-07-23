const bcrypt = require('bcryptjs');
const pool = require('../db/mysql'); // Correct relative path for your src/controllers/*.js

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND role = "admin"', [email]);
  if (!rows.length) return res.status(401).json({ message: 'Invalid admin credentials' });
  const admin = rows[0];
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid admin credentials' });
  res.json({ success: true, message: 'Admin login successful', admin });
};

exports.getAdminAccessList = async (req, res) => {
  const [admins] = await pool.query('SELECT id, email, first_name, last_name, phone, created_at FROM users WHERE role = "admin"');
  res.json(admins);
};