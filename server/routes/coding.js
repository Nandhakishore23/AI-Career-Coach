const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc    Mark a problem as solved
// @route   POST /api/coding/solved
// @access  Private
router.post('/solved', protect, async (req, res) => {
    const { problemId, title, difficulty, language } = req.body;

    if (!problemId || !title) {
        return res.status(400).json({ message: 'problemId and title are required' });
    }

    try {
        const user = await User.findById(req.user._id);

        // Check if already solved (avoid duplicates)
        const alreadySolved = user.solvedProblems?.some(p => p.problemId === problemId);
        if (alreadySolved) {
            return res.json({ message: 'Already solved', solvedProblems: user.solvedProblems });
        }

        user.solvedProblems.push({
            problemId,
            title,
            difficulty: difficulty || 'Easy',
            language: language || 'python',
            solvedAt: new Date()
        });

        await user.save();

        res.json({
            message: 'Problem marked as solved!',
            solvedProblems: user.solvedProblems
        });
    } catch (error) {
        console.error('Error marking problem solved:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get coding stats (solved problems list + counts)
// @route   GET /api/coding/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const solved = user.solvedProblems || [];

        const stats = {
            total: solved.length,
            easy: solved.filter(p => p.difficulty === 'Easy').length,
            medium: solved.filter(p => p.difficulty === 'Medium').length,
            hard: solved.filter(p => p.difficulty === 'Hard').length,
            recentSolves: solved.slice(-5).reverse(), // Last 5
            solvedIds: solved.map(p => p.problemId)
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
