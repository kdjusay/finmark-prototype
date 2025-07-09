const express = require('express');
const passport = require('passport');

const router = express.Router();

// Step 1: Redirect user to Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Step 2: Handle Google callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: true }),
  (req, res) => {
    // Success: redirect to frontend with user info (as a query param, or as needed)
    // (You may want to use JWT or a session for real apps. Here is the basic logic.)
    res.redirect(`${process.env.FRONTEND_URL}/google-login-success?user=${encodeURIComponent(JSON.stringify(req.user))}`);
  }
);

// Optional: Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;