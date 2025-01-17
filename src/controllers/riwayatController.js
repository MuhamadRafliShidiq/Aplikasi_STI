const Riwayat = require('../models/Riwayat'); // Path file model riwayat
const asyncHandler = require('express-async-handler');
// Create a new record
const Aset = require('../models/Aset'); // Model untuk koleksi `asets`
const User = require('../models/User'); // Model untuk koleksi `users`

const createRiwayat = async (req, res) => {
    try {
        const {
            nama_aset,
            jenis_transaksi,
            jumlah,
            tanggal,
            pemasok,
            username,
            lokasi_asal,
            lokasi_tujuan,
            catatan,
            status
        } = req.body;

        // Validasi referensi `nama_aset`
        const asetExists = await Aset.findById(nama_aset);
        if (!asetExists) {
            return res.status(400).json({ message: 'Aset tidak ditemukan.' });
        }

        // Validasi referensi `username`
        const userExists = await User.findById(username);
        if (!userExists) {
            return res.status(400).json({ message: 'User tidak ditemukan.' });
        }

        // Membuat dokumen baru
        const newRiwayat = new Riwayat({
            nama_aset,
            jenis_transaksi,
            jumlah,
            tanggal,
            pemasok,
            username,
            lokasi_asal,
            lokasi_tujuan,
            catatan,
            status
        });

        const savedRiwayat = await newRiwayat.save();

        // Populate data setelah penyimpanan
        const populatedRiwayat = await Riwayat.findById(savedRiwayat._id)
            .populate('nama_aset', 'nama_aset') // Pilih field yang ingin diambil
            .populate('username', 'username'); // Pilih field yang ingin diambil

        res.status(201).json(populatedRiwayat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Get all records
const getRiwayat = asyncHandler(async (req, res) => {
    try {
        // Query data riwayat dan populate fields 'nama_aset' dan 'username'
        const riwayats = await Riwayat.find({})
            .populate('nama_aset', 'nama_aset') // Populate specific fields from 'asets'
            .populate('username', 'username'); // Populate specific fields from 'users'

        // Kirimkan data dengan populate
        res.status(200).json(riwayats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get a single record by ID
const getRiwayatById = async (req, res) => {
    try {
        const { id } = req.params;
        const riwayat = await Riwayat.findById(id)
            .populate('nama_aset', 'nama_aset')
            .populate('username', 'username');

        if (!riwayat) {
            return res.status(404).json({ message: 'Riwayat not found' });
        }

        res.status(200).json(riwayat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a record by ID
const updateRiwayat = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRiwayat = await Riwayat.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        })
            .populate('nama_aset', 'nama_aset')
            .populate('username', 'username');

        if (!updatedRiwayat) {
            return res.status(404).json({ message: 'Riwayat not found' });
        }

        res.status(200).json(updatedRiwayat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a record by ID
const deleteRiwayat = async (req, res) => {
    try {
        const deletedRiwayat = await Riwayat.findByIdAndDelete(req.params.id);
        if (!deletedRiwayat) {
            return res.status(404).json({ message: 'Riwayat not found' });
        }
        res.status(200).json({ message: 'Riwayat deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createRiwayat,
    getRiwayat,
    getRiwayatById,
    updateRiwayat,
    deleteRiwayat
};
