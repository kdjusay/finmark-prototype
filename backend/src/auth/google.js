const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../db/mysql');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (!users.length) {
        await pool.query(
          `INSERT INTO users (email, password, role, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?, ?)`,
          [email, '', 'user', profile.name?.givenName || '', profile.name?.familyName || '', '']
        );
        [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      }
      done(null, users[0]);
    } catch (err) {
      done(err, null);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, users[0]);
});

module.exports = passport;