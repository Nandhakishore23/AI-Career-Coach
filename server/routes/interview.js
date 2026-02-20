const express = require('express');
const axios = require('axios');
const router = express.Router();

// Middleware to protect routes (optional for now, but good practice)
const { protect } = require('../middleware/authMiddleware');
const Interview = require('../models/Interview');

// @route   POST /api/interview/start
// @desc    Start an AI Mock Interview session
// @access  Private
router.post('/start', protect, async (req, res) => {
    try {
        const { role, topic, difficulty, resume } = req.body;
        console.log(`[Interview] Starting session for ${req.user.email}: ${role} - ${topic}`);

        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:5002';

        // Call AI Service
        const aiResponse = await axios.post(`${aiServiceUrl}/interview/start`, {
            role,
            topic,
            difficulty,
            resume // Pass base64 resume
        });

        res.json(aiResponse.data);

    } catch (error) {
        console.error('[Interview] Start Error:', error.message);
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        res.status(500).json({ message: 'Failed to start interview session' });
    }
});

// @route   POST /api/interview/analyze
// @desc    Submit an answer and get feedback
// @access  Private
router.post('/analyze', protect, async (req, res) => {
    try {
        const { question, answer, role } = req.body;
        console.log(`[Interview] Analyzing answer for ${req.user.email}`);

        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:5002';

        // Call AI Service
        const aiResponse = await axios.post(`${aiServiceUrl}/interview/analyze`, {
            question,
            answer,
            role
        });

        res.json(aiResponse.data);

    } catch (error) {
        console.error('[Interview] Analysis Error:', error.message);
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        res.status(500).json({ message: 'Failed to analyze answer' });
    }
});

// @route   POST /api/interview/end
// @desc    End interview and get report
// @access  Private
router.post('/end', protect, async (req, res) => {
    try {
        const { history, role } = req.body;
        console.log(`[Interview] Ending session for ${req.user.email}`);

        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:5002';

        // Call AI Service
        const aiResponse = await axios.post(`${aiServiceUrl}/interview/end`, {
            history,
            role
        });

        const report = aiResponse.data;

        // Save to Database
        const newInterview = new Interview({
            user: req.user._id,
            role: role,
            topic: history[0]?.question ? "General" : "Custom", // Simple fallback
            overall_score: report.overall_score,
            feedback_summary: report.summary,
            strengths: report.strengths,
            weaknesses: report.weaknesses,
            suggestion: report.suggestion,
            history: history
        });

        await newInterview.save();
        console.log(`[Interview] Saved report for user ${req.user._id}`);

        res.json(report);

    } catch (error) {
        console.error('[Interview] Report Error:', error.message);
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        res.status(500).json({ message: 'Failed to generate report' });
    }
});

// @route   GET /api/interview/history
// @desc    Get user's past interviews
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const interviews = await Interview.find({ user: req.user._id })
            .sort({ createdAt: -1 }); // Newest first
        res.json(interviews);
    } catch (error) {
        console.error('[Interview] History Error:', error.message);
        res.status(500).json({ message: 'Failed to fetch interview history' });
    }
});

module.exports = router;
