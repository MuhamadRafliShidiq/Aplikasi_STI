const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

// Fungsi untuk membuat token JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7h' });
};

// Login pengguna dan mendapatkan token
const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    // Validasi input awal
    if (!username || !password) {
        res.status(400).json({ message: 'Harap masukkan username dan password' });
        return;
    }

    // Cari pengguna berdasarkan username
    const user = await User.findOne({ username });

    // Periksa apakah pengguna ditemukan dan password cocok
    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
            _id: user._id,
            username: user.username,
            role: user.role,
            token: generateToken(user._id, user.role), // Tambahkan role ke token
        });
    } else {
        res.status(401).json({ message: 'Username atau password salah' }); // Pesan error umum
    }
});

module.exports = { loginUser };
