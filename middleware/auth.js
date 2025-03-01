const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const nodemailer = require('nodemailer');
const { totp } = require('otplib');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register
const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const secret = speakeasy.generateSecret({ length: 20 });

    const user = new User({ email, password, twoFactorSecret: secret.base32 });
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      secret: secret.base32,
      otpauthUrl: secret.otpauth_url,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const mailCode = speakeasy.totp({
      secret: user.twoFactorSecret,
      digits: 6,
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: email,
      subject: 'Your Verification Code',
      text: `Your Mail Code is ${mailCode}. It will expire in 2 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: 'Code sent to email',
      tempSecret: user.twoFactorSecret,
      requires2FA: true,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Verify 2FA
const verify2FA = async (req, res) => {
  const { email, token } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isValid = totp.verify({
      secret: user.twoFactorSecret,
      token: token,
      window: 1,
    });
    console.log("User Secret: ", user.twoFactorSecret);
    console.log("Token Provided: ", token);
    console.log("Is Valid: ", isValid);


    if (!isValid) {
      return res.status(400).json({ error: 'Invalid 2FA code' });
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: '2FA verification successful',
      token: jwtToken,
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// Google Login
const googleLogin = async (req, res) => {
  const { tokenId } = req.body;

  if (!tokenId) {
    return res.status(400).json({ error: 'Token ID is required.' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    let user = await User.findOne({ googleId: payload.sub });

    if (!user) {
      user = new User({
        googleId: payload.sub,
        email: email,
      });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, requires2FA: false, email });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(400).json({ error: 'Google login failed. Please try again.' });
  }
};

module.exports = { register, login, verify2FA, googleLogin };