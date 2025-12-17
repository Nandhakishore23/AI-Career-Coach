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
const axios = require('axios');

// @desc    Generate/Set Roadmap
// @route   POST /api/roadmap/generate
// @access  Private
router.post('/generate', protect, async (req, res) => {
    console.log("DEBUG: HIT GENERATE ROUTE - CHECKING FOR AI SERVICE");
    const {
        careerGoal, experienceLevel, targetCompany,
        weeklyHours, learningStyle, currentSkills, githubLink
    } = req.body;

    console.log('[Roadmap Gen] Requesting AI Roadmap for:', req.user.email);

    let generatedRoadmap = [];

    try {
        // Call Python AI Service
        const aiResponse = await axios.post('http://127.0.0.1:5002/generate-roadmap', {
            careerGoal, experienceLevel, targetCompany,
            weeklyHours, learningStyle, currentSkills
        });

        if (aiResponse.data && aiResponse.data.roadmap) {
            console.log('[Roadmap Gen] AI Success');
            generatedRoadmap = aiResponse.data.roadmap;
        } else {
            throw new Error('Invalid AI Response');
        }

    } catch (aiError) {
        console.error('[Roadmap Gen] AI Failed:', aiError.message);

        let statusCode = 500;
        let errorMessage = "AI Generation Failed. Please check server logs.";

        if (aiError.response) {
            console.error('[Roadmap Gen] AI Response Data:', aiError.response.data);
            if (aiError.response.status === 429) {
                statusCode = 429;
                errorMessage = "AI Service is busy (Rate Limit). Please wait 30 seconds and try again.";
            } else if (aiError.response.status === 503) {
                statusCode = 503;
                errorMessage = "AI Service is temporarily unavailable.";
            }
        }

        return res.status(statusCode).json({ message: errorMessage, error: aiError.message });
    }

    try {
        req.user.careerGoal = careerGoal;
        req.user.experienceLevel = experienceLevel;
        req.user.targetCompany = targetCompany;
        req.user.weeklyHours = weeklyHours;
        req.user.learningStyle = learningStyle;
        req.user.currentSkills = currentSkills;
        req.user.githubLink = githubLink;

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

// @desc    Get Detailed Content for a Topic
// @route   POST /api/roadmap/topic-content
// @access  Private
router.post('/topic-content', protect, async (req, res) => {
    const { topic, role } = req.body;
    try {
        const response = await axios.post('http://127.0.0.1:5002/generate-topic-content', {
            topic,
            level: req.user.experienceLevel, // Pass user's actual level
            role: req.user.careerGoal || role
        });
        res.json(response.data);
    } catch (error) {
        console.error("Content Gen Error:", error.message);
        res.status(500).json({ message: "Failed to generate content" });
    }
});

// @desc    Update Roadmap Step Status (Deep Nested Update)
// @route   PUT /api/roadmap/update-status
// @access  Private
router.put('/update-status', protect, async (req, res) => {
    const { phaseIndex, moduleIndex, topicIndex, status } = req.body;

    try {
        const user = req.user;

        if (!user.roadmap[phaseIndex]?.modules[moduleIndex]?.topics[topicIndex]) {
            return res.status(404).json({ message: 'Topic not found' });
        }

        user.roadmap[phaseIndex].modules[moduleIndex].topics[topicIndex].status = status;
        user.markModified('roadmap');
        await user.save();

        res.json(user.roadmap);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
