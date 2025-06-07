const fs = require('fs');
const path = require('path');

// Get users data from JSON file
const getUsersData = () => {
  try {
    const usersPath = path.join(__dirname, '../../data/users.json');
    const data = fs.readFileSync(usersPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading users data:', error);
    return [];
  }
};

// Get user by ID
const getUserById = (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id, 10);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    
    const users = getUsersData();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    
    return res.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all users
const getAllUsers = (req, res) => {
  try {
    const users = getUsersData();
    
    // Remove passwords from users
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    return res.json({
      success: true,
      users: usersWithoutPasswords
    });
  } catch (error) {
    console.error('Get all users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getUserById,
  getAllUsers
};
