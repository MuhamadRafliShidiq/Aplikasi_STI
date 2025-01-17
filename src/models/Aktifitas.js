const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users',
    },
    activity: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;
