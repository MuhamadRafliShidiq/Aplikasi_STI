const express = require('express');
const {
    getRiwayatById,
    createRiwayat,
    getRiwayat,
    updateRiwayat,
    deleteRiwayat,
    getRiwayats,
} = require('../controllers/riwayatController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware')
const router = express.Router();

// Protected routes
router.post('/', createRiwayat)
router.get('/:id', getRiwayatById); // Get user by ID
router.get('/', getRiwayat); // Get all users
router.put('/:id', updateRiwayat); // Update user
router.delete('/:id', deleteRiwayat); // Delete user

module.exports = router;