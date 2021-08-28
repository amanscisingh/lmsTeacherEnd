const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    classCode: {
        type: String,
        required: true
    },
    profEmail : {
        type: String,
        required: true
    },
    fileUploadName: {
        type: String,
        required: true
    },
    type: {  // assignment or test
        type: String,
        required: true,
        default: 'assignment'
    },
    allSubmissions: [
        {
            type: String,
            required: false
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('allAssignments', assignmentSchema);