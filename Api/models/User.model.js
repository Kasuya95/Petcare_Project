const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN', 'SERVICE'], default: 'USER' },
  image: { type: String }, // Profile image URL
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);