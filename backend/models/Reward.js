const mongoose = require('mongoose');

const RewardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please specify the reward name'],
    trim: true
  },
  description: {
    type: String
  },
  pointsRequired: {
    type: Number,
    required: [true, 'Please provide points required to redeem'],
    min: [1, 'Required points must be greater than zero']
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock count cannot be negative']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Reward', RewardSchema);
