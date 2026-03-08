const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc    Submit assessment result
// @route   POST /api/assessment/submit
// @access  Private
router.post('/submit', protect, async (req, res) => {
    try {
        const { topic, score, total, difficulty } = req.body;

        const percentage = (score / total) * 100;
        let badge = null;
        if (percentage === 100) badge = 'Diamond';
        else if (percentage >= 80) badge = 'Gold';
        else if (percentage >= 60) badge = 'Silver';
        else badge = 'Bronze';

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if skill exists
        const existingSkillIndex = user.skills.findIndex(s => s.name === topic);

        if (existingSkillIndex !== -1) {
            // Update existing skill if new score is better or same
            if (percentage >= user.skills[existingSkillIndex].score) {
                user.skills[existingSkillIndex].score = percentage;
                user.skills[existingSkillIndex].badge = badge;
                user.skills[existingSkillIndex].level = difficulty;
                user.skills[existingSkillIndex].date = Date.now();
            }
        } else {
            // Add new skill
            user.skills.push({
                name: topic,
                level: difficulty,
                score: percentage,
                badge: badge,
                date: Date.now()
            });
        }

        // Add to streak if not already updated today (Optional logic, keeping simple for now)
        // user.streak += 1; 

        await user.save();

        res.status(200).json({
            message: 'Assessment saved',
            badge,
            skills: user.skills
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
