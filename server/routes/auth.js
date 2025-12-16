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

module.exports = router;
