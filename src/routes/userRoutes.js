const express = require('express');
const {
    getUserById,
    createUser,
    getUsers,
    updateUser,
    deleteUser,
} = require('../controllers/userController');
const { loginUser } = require('../controllers/authController')
const { protect, authorizeRoles } = require('../middlewares/authMiddleware')
const router = express.Router();

// Public routes
router.post('/login', loginUser);
// Protected routes
router.post('/', protect, authorizeRoles(['admin']), createUser)
router.get('/:id', protect, authorizeRoles(['admin']), getUserById); // Get user by ID
router.get('/', getUsers); // Get all users
router.put('/:id', protect, authorizeRoles(['admin']), updateUser); // Update user
router.delete('/:id', protect, authorizeRoles(['admin']), deleteUser); // Delete user

module.exports = router;
