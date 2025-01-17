const express = require('express');
const {
    getLaporanById,
    createLaporan,
    getLaporans,
    updateLaporan,
    deleteLaporan,
} = require('../controllers/laporanController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware')
const router = express.Router();

// Protected routes
router.post('/', createLaporan)
router.get('/:id', getLaporanById); // Get user by ID
router.get('/', getLaporans); // Get all users
router.put('/:id', updateLaporan); // Update user
router.delete('/:id', deleteLaporan); // Delete user

module.exports = router;