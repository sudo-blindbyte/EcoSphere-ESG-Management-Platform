const mongoose = require('mongoose');

const CsrActivitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide CSR activity title'],
    trim: true
  },
  description: {
    type: String
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activityDate: {
    type: Date,
    required: true
  },
  location: {
    type: String
  },
  pointsReward: {
    type: Number,
    default: 50
  },
  status: {
    type: String,
    enum: ['Planning', 'Open', 'Completed', 'Cancelled'],
    default: 'Planning'
  }
}, { timestamps: true });

module.exports = mongoose.model('CsrActivity', CsrActivitySchema);
