const express = require('express');
const { register, login, verify2FA } = require('../middleware/auth');
const router = express.Router();

// routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify', verify2FA);

router.get('/', (req, res) => {
  res.send('Welcome to the API');
});

module.exports = router;
