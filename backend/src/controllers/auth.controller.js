const pool = require('../db/mysql'); // Correct relative path for your src/controllers/*.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { send2FACode } = require('../util/email');

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

    // Admins skip 2FA
    if (user.role === 'admin' || !user.is_2fa_enabled) {
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-super-secret-jwt-key',
        { expiresIn: '24h' }
      );
      const { password: _, two_fa_code, two_fa_expires, ...userWithoutPassword } = user;
      return res.json({ success: true, message: 'Login successful', token, user: userWithoutPassword });
    }

    // User has 2FA enabled: send code
    const code = ('' + Math.floor(100000 + Math.random() * 900000)).substring(0, 6);
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await pool.query(
      'UPDATE users SET two_fa_code = ?, two_fa_expires = ? WHERE id = ?',
      [code, expires, user.id]
    );
    await send2FACode(user.email, code);
    return res.status(200).json({
      success: false,
      message: '2FA code sent to your email',
      requires2FA: true,
      userId: user.id,
      email: user.email,
    });
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const verify2FA = async (req, res) => {
  try {
    const { userId, code } = req.body;
    if (!userId || !code) return res.status(400).json({ success: false, message: 'Missing fields' });

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'User not found' });
    const user = rows[0];

    if (!user.is_2fa_enabled)
      return res.status(400).json({ success: false, message: '2FA is not enabled.' });

    if (!user.two_fa_code || !user.two_fa_expires)
      return res.status(400).json({ success: false, message: 'No 2FA code found. Please login again.' });

    const now = new Date();
    if (user.two_fa_code !== code)
      return res.status(401).json({ success: false, message: 'Invalid code' });

    if (now > user.two_fa_expires)
      return res.status(401).json({ success: false, message: 'Code expired' });

    // Clear code after use
    await pool.query('UPDATE users SET two_fa_code = NULL, two_fa_expires = NULL WHERE id = ?', [userId]);

    // Login successful, generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      { expiresIn: '24h' }
    );
    const { password: _, two_fa_code, two_fa_expires, ...userWithoutPassword } = user;
    return res.json({ success: true, message: '2FA successful', token, user: userWithoutPassword });
  } catch (err) {
    console.error('[2FA VERIFY ERROR]', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const update2FA = async (req, res) => {
  try {
    const { id } = req.params;
    const { enable2FA } = req.body;

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'User not found' });

    // Save as 1 or 0 (not boolean)
    await pool.query('UPDATE users SET is_2fa_enabled = ? WHERE id = ?', [enable2FA ? 1 : 0, id]);
    res.json({ success: true, message: `2FA ${enable2FA ? 'enabled' : 'disabled'}` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  login,
  verify2FA,
  update2FA,
};