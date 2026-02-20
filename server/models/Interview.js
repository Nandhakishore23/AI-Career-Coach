const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    overall_score: {
        type: Number,
        required: true
    },
    feedback_summary: {
        type: String
    },
    strengths: [String],
    weaknesses: [String],
    suggestion: String,
    history: [
        {
            question: String,
            answer: String,
            score: Number,
            feedback: String
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Interview', InterviewSchema);
