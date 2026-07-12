const express = require('express');
const router = express.Router();
const { protect, authorize } = require('./auth');
const EsgPolicy = require('../models/EsgPolicy');
const PolicyAcknowledgement = require('../models/PolicyAcknowledgement');
const Audit = require('../models/Audit');
const ComplianceIssue = require('../models/ComplianceIssue');

// ==========================================
// ESG POLICIES ENDPOINTS
// ==========================================

// Get all policies
router.get('/policies', protect, async (req, res) => {
  try {
    const policies = await EsgPolicy.find().populate('owner', 'name email');
    res.json({ success: true, count: policies.length, data: policies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create policy
router.post('/policies', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const policy = await EsgPolicy.create({ ...req.body, owner: req.user.id });
    res.status(201).json({ success: true, data: policy });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Acknowledge a policy
router.post('/policies/:id/acknowledge', protect, async (req, res) => {
  try {
    const policy = await EsgPolicy.findById(req.params.id);
    if (!policy) {
      return res.status(404).json({ success: false, message: 'Policy not found' });
    }

    const duplicate = await PolicyAcknowledgement.findOne({
      policyId: policy._id,
      employeeId: req.user.id
    });

    if (duplicate) {
      return res.status(400).json({ success: false, message: 'You have already acknowledged this policy' });
    }

    const ack = await PolicyAcknowledgement.create({
      policyId: policy._id,
      employeeId: req.user.id,
      status: 'Acknowledged'
    });

    // Reward XP for policy reading completion
    req.user.xp += 25; // 25 XP
    await req.user.save();

    res.status(201).json({ success: true, data: ack });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get policy acknowledgments list
router.get('/acknowledgments', protect, async (req, res) => {
  try {
    const acks = await PolicyAcknowledgement.find()
      .populate('policyId', 'title')
      .populate('employeeId', 'name email');
    res.json({ success: true, count: acks.length, data: acks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// AUDITS ENDPOINTS
// ==========================================

// Get audits
router.get('/audits', protect, async (req, res) => {
  try {
    const audits = await Audit.find()
      .populate('departmentId', 'name code')
      .populate('leadAuditor', 'name email');
    res.json({ success: true, count: audits.length, data: audits });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create Audit
router.post('/audits', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const audit = await Audit.create({ ...req.body, leadAuditor: req.user.id });
    res.status(201).json({ success: true, data: audit });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ==========================================
// COMPLIANCE ISSUES ENDPOINTS
// ==========================================

// Get issues
router.get('/compliance', protect, async (req, res) => {
  try {
    const issues = await ComplianceIssue.find()
      .populate('auditId', 'title')
      .populate('owner', 'name email');
    res.json({ success: true, count: issues.length, data: issues });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create Compliance issue
router.post('/compliance', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const issue = await ComplianceIssue.create(req.body);
    
    // Automatically flag high/critical issues for notification triggers
    if (['High', 'Critical'].includes(issue.severity)) {
      console.log(`[ALERT] Flagged high severity compliance issue: "${issue.description}"`);
    }

    res.status(201).json({ success: true, data: issue });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Resolve issue and update Governance Score
router.put('/compliance/:id/resolve', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const issue = await ComplianceIssue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Compliance issue not found' });
    }

    issue.status = 'Resolved';
    await issue.save();

    // Recover governance score for department
    const user = await User.findById(issue.owner);
    if (user && user.departmentId) {
      const dept = await mongoose.model('Department').findById(user.departmentId);
      if (dept) {
        dept.governanceScore = Math.min(100, dept.governanceScore + 5); // Recover 5 points
        await dept.save();
      }
    }

    res.json({ success: true, data: issue });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
