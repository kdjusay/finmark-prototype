const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./src/routes');
const logger = require('./src/middleware/logger.middleware');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Routes
app.use(routes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Available Endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   POST http://localhost:${PORT}/api/login`);
  console.log(`   GET  http://localhost:${PORT}/api/users`);
  console.log(`   GET  http://localhost:${PORT}/api/users/search?q=<query>`);
  console.log(`   GET  http://localhost:${PORT}/api/users/:id`);
  console.log(`   POST http://localhost:${PORT}/api/users`);
  console.log(`   PUT  http://localhost:${PORT}/api/users/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/users/:id`);
  console.log(`\nLogin Credentials for Testing:`);
  console.log(`   Admin: admin@finmark.com / password`);
  console.log(`   User: john@example.com / password`);
  console.log(`\nFrontend: http://localhost:3000`);
  console.log(`Admin Dashboard: http://localhost:3000/admin/dashboard`);
});

module.exports = app;