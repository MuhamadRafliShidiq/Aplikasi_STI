const Stok = require('../models/Stok');
const asyncHandler = require('express-async-handler');
const Aset = require('../models/Aset'); // Model untuk koleksi `asets`
const User = require('../models/User');
const createStok = async (req, res) => {
    try {
        const {
            username,
            nama_aset,
            jumlah,
            lokasi,
            status,
            tanggal_pembaruan,
            catatan,

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
        const newStok = new Stok({
            username,
            nama_aset,
            jumlah,
            lokasi,
            status,
            tanggal_pembaruan,
            catatan,
        });

        const savedStok = await newStok.save();

        // Populate data setelah penyimpanan
        const populatedStok = await Stok.findById(savedStok._id)
            .populate('nama_aset', 'nama_aset') // Pilih field yang ingin diambil
            .populate('username', 'username'); // Pilih field yang ingin diambil

        res.status(201).json(populatedStok);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all records
const getStoks = asyncHandler(async (req, res) => {
    try {
        // Query data Stok dan populate fields 'nama_aset' dan 'username'
        const stok = await Stok.find({})
            .populate('nama_aset', 'nama_aset') // Populate specific fields from 'asets'
            .populate('username', 'username'); // Populate specific fields from 'users'

        // Kirimkan data dengan populate
        res.status(200).json(stok);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single record by ID
const getStokById = async (req, res) => {
    try {
        const { id } = req.params;
        const stoks = await Stok.findById(id)
            .populate('username', 'username')
            .populate('nama_aset', 'nama_aset');

        if (!stoks) {
            return res.status(404).json({ message: 'Stok not found' });
        }

        res.status(200).json(stoks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a record by ID
const updateStok = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedStok = await Stok.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        })
            .populate('username', 'username')
            .populate('nama_aset', 'nama_aset');

        if (!updatedStok) {
            return res.status(404).json({ message: 'Stok not found' });
        }

        res.status(200).json(updatedStok);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Delete a record by ID
const deleteStok = async (req, res) => {
    try {
        const deleteStok = await Stok.findByIdAndDelete(req.params.id);
        if (!deleteStok) {
            return res.status(404).json({ message: 'Stok not found' });
        }
        res.status(200).json({ message: 'Stok deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = {
    createStok,
    getStoks,
    getStokById,
    updateStok,
    deleteStok
};