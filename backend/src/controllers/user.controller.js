const bcrypt = require('bcryptjs');
const pool = require('../db/mysql');

const getUserById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, email, role, created_at, updated_at, first_name, last_name, phone, is_2fa_enabled FROM users WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, email, role, created_at, updated_at, first_name, last_name, phone FROM users');
    res.json({ success: true, users: rows, count: rows.length });
  } catch (err) { res.status(500).json({ success: false, message: 'Internal server error' }); }
};

const createUser = async (req, res) => {
  try {
    const { email, password, role = 'user', firstName, lastName, phone } = req.body;
    if (!email || !password || !firstName || !lastName)
      return res.status(400).json({ success: false, message: 'Missing fields' });
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(409).json({ success: false, message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO users (email, password, role, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?, ?)`,
      [email, hashed, role, firstName, lastName, phone || null]
    );
    const [userRow] = await pool.query('SELECT id, email, role, created_at, updated_at, first_name, last_name, phone FROM users WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, user: userRow[0] });
  } catch (err) { res.status(500).json({ success: false, message: 'Internal server error' }); }
};

// THE FIXED UPDATE
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    let { email, password, role, firstName, lastName, phone } = req.body;

    const [existing] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'User not found' });

    let updates = [];
    let params = [];

    if (email !== undefined)      { updates.push('email = ?');        params.push(email); }
    if (firstName !== undefined)  { updates.push('first_name = ?');   params.push(firstName); }
    if (lastName !== undefined)   { updates.push('last_name = ?');    params.push(lastName); }
    if (phone !== undefined)      { updates.push('phone = ?');        params.push(phone); }
    if (role !== undefined)       { updates.push('role = ?');         params.push(role); }
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updates.push('password = ?');
      params.push(hashed);
    }

    if (!updates.length) return res.status(400).json({ success: false, message: 'Nothing to update' });

    updates.push('updated_at = NOW()');
    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    params.push(id);

    const [result] = await pool.query(sql, params);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'User not found' });

    const [userRow] = await pool.query('SELECT id, email, role, created_at, updated_at, first_name, last_name, phone FROM users WHERE id = ?', [id]);
    res.json({ success: true, user: userRow[0] });
  } catch (err) {
    console.error('[UPDATE USER ERROR]', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (!user.length) return res.status(404).json({ success: false, message: 'User not found' });
    if (user[0].role === 'admin') return res.status(403).json({ success: false, message: 'Cannot delete admin users' });
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) { res.status(500).json({ success: false, message: 'Internal server error' }); }
};

const searchUsers = async (req, res) => {
  try {
    const q = req.query.q ? `%${req.query.q}%` : '%';
    const [rows] = await pool.query(
      `SELECT id, email, role, created_at, updated_at, first_name, last_name, phone FROM users
       WHERE email LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR CONCAT(first_name, ' ', last_name) LIKE ?`,
      [q, q, q, q]
    );
    res.json({ success: true, users: rows, count: rows.length, searchTerm: req.query.q });
  } catch (err) { res.status(500).json({ success: false, message: 'Internal server error' }); }
};

module.exports = {
  getUserById,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  searchUsers
};