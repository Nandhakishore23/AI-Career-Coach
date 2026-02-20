const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Helper
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

// Test Route
router.get('/', (req, res) => res.send('Auth Route Working'));

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {

            // Streak Calculation Logic
            const now = new Date();
            // Default to yesterday if first time to allow streak=1
            const lastLogin = user.lastLogin ? new Date(user.lastLogin) : new Date(now.getTime() - 86400000);

            // Reset hours to compare dates only
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
            const last = new Date(lastLogin.getFullYear(), lastLogin.getMonth(), lastLogin.getDate()).getTime();
            const oneDay = 24 * 60 * 60 * 1000;
            const diff = today - last;

            if (diff === oneDay) {
                // Consecutive day
                user.streak = (user.streak || 0) + 1;
            } else if (diff > oneDay) {
                // Broken streak
                user.streak = 1;
            } else if (diff === 0 && (!user.streak || user.streak === 0)) {
                // First login of the day (fresh)
                user.streak = 1;
            }

            user.lastLogin = now;
            await user.save();

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                streak: user.streak,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) return res.status(401).json({ message: 'User not found' });
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            careerGoal: user.careerGoal,
            experienceLevel: user.experienceLevel,
            targetCompany: user.targetCompany,
            weeklyHours: user.weeklyHours,
            learningStyle: user.learningStyle,
            currentSkills: user.currentSkills,
            skills: user.skills, // Calculated badges
            streak: user.streak,
            createdAt: user.createdAt,
            roadmap: user.roadmap, // Needed for stats
            solvedProblems: user.solvedProblems || []
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
