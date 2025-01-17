const express = require('express');
const {
    getAsetById,
    createAset,
    getAsets,
    updateAset,
    deleteAset,
} = require('../controllers/asetController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware')
const router = express.Router();

// Protected routes
router.post('/', protect, authorizeRoles(['admin']), createAset)
router.get('/:id', protect, authorizeRoles(['admin']), getAsetById); // Get user by ID
router.get('/', getAsets); // Get all users
router.put('/:id', protect, authorizeRoles(['admin']), updateAset); // Update user
router.delete('/:id', protect, authorizeRoles(['admin']), deleteAset); // Delete user

module.exports = router;