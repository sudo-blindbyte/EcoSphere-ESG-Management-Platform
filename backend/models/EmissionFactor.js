const mongoose = require('mongoose');

const EmissionFactorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide emission factor source name'],
    trim: true
  },
  category: {
    type: String,
    enum: ['energy', 'transport', 'waste', 'water', 'materials', 'travel', 'other'],
    required: true
  },
  scope: {
    type: String,
    enum: ['scope1', 'scope2', 'scope3'],
    required: true
  },
  factorValue: {
    type: Number,
    required: [true, 'Please specify factor value (kg CO2e per unit)'],
    min: [0, 'Factor value cannot be negative']
  },
  unit: {
    type: String,
    required: true,
    trim: true
  },
  sourceReference: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('EmissionFactor', EmissionFactorSchema);
