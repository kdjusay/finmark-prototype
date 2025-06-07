# Finmark Backend API

Simple Express.js backend for the Finmark prototype with login and health check endpoints.

## Project Structure

```
backend/
├── data/             # Data storage
│   └── users.json    # User data
├── src/              # Source code
│   ├── controllers/  # Request handlers
│   │   ├── auth.controller.js
│   ├── middleware/   # Express middleware
│   │   └── logger.middleware.js
│   └── routes/       # API routes
│       ├── auth.routes.js
│       └── index.js  # Route aggregator
├── .env              # Environment variables
├── package.json      # Dependencies and scripts
├── server.js         # Entry point
└── README.md         # Documentation
```

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "admin@finmark.com",
    "password": "password"
  }
  ```
- **Description**: Authenticates a user and returns a JWT token
- **Response Example**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "admin@finmark.com",
      "role": "admin",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "profile": {
        "firstName": "Admin",
        "lastName": "User",
        "phone": "+1234567890"
      }
    }
  }
  ```

## Test Users

The system includes several test users (stored in `data/users.json`):

1. **Admin User**
   - Email: `admin@finmark.com`
   - Password: `password` (or the hash in users.json)
   - Role: `admin`

2. **Regular User - John Doe**
   - Email: `john@example.com`
   - Password: `password` (or the hash in users.json)
   - Role: `user`

3. **Regular User - Jane Smith**
   - Email: `jane@example.com`
   - Password: `password` (or the hash in users.json)
   - Role: `user`

4. **Demo User**
   - Email: `demo@finmark.com`
   - Password: `password` (or the hash in users.json)
   - Role: `demo`

## Notes

- For simplicity, the password "password" is accepted for all users
- You can also use the actual hash as a password (for debugging purposes)
- JWT tokens expire after 24 hours by default
