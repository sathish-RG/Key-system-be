const mongoose = require('mongoose');

// ✅ The detailed chapter schema is defined here
const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  videoUrl: String,
  documentUrl: String,
  isUnlocked: { type: Boolean, default: false },
  duration: Number, // in minutes
  timerEnabled: { type: Boolean, default: true },

  mcqs: [{
    question: String,
    options: [String],
    correctAnswerIndex: Number,
    explanation: String
  }],

  tasks: [{
    type: { type: String, enum: ['online', 'offline'], required: true },
    title: String,
    description: String,
    deadline: Date,
    submissionLink: String // for online tasks
  }]
}, { timestamps: true }); // We need timestamps and the default _id for each chapter

// ✅ The course schema now correctly uses the detailed chapter schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: String,
  image: String,
  chapters: [chapterSchema], // Chapters are embedded here
  isPublished: { type: Boolean, default: false },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
}, { timestamps: true });


// ✅ This is the only model that should be exported from this file
module.exports = mongoose.models.Course || mongoose.model('Course', courseSchema);