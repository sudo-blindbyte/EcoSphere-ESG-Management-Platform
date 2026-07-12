const mongoose = require('mongoose');

const EsgGoalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please specify the ESG goal name'],
    trim: true
  },
  description: {
    type: String
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  pillar: {
    type: String,
    enum: ['Environmental', 'Social', 'Governance'],
    required: true
  },
  targetValue: {
    type: Number,
    required: true
  },
  currentValue: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Draft', 'Active', 'Achieved', 'Missed', 'Cancelled'],
    default: 'Draft'
  }
}, { timestamps: true });

module.exports = mongoose.model('EsgGoal', EsgGoalSchema);
