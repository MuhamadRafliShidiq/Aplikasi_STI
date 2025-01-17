const express = require('express');
const {
    getStokById,
    createStok,
    getStoks,
    updateStok,
    deleteStok,
} = require('../controllers/stokController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware')
const router = express.Router();

// Protected routes
router.post('/', createStok)
router.get('/:id', getStokById); // Get user by ID
router.get('/', getStoks); // Get all users
router.put('/:id', updateStok); // Update user
router.delete('/:id', deleteStok); // Delete user

module.exports = router;