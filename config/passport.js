const passport = require('passport');
const User = require('../models/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Set up Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL}/auth/google/callback`, 
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // You can use the profile info to create/find the user in your database
    const user = await User.findOrCreate({ googleId: profile.id });
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));
