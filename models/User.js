const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true, 
    match: [/.+\@.+\..+/, 'Please fill a valid email address'] 
  },
  password: { 
    type: String, 
    required: true 
  },
  twoFactorSecret: { 
    type: String 
  },
  isGoogleConnected: { 
    type: Boolean, 
    default: false 
  },
});

// hashing password
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
