const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../db/mysql');

// Role to assign for new Google sign-ups (update as per your requirements)
const DEFAULT_OAUTH_ROLE = 'guest';

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      // Check if user exists
      let [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

      if (!users.length) {
        // User does not exist, create with GUEST role
        await pool.query(
          `INSERT INTO users (email, password, role, first_name, last_name, phone)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            email,
            '', // no password for OAuth
            DEFAULT_OAUTH_ROLE,
            profile.name?.givenName || '',
            profile.name?.familyName || '',
            ''
          ]
        );
        [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      }
      // User found or created, return user object
      done(null, users[0]);
    } catch (err) {
      done(err, null);
    }
  }
));

// Use user.id for session
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, users[0]);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;