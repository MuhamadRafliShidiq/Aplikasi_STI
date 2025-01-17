const Perawatan = require('../models/Perawatan');
const Aset = require('../models/Aset'); // Model Aset
const User = require('../models/User'); // Model User
const asyncHandler = require('express-async-handler');

// Create a new record
const createPerawatan = async (req, res) => {
    try {
        const {
            nama_aset,
            jenis_perawatan,
            tanggal_perawatan,
            teknisi,
            deskripsi,
            biaya,
            status,
            catatan,
        } = req.body;

        // Validasi referensi `nama_aset`
        const asetExists = await Aset.findById(nama_aset);
        if (!asetExists) {
            return res.status(400).json({ message: 'Aset tidak ditemukan.' });
        }

        // Validasi teknisi dengan role tertentu
        const teknisiExists = await User.findById(teknisi);
        if (!teknisiExists || teknisiExists.role !== 'teknisi') {
            return res.status(400).json({ message: 'Teknisi tidak valid atau tidak ditemukan.' });
        }

        // Membuat dokumen baru
        const newPerawatan = new Perawatan({
            nama_aset,
            jenis_perawatan,
            tanggal_perawatan,
            teknisi,
            deskripsi,
            biaya,
            status,
            catatan,
        });

        const savedPerawatan = await newPerawatan.save();

        // Populate data setelah penyimpanan
        const populatedPerawatan = await Perawatan.findById(savedPerawatan._id)
            .populate('nama_aset', 'nama_aset') // Ambil hanya nama aset
            .populate('teknisi', 'username role'); // Ambil username dan role teknisi

        res.status(201).json(populatedPerawatan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all records
const getPerawatans = asyncHandler(async (req, res) => {
    try {
        const perawatans = await Perawatan.find({})
            .populate('nama_aset', 'nama_aset') // Populate nama aset
            .populate('teknisi', 'username role'); // Populate teknisi dengan role dan username

        res.status(200).json(perawatans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single record by ID
const getPerawatanById = async (req, res) => {
    try {
        const { id } = req.params;
        const perawatan = await Perawatan.findById(id)
            .populate('nama_aset', 'nama_aset') // Populate nama aset
            .populate('teknisi', 'username role'); // Populate teknisi dengan role dan username

        if (!perawatan) {
            return res.status(404).json({ message: 'Perawatan tidak ditemukan.' });
        }

        res.status(200).json(perawatan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a record by ID
const updatePerawatan = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.body.teknisi) {
            // Validasi teknisi jika diperbarui
            const teknisiExists = await User.findById(req.body.teknisi);
            if (!teknisiExists || teknisiExists.role !== 'teknisi') {
                return res.status(400).json({ message: 'Teknisi tidak valid atau tidak ditemukan.' });
            }
        }

        const updatedPerawatan = await Perawatan.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        })
            .populate('nama_aset', 'nama_aset')
            .populate('teknisi', 'username role');

        if (!updatedPerawatan) {
            return res.status(404).json({ message: 'Perawatan tidak ditemukan.' });
        }

        res.status(200).json(updatedPerawatan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a record by ID
const deletePerawatan = async (req, res) => {
    try {
        const perawatan = await Perawatan.findByIdAndDelete(req.params.id);
        if (!perawatan) {
            return res.status(404).json({ message: 'Perawatan tidak ditemukan.' });
        }
        res.status(200).json({ message: 'Perawatan berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createPerawatan,
    getPerawatans,
    getPerawatanById,
    updatePerawatan,
    deletePerawatan,
};
