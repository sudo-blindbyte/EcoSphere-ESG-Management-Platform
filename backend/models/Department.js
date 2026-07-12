const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide department name'],
    trim: true,
    unique: true
  },
  code: {
    type: String,
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: 10
  },
  head: {
    type: String,
    trim: true
  },
  parentDepartment: {
    type: String,
    trim: true
  },
  employeeCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  environmentalScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  socialScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  governanceScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  totalScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, { timestamps: true });

// Pre-save hook to calculate the overall weighted ESG score
DepartmentSchema.pre('save', function (next) {
  // Configurable weights, defaulting to E: 40%, S: 30%, G: 30%
  const weightEnv = 0.4;
  const weightSoc = 0.3;
  const weightGov = 0.3;

  this.totalScore = (this.environmentalScore * weightEnv) +
                     (this.socialScore * weightSoc) +
                     (this.governanceScore * weightGov);
  next();
});

module.exports = mongoose.model('Department', DepartmentSchema);
