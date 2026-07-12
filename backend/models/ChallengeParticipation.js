const mongoose = require('mongoose');

const ChallengeParticipationSchema = new mongoose.Schema({
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  proofUrl: {
    type: String
  },
  approvalStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  xpAwarded: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('ChallengeParticipation', ChallengeParticipationSchema);
