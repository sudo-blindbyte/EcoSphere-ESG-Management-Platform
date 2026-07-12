const mongoose = require('mongoose');

const ComplianceIssueSchema = new mongoose.Schema({
  auditId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Audit' // Can be null if manual incident report
  },
  description: {
    type: String,
    required: [true, 'Please provide issue details']
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please assign a compliance owner']
  },
  dueDate: {
    type: Date,
    required: [true, 'Please select a resolution due date']
  },
  status: {
    type: String,
    enum: ['Open', 'Under Investigation', 'Resolved', 'Closed'],
    default: 'Open'
  }
}, { timestamps: true });

module.exports = mongoose.model('ComplianceIssue', ComplianceIssueSchema);
