const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware untuk memverifikasi token
const protect = (req, res, next) => {
    let token;

    // Periksa apakah header authorization memiliki token Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]; // Ambil token setelah 'Bearer'
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifikasi token

            req.user = decoded; // Simpan payload token (misalnya, id dan role pengguna)
            return next();
        } catch (error) {
            console.error("Token verification failed:", error.message);
            return res.status(401).json({ message: "Not authorized, token invalid" });
        }
    }

    // Jika token tidak ada, kembalikan respons 401
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token provided" });
    }
};

// Middleware untuk mengizinkan akses berdasarkan role
const authorizeRoles = (roles) => {
    return (req, res, next) => {
        if (req.user && roles.includes(req.user.role)) {
            next(); // Jika role pengguna sesuai, lanjutkan
        } else {
            res.status(403).json({ message: 'Not authorized for this role' });
        }
    };
};

module.exports = { protect, authorizeRoles };
