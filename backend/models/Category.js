const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide category name'],
    trim: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['CSR Activity', 'Challenge', 'General'],
    default: 'General'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
