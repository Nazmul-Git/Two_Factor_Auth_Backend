const express = require('express');
const passport = require('passport');
const { register, login, verify2FA, googleLogin } = require('../middleware/auth');
const jwt = require('jsonwebtoken');

const router = express.Router();

// routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify', verify2FA);

// Google OAuth routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const user = req.user; 
    const token = generateJWT(user);
    console.log(token, user);
    res.json({ message: 'Google account connected', token, user });
  }
);

router.post('/google-login', googleLogin);

const generateJWT = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

module.exports = router;