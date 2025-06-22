const bcrypt = require('bcryptjs');
const users = require('../../data/users.json');

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  // Find admin user by email
  const admin = users.find(user => user.role === 'admin' && user.email === email);

  if (!admin) {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }

  // Check password using bcrypt
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }

  res.json({ success: true, message: 'Admin login successful', admin });
};

exports.getAdminAccessList = (req, res) => {
  const admins = users.filter(user => user.role === 'admin');
  res.json(admins);
};