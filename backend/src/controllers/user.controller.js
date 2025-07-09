const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

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

// Save users data to JSON file
const saveUsersData = (users) => {
  try {
    const usersPath = path.join(__dirname, '../../data/users.json');
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving users data:', error);
    return false;
  }
};

// Generate next user ID
const getNextUserId = (users) => {
  if (users.length === 0) return 1;
  return Math.max(...users.map(u => u.id)) + 1;
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
      users: usersWithoutPasswords,
      count: usersWithoutPasswords.length
    });
  } catch (error) {
    console.error('Get all users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const { email, password, role = 'user', firstName, lastName, phone } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, first name, and last name are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate password strength (only for create)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
      });
    }

    const users = getUsersData();

    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = {
      id: getNextUserId(users),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role,
      createdAt: new Date().toISOString(),
      profile: {
        firstName: firstName,
        lastName: lastName,
        phone: phone || ''
      }
    };

    users.push(newUser);

    if (!saveUsersData(users)) {
      return res.status(500).json({
        success: false,
        message: 'Failed to save user data'
      });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    const { email, password, role, firstName, lastName, phone } = req.body;

    const users = getUsersData();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const existingUser = users[userIndex];

    // Check if email is being changed and if it conflicts
    if (email && email.toLowerCase() !== existingUser.email.toLowerCase()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      const emailConflict = users.find(u => u.id !== userId && u.email.toLowerCase() === email.toLowerCase());
      if (emailConflict) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
      existingUser.email = email.toLowerCase();
    }

    // Update password if provided (no format validation for update)
    if (password) {
      if (password.length < 1) {
        return res.status(400).json({
          success: false,
          message: 'Password cannot be empty'
        });
      }
      const saltRounds = 10;
      existingUser.password = await bcrypt.hash(password, saltRounds);
    }

    // Update other fields
    if (role) existingUser.role = role;
    if (firstName) existingUser.profile.firstName = firstName;
    if (lastName) existingUser.profile.lastName = lastName;
    if (phone !== undefined) existingUser.profile.phone = phone;

    existingUser.updatedAt = new Date().toISOString();

    if (!saveUsersData(users)) {
      return res.status(500).json({
        success: false,
        message: 'Failed to save user data'
      });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = existingUser;

    return res.json({
      success: true,
      message: 'User updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete user
const deleteUser = (req, res) => {
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
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow deleting admin users
    if (users[userIndex].role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);

    if (!saveUsersData(users)) {
      return res.status(500).json({
        success: false,
        message: 'Failed to save user data'
      });
    }

    // Return deleted user without password
    const { password: _, ...userWithoutPassword } = deletedUser;

    return res.json({
      success: true,
      message: 'User deleted successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Search users
const searchUsers = (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return getAllUsers(req, res);
    }

    const users = getUsersData();
    const searchTerm = q.toLowerCase();

    const filteredUsers = users.filter(user => {
      const email = user.email.toLowerCase();
      const firstName = user.profile?.firstName?.toLowerCase() || '';
      const lastName = user.profile?.lastName?.toLowerCase() || '';
      const fullName = `${firstName} ${lastName}`.trim();

      return email.includes(searchTerm) ||
        firstName.includes(searchTerm) ||
        lastName.includes(searchTerm) ||
        fullName.includes(searchTerm);
    });

    // Remove passwords from users
    const usersWithoutPasswords = filteredUsers.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return res.json({
      success: true,
      users: usersWithoutPasswords,
      count: usersWithoutPasswords.length,
      searchTerm: q
    });
  } catch (error) {
    console.error('Search users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getUserById,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  searchUsers
};