const mongoose = require('mongoose');

const EmployeeParticipationSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CsrActivity',
    required: true
  },
  proofUrl: {
    type: String,
    trim: true
  },
  approvalStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  completionDate: {
    type: Date
  }
}, { timestamps: true });

// Check evidence requirement (requires proof file if enabled in config)
EmployeeParticipationSchema.pre('validate', function(next) {
  // If status is being set to Approved, we check if proofUrl is present
  if (this.approvalStatus === 'Approved' && !this.proofUrl) {
    return next(new Error('Evidence proof file required to approve CSR participation'));
  }
  next();
});

module.exports = mongoose.model('EmployeeParticipation', EmployeeParticipationSchema);
