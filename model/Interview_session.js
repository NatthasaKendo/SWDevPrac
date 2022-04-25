const mongoose = require('mongoose');

const InterviewSessionSchema = new mongoose.Schema({
    date: {
        type: Date,
        require: true,
        unique: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'Hospital',
        required: true,
        unique: true,
    },
}); 

module.exports = mongoose.model('InterviewSession', InterviewSessionSchema);