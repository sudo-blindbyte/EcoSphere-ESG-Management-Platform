const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { protect, authorize } = require('./auth');
const CsrActivity = require('../models/CsrActivity');
const EmployeeParticipation = require('../models/EmployeeParticipation');
const User = require('../models/User');

// ==========================================
// CSR ACTIVITIES ENDPOINTS
// ==========================================

// Get all activities
router.get('/activities', protect, async (req, res) => {
  try {
    const activities = await CsrActivity.find().populate('organizer', 'name email');
    res.json({ success: true, count: activities.length, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new CSR Activity
router.post('/activities', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const activity = await CsrActivity.create({
      ...req.body,
      organizer: req.user.id
    });
    res.status(201).json({ success: true, data: activity });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ==========================================
// PARTICIPATIONS ENDPOINTS
// ==========================================

// Get all participation requests
router.get('/participations', protect, async (req, res) => {
  try {
    const participations = await EmployeeParticipation.find()
      .populate('employeeId', 'name email')
      .populate('activityId', 'title activityDate pointsReward');
    res.json({ success: true, count: participations.length, data: participations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Employee registers for an activity
router.post('/participations/register', protect, async (req, res) => {
  try {
    const { activityId } = req.body;
    
    // Check duplication
    const duplicate = await EmployeeParticipation.findOne({
      employeeId: req.user.id,
      activityId
    });
    if (duplicate) {
      return res.status(400).json({ success: false, message: 'You have already registered for this activity' });
    }

    const participation = await EmployeeParticipation.create({
      employeeId: req.user.id,
      activityId,
      approvalStatus: 'Pending'
    });

    res.status(201).json({ success: true, data: participation });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Submit evidence proof (URL or file link)
router.put('/participations/:id/evidence', protect, async (req, res) => {
  try {
    const { proofUrl } = req.body;
    const participation = await EmployeeParticipation.findById(req.params.id);
    if (!participation) {
      return res.status(404).json({ success: false, message: 'Participation record not found' });
    }

    // Only allow registered user to add evidence
    if (participation.employeeId.toString() !== req.user.id && req.user.role === 'user') {
      return res.status(403).json({ success: false, message: 'Unauthorized action' });
    }

    participation.proofUrl = proofUrl;
    await participation.save();
    res.json({ success: true, data: participation });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

const Department = require('../models/Department');

// Manager approves/rejects participation and awards XP
router.put('/participations/:id/approve', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const { approvalStatus, proofUrl } = req.body;
    const participation = await EmployeeParticipation.findById(req.params.id).populate('activityId');
    if (!participation) {
      return res.status(404).json({ success: false, message: 'Participation record not found' });
    }

    participation.approvalStatus = approvalStatus;
    if (approvalStatus === 'Approved') {
      participation.proofUrl = proofUrl || participation.proofUrl || 'https://proof-placeholder.com/file';
      participation.pointsEarned = participation.activityId.pointsReward;
      participation.completionDate = new Date();

      // Award XP to the user
      const user = await User.findById(participation.employeeId);
      if (user) {
        user.xp += participation.pointsEarned;
        await user.save();

        // Update Department Social Score (only if user has a department linked)
        if (user.departmentId) {
          const dept = await Department.findById(user.departmentId);
          if (dept) {
            dept.socialScore = Math.min(100, dept.socialScore + 2); // 2 points per CSR activity approval
            await dept.save();
          }
        }
      }
    } else {
      participation.pointsEarned = 0;
    }

    await participation.save();
    res.json({ success: true, data: participation });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
