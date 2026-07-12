const mongoose = require('mongoose');

const EsgPolicySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please specify governance policy title'],
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  effectiveDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Draft', 'Active', 'Under Review', 'Archived'],
    default: 'Draft'
  }
}, { timestamps: true });

module.exports = mongoose.model('EsgPolicy', EsgPolicySchema);
