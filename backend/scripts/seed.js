/**
 * Seed script for initializing data
 * Run with: node scripts/seed.js
 */
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dataDir = path.join(__dirname, '..', 'data');
const usersPath = path.join(dataDir, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✅ Created data directory');
}

// Default users to seed
const defaultUsers = [
  {
    id: 1,
    email: "admin@finmark.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "password"
    role: "admin",
    createdAt: "2024-01-01T00:00:00.000Z",
    profile: {
      firstName: "Admin",
      lastName: "User",
      phone: "+1234567890"
    }
  },
  {
    id: 2,
    email: "john@example.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "password"
    role: "user",
    createdAt: "2024-01-15T10:30:00.000Z",
    profile: {
      firstName: "John",
      lastName: "Doe",
      phone: "+1987654321"
    }
  },
  {
    id: 3,
    email: "jane@example.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "password"
    role: "user",
    createdAt: "2024-02-01T14:15:00.000Z",
    profile: {
      firstName: "Jane",
      lastName: "Smith",
      phone: "+1555666777"
    }
  },
  {
    id: 4,
    email: "demo@finmark.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "password"
    role: "demo",
    createdAt: "2024-02-10T09:00:00.000Z",
    profile: {
      firstName: "Demo",
      lastName: "User",
      phone: "+1111222333"
    }
  }
];

// Seed users data
const seedUsers = async () => {
  try {
    // Check if users file exists
    if (fs.existsSync(usersPath)) {
      console.log('ℹ️ Users data already exists. Skipping...');
      return;
    }
    
    fs.writeFileSync(usersPath, JSON.stringify(defaultUsers, null, 2));
    console.log('✅ Users data seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding users data:', error);
  }
};

// Run seeding
const runSeed = async () => {
  console.log('🌱 Starting data seed...');
  
  await seedUsers();
  
  console.log('✅ Data seeding completed');
};

// Execute seed
runSeed();
