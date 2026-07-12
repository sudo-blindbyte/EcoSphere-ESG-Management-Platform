const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please specify the badge name'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  unlockRule: {
    type: String,
    required: [true, 'Define rule criteria, e.g. XP threshold value or Challenge count'],
    trim: true
  },
  xpThreshold: {
    type: Number,
    default: 0
  },
  icon: {
    type: String,
    default: 'fa-trophy' // FontAwesome icon class
  }
}, { timestamps: true });

module.exports = mongoose.model('Badge', BadgeSchema);
