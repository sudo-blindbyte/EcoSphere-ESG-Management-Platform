const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please specify the challenge title'],
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  xp: {
    type: Number,
    default: 100
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  evidenceRequired: {
    type: Boolean,
    default: true
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Draft', 'Active', 'Under Review', 'Completed', 'Archived'],
    default: 'Draft'
  }
}, { timestamps: true });

module.exports = mongoose.model('Challenge', ChallengeSchema);
