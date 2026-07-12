const express = require('express');
const router = express.Router();
const { protect, authorize } = require('./auth');
const Department = require('../models/Department');

// @route   GET /api/settings/departments
// @desc    Get all active departments
router.get('/departments', async (req, res) => {
  try {
    const depts = await Department.find();
    res.json({ success: true, data: depts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/settings/departments
// @desc    Create a new department config
router.post('/departments', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const dept = await Department.create(req.body);
    res.status(201).json({ success: true, data: dept });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
