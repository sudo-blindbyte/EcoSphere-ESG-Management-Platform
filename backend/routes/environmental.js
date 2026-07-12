const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { protect, authorize } = require('./auth');
const EmissionFactor = require('../models/EmissionFactor');
const CarbonTransaction = require('../models/CarbonTransaction');
const EsgGoal = require('../models/EsgGoal');
const Department = require('../models/Department');

// ==========================================
// EMISSION FACTORS ENDPOINTS
// ==========================================

// Get all factors
router.get('/factors', protect, async (req, res) => {
  try {
    const factors = await EmissionFactor.find({ status: 'active' });
    res.json({ success: true, count: factors.length, data: factors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new factor (Manager/Admin)
router.post('/factors', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const factor = await EmissionFactor.create(req.body);
    res.status(201).json({ success: true, data: factor });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ==========================================
// CARBON TRANSACTIONS ENDPOINTS
// ==========================================

// Get all carbon transactions
router.get('/transactions', protect, async (req, res) => {
  try {
    const transactions = await CarbonTransaction.find()
      .populate('departmentId', 'name code')
      .populate('emissionFactorId', 'name category scope unit');
    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a carbon transaction (performs auto calculation in model middleware)
router.post('/transactions', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const transaction = new CarbonTransaction(req.body);
    await transaction.save();
    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update transaction status (Verified status updates Department Score)
router.put('/transactions/:id/state', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const { state } = req.body;
    const transaction = await CarbonTransaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    transaction.state = state;
    await transaction.save();

    // If verified, update the environmental score of the department
    if (state === 'Verified' && transaction.departmentId) {
      const dept = await Department.findById(transaction.departmentId);
      if (dept) {
        // Mock score recalculation: higher emissions decrease score
        const emissionsPenalty = (transaction.calculatedCO2e / 1000) * 0.1; 
        dept.environmentalScore = Math.max(10, Math.min(100, dept.environmentalScore - emissionsPenalty));
        await dept.save();
      }
    }

    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ==========================================
// ESG GOALS ENDPOINTS
// ==========================================

// Get goals
router.get('/goals', protect, async (req, res) => {
  try {
    const goals = await EsgGoal.find().populate('departmentId', 'name code');
    res.json({ success: true, count: goals.length, data: goals });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a goal
router.post('/goals', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const goal = await EsgGoal.create(req.body);
    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update Goal progress
router.put('/goals/:id/progress', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const { currentValue } = req.body;
    const goal = await EsgGoal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    goal.currentValue = currentValue;
    if (currentValue >= goal.targetValue) {
      goal.status = 'Achieved';
    } else {
      goal.status = 'Active';
    }

    await goal.save();
    res.json({ success: true, data: goal });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
