const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');



const TopicSchema = new mongoose.Schema({
    title: String,
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Beginner-Intermediate', 'Intermediate-Advanced'] },
    outcome: String,
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    }
}, { _id: false });

const ModuleSchema = new mongoose.Schema({
    title: String,
    topics: [TopicSchema]
}, { _id: false });

const PhaseSchema = new mongoose.Schema({
    title: String,
    modules: [ModuleSchema]
}, { _id: false });

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    careerGoal: {
        type: String, // e.g., "Frontend Developer"
    },
    experienceLevel: {
        type: String, // e.g., "Junior"
    },
    targetCompany: {
        type: String, // e.g., "FAANG", "Startup", "Service-Based"
    },
    weeklyHours: {
        type: Number, // e.g., 10
    },
    learningStyle: {
        type: String, // e.g., "Video", "Text", "Project"
    },
    currentSkills: [String], // e.g., ["HTML", "CSS"]
    githubLink: String,
    roadmap: [PhaseSchema], // Changed from flat roadmap to Phases
    createdAt: {
        type: Date,
        default: Date.now
    },
    streak: {
        type: Number,
        default: 0
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt
// Encrypt password using bcrypt
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
