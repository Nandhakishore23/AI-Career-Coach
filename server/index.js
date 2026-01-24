const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5005;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
});
app.use('/api/auth', require('./routes/auth'));
app.use('/api/roadmap', require('./routes/roadmap'));

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
