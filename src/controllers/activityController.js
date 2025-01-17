const ActivityLog = require('../models/Aktifitas');

// Fungsi untuk mencatat aktivitas pengguna
const logActivity = async (req, res) => {
    try {
        const { username, activity, status, description } = req.body;
        const newActivity = new ActivityLog({
            username,
            activity,
            status,
            description,
        });

        await newActivity.save();
        res.status(201).json({ message: 'Aktivitas tercatat' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mencatat aktivitas', error: error.message });
    }
};

// Fungsi untuk mengambil histori aktivitas
const getActivityLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.find().sort({ timestamp: -1 }); // Urutkan berdasarkan waktu terbaru
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil histori aktivitas', error: error.message });
    }
};

module.exports = {
    logActivity,
    getActivityLogs,
};

