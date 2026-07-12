const mongoose = require('mongoose');

const FindingSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Open', 'Resolved'],
    default: 'Open'
  }
});

const AuditSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide audit title'],
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
  leadAuditor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  auditDate: {
    type: Date,
    default: Date.now
  },
  findings: [FindingSchema],
  status: {
    type: String,
    enum: ['Planned', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Planned'
  }
}, { timestamps: true });

module.exports = mongoose.model('Audit', AuditSchema);
