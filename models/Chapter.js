const mongoose = require('mongoose');

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
}, { _id: false }); // optional if you want embedded docs without their own _id

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  image: String,

  chapters: [chapterSchema], // Embedded directly

  isPublished: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('chapter', chapterSchema);
