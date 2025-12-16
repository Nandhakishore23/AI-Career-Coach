const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to protect routes (basic implementation)
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// @desc    Get User Roadmap
// @route   GET /api/roadmap
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({
            careerGoal: user.careerGoal,
            experienceLevel: user.experienceLevel,
            roadmap: user.roadmap,
            streak: user.streak || 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Generate/Set Roadmap
// @route   POST /api/roadmap/generate
// @access  Private
const roadmaps = require('../data/roadmaps');

// @desc    Generate/Set Roadmap
// @route   POST /api/roadmap/generate
// @access  Private
router.post('/generate', protect, async (req, res) => {
    const { careerGoal, experienceLevel } = req.body;

    // Get Roadmap from data file
    let generatedRoadmap = roadmaps[careerGoal] || roadmaps['Frontend Developer']; // Default fallback

    // Simple adjustment for experience (Mock Logic)
    // If Senior, we might mark early steps as completed, but for now we give full roadmap
    // with a slightly modified status to show we care about the level.
    if (experienceLevel === 'Senior (5+ years)') {
        generatedRoadmap = generatedRoadmap.map((step, index) => ({
            ...step,
            status: index < 3 ? 'completed' : 'pending' // Auto-complete basics
        }));
    } else if (experienceLevel === 'Mid-Level (3-5 years)') {
        generatedRoadmap = generatedRoadmap.map((step, index) => ({
            ...step,
            status: index < 1 ? 'completed' : 'pending'
        }));
    }

    try {
        req.user.careerGoal = careerGoal;
        req.user.experienceLevel = experienceLevel;
        req.user.roadmap = generatedRoadmap;
        await req.user.save();

        res.json({
            careerGoal: req.user.careerGoal,
            roadmap: req.user.roadmap
        });
    } catch (error) {
        console.error("Roadmap Generation Error:", error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update Roadmap Step Status
// @route   PUT /api/roadmap/update-status
// @access  Private
router.put('/update-status', protect, async (req, res) => {
    const { index, status } = req.body;
    console.log(`[Roadmap Update] User: ${req.user._id} Index: ${index} Status: ${status}`);

    try {
        if (!req.user.roadmap || !req.user.roadmap[index]) {
            console.error('[Roadmap Update] Step not found');
            return res.status(404).json({ message: 'Roadmap step not found' });
        }

        req.user.roadmap[index].status = status;
        req.user.markModified('roadmap'); // Force Mongoose to convert the change

        await req.user.save();
        console.log('[Roadmap Update] Success');

        res.json(req.user.roadmap);
    } catch (error) {
        console.error("Update Status Error:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
