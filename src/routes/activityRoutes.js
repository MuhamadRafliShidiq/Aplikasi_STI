const express = require('express');
const router = express.Router();
const { logActivity, getActivityLogs } = require('../controllers/activityController');

// Route untuk mencatat aktivitas pengguna
router.post('/', logActivity);
router.get('/', getActivityLogs);

module.exports = router;
