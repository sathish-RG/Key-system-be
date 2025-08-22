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
  name: String,
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['member', 'admin'],
    default: 'member',
  },
  // ✅ ADD THIS FIELD to track which courses a member can access
  accessibleCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }]
}, {
  timestamps: true,
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);