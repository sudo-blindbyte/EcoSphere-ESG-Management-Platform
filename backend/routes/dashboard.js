const express = require('express');
const router = express.Router();
const { protect } = require('./auth');
const Department = require('../models/Department');
const CarbonTransaction = require('../models/CarbonTransaction');
const EsgGoal = require('../models/EsgGoal');
const CsrActivity = require('../models/CsrActivity');
const EsgPolicy = require('../models/EsgPolicy');
const Audit = require('../models/Audit');
const ComplianceIssue = require('../models/ComplianceIssue');

// @route   GET /api/dashboard/kpi
// @desc    Get aggregated ESG overview scorecard KPI statistics
router.get('/kpi', protect, async (req, res) => {
  try {
    // Environmental aggregation
    const totalCO2Txns = await CarbonTransaction.find({ state: 'Verified' });
    const totalCO2e = totalCO2Txns.reduce((acc, curr) => acc + curr.calculatedCO2e, 0);
    const activeGoals = await EsgGoal.countDocuments({ status: 'Active' });
    
    // Social aggregation
    const totalCSR = await CsrActivity.countDocuments({ status: 'Completed' });
    
    // Governance aggregation
    const activePolicies = await EsgPolicy.countDocuments({ status: 'Active' });
    const openCompliance = await ComplianceIssue.countDocuments({ status: 'Open' });
    const completedAudits = await Audit.countDocuments({ status: 'Completed' });

    // Aggregate department averages
    const depts = await Department.find({ status: 'active' });
    let avgEnv = 0, avgSoc = 0, avgGov = 0, avgOverall = 0;
    
    if (depts.length > 0) {
      avgEnv = depts.reduce((acc, curr) => acc + curr.environmentalScore, 0) / depts.length;
      avgSoc = depts.reduce((acc, curr) => acc + curr.socialScore, 0) / depts.length;
      avgGov = depts.reduce((acc, curr) => acc + curr.governanceScore, 0) / depts.length;
      avgOverall = depts.reduce((acc, curr) => acc + curr.totalScore, 0) / depts.length;
    }

    res.json({
      success: true,
      data: {
        environmental: {
          score: Math.round(avgEnv),
          totalCO2e: Math.round(totalCO2e),
          activeGoals
        },
        social: {
          score: Math.round(avgSoc),
          totalCSRActivities: totalCSR
        },
        governance: {
          score: Math.round(avgGov),
          activePolicies,
          completedAudits,
          openComplianceIssues: openCompliance
        },
        overall: {
          score: Math.round(avgOverall)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
