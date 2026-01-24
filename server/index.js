const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5005;

// Connect to Database
connectDB();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
});
const authRoutes = require('./routes/auth');
const roadmapRoutes = require('./routes/roadmap');

// Routes - Support both /api/* and root * for robust deployment
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/roadmap', roadmapRoutes);
app.use('/roadmap', roadmapRoutes);

app.get('/', (req, res) => {
    res.send('AI Interview Coach Server is Running');
});

// Export for Vercel
module.exports = app;

// Only listen if run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
