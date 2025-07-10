const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/mysql');

const MAX_ATTEMPTS = 8;
const LOCK_DURATION_HOURS = 12;

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    // Check login attempts
    const [attemptRows] = await pool.query(
      'SELECT * FROM login_attempts WHERE email = ?',
      [email]
    );

    const now = new Date();

    if (attemptRows.length > 0) {
      const attempt = attemptRows[0];

      // Check if currently locked
      if (attempt.locked_until && new Date(attempt.locked_until) > now) {
        const waitMinutes = Math.ceil((new Date(attempt.locked_until) - now) / 60000);
        return res.status(429).json({
          success: false,
          message: `Account locked due to too many failed attempts. Try again in ${waitMinutes} minute(s).`
        });
      }
    }

    // Fetch user
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) {
      // Register failed attempt for unknown email as well
      await recordFailedAttempt(email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      await recordFailedAttempt(email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Successful login - reset attempts
    await resetAttempts(email);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, message: 'Login successful', token, user: userWithoutPassword });
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Helper function to record failed login attempt
async function recordFailedAttempt(email) {
  const now = new Date();

  // Check if record exists
  const [rows] = await pool.query('SELECT * FROM login_attempts WHERE email = ?', [email]);

  if (rows.length === 0) {
    // Insert new record
    await pool.query(
      'INSERT INTO login_attempts (email, attempts, last_attempt) VALUES (?, ?, ?)',
      [email, 1, now]
    );
  } else {
    let attempt = rows[0];
    let attempts = attempt.attempts + 1;

    let locked_until = null;
    if (attempts >= MAX_ATTEMPTS) {
      locked_until = new Date(now.getTime() + LOCK_DURATION_HOURS * 60 * 60 * 1000);
      attempts = MAX_ATTEMPTS; // cap attempts
    }

    await pool.query(
      'UPDATE login_attempts SET attempts = ?, last_attempt = ?, locked_until = ? WHERE email = ?',
      [attempts, now, locked_until, email]
    );
  }
}

// Helper to reset attempts on successful login
async function resetAttempts(email) {
  await pool.query('DELETE FROM login_attempts WHERE email = ?', [email]);
}

module.exports = { login };