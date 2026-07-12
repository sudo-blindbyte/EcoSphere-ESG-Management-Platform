const mongoose = require('mongoose');

const PolicyAcknowledgementSchema = new mongoose.Schema({
  policyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EsgPolicy',
    required: true
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  acknowledgedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Pending', 'Acknowledged'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('PolicyAcknowledgement', PolicyAcknowledgementSchema);
