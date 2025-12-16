const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ResourceSchema = new mongoose.Schema({
    title: String,
    url: String,
    type: String
}, { _id: false });

const DetailsSchema = new mongoose.Schema({
    summary: String,
    keyTerms: [String],
    resources: [ResourceSchema]
}, { _id: false });

const RoadmapStepSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    details: DetailsSchema
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
    roadmap: [RoadmapStepSchema],
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
