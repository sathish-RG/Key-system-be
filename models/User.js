const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firebaseUID: {
    type: String,
    required: true,
    unique: true,
  },
  name: String, // Stays 'name' for consistency
  // AFTER
phoneNumber: {
  type: String,
  required: true,
  unique: true, // ✅ Add this line
},
  role: {
    type: String,
    enum: ['member', 'admin'],
    default: 'member',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);