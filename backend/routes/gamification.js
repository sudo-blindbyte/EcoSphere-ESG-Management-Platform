const express = require('express');
const router = express.Router();
const { protect, authorize } = require('./auth');
const Challenge = require('../models/Challenge');
const ChallengeParticipation = require('../models/ChallengeParticipation');
const Badge = require('../models/Badge');
const Reward = require('../models/Reward');
const User = require('../models/User');

// ==========================================
// CHALLENGES ENDPOINTS
// ==========================================

// Get all challenges
router.get('/challenges', protect, async (req, res) => {
  try {
    const challenges = await Challenge.find().populate('category', 'name type');
    res.json({ success: true, count: challenges.length, data: challenges });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Join a challenge
router.post('/challenges/:id/join', protect, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    const duplicate = await ChallengeParticipation.findOne({
      challengeId: challenge._id,
      employeeId: req.user.id
    });
    if (duplicate) {
      return res.status(400).json({ success: false, message: 'You have already joined this challenge' });
    }

    const participation = await ChallengeParticipation.create({
      challengeId: challenge._id,
      employeeId: req.user.id,
      progress: 0,
      approvalStatus: 'Pending'
    });

    res.status(201).json({ success: true, data: participation });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update challenge progress & check Badge auto-award
router.put('/participations/:id/progress', protect, async (req, res) => {
  try {
    const { progress, proofUrl } = req.body;
    const participation = await ChallengeParticipation.findById(req.params.id).populate('challengeId');
    if (!participation) {
      return res.status(404).json({ success: false, message: 'Participation record not found' });
    }

    if (participation.employeeId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized action' });
    }

    participation.progress = progress;
    if (proofUrl) participation.proofUrl = proofUrl;

    if (progress >= 100) {
      participation.approvalStatus = 'Approved';
      participation.xpAwarded = participation.challengeId.xp;

      // Award XP
      req.user.xp += participation.xpAwarded;
      await req.user.save();

      // Badge auto-award check
      const completedChallengesCount = await ChallengeParticipation.countDocuments({
        employeeId: req.user.id,
        progress: 100
      });

      // Find badge that fits rule criteria matching count
      const matchedBadge = await Badge.findOne({ xpThreshold: { $lte: req.user.xp } }).sort({ xpThreshold: -1 });
      if (matchedBadge) {
        console.log(`[BADGE UNLOCKED] Employee ${req.user.name} earned: ${matchedBadge.name}`);
      }
    }

    await participation.save();
    res.json({ success: true, data: participation });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ==========================================
// BADGES ENDPOINTS
// ==========================================

router.get('/badges', protect, async (req, res) => {
  try {
    const badges = await Badge.find();
    res.json({ success: true, count: badges.length, data: badges });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// REWARDS & REDEMPTIONS ENDPOINTS
// ==========================================

router.get('/rewards', protect, async (req, res) => {
  try {
    const rewards = await Reward.find({ status: 'active' });
    res.json({ success: true, count: rewards.length, data: rewards });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Redeem a Reward (deducts points/XP on purchase validation)
router.post('/rewards/:id/redeem', protect, async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);
    if (!reward) {
      return res.status(404).json({ success: false, message: 'Reward not found' });
    }

    if (reward.stock <= 0) {
      return res.status(400).json({ success: false, message: 'Reward is out of stock' });
    }

    if (req.user.xp < reward.pointsRequired) {
      return res.status(400).json({ success: false, message: 'Insufficient XP/Points balance to redeem' });
    }

    // Deduct points from user
    req.user.xp -= reward.pointsRequired;
    await req.user.save();

    // Deduct stock from Reward catalog
    reward.stock -= 1;
    await reward.save();

    res.json({
      success: true,
      message: `Successfully redeemed ${reward.name}!`,
      remainingXp: req.user.xp
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// GLOBAL LEADERBOARD ENDPOINT
// ==========================================
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const leaderboard = await User.find()
      .select('name email xp departmentId')
      .populate('departmentId', 'name')
      .sort({ xp: -1 })
      .limit(10);
    res.json({ success: true, data: leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
