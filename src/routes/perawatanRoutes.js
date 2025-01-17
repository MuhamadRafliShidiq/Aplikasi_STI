const express = require('express');
const {
    getPerawatanById,
    createPerawatan,
    getPerawatans,
    updatePerawatan,
    deletePerawatan,
} = require('../controllers/perawatanController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware')
const router = express.Router();

// Protected routes
router.post('/', createPerawatan)
router.get('/:id', getPerawatanById); // Get user by ID
router.get('/', getPerawatans); // Get all users
router.put('/:id', updatePerawatan); // Update user
router.delete('/:id', deletePerawatan); // Delete user

module.exports = router;