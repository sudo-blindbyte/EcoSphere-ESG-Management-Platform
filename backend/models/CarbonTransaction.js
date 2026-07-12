const mongoose = require('mongoose');

const CarbonTransactionSchema = new mongoose.Schema({
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  emissionFactorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmissionFactor',
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide transaction quantity'],
    min: [0, 'Quantity cannot be negative']
  },
  calculatedCO2e: {
    type: Number, // Stores the computed kg CO2e emissions
    default: 0
  },
  sourceModule: {
    type: String,
    enum: ['Purchase', 'Manufacturing', 'Expenses', 'Fleet', 'Manual'],
    default: 'Manual'
  },
  sourceId: {
    type: String, // References internal record id from Odoo/ERP context
    trim: true
  },
  transactionDate: {
    type: Date,
    default: Date.now
  },
  state: {
    type: String,
    enum: ['Draft', 'Confirmed', 'Verified', 'Cancelled'],
    default: 'Draft'
  }
}, { timestamps: true });

// Pre-save auto emission calculation logic
CarbonTransactionSchema.pre('save', async function(next) {
  try {
    const factor = await mongoose.model('EmissionFactor').findById(this.emissionFactorId);
    if (!factor) {
      throw new Error('Emission factor not found for calculation');
    }
    this.calculatedCO2e = this.quantity * factor.factorValue;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('CarbonTransaction', CarbonTransactionSchema);
