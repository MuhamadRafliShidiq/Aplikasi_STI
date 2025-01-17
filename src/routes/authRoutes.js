const express = require('express');

const { loginUser } = require('../controllers/authController')
const router = express.Router();

// Public routes
router.post('/', loginUser);

module.exports = router;

