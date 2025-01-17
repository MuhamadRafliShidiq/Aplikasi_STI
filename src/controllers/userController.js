const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');


// Create a new user
const createUser = asyncHandler(async (req, res) => {
    const { username, password, phone, jabatan, role } = req.body;

    const userExists = await User.findOne({ username });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    const user = new User({
        username,
        password,  // Pastikan password di-hash sebelum disimpan
        phone,
        jabatan,
        role,
    });

    const createdUser = await user.save();
    res.status(201).json({
        _id: createdUser._id,
        username: createdUser.username,
        phone: createdUser.phone,
        jabatan: createdUser.jabatan,
        role: createdUser.role,
    });
});

// Get all users
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

// Get user by ID
const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            phone: user.phone,
            jabatan: user.jabatan,
            role: user.role,
            lastActivity: user.lastActivity,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// Update user
const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { username, phone, jabatan, role } = req.body;

    const user = await User.findById(id);

    if (user) {
        user.username = username || user.username;
        user.phone = phone || user.phone;
        user.jabatan = jabatan || user.jabatan;
        user.role = role || user.role;

        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// Delete user
const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
};
