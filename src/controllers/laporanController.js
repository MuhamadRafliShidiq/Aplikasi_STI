const Laporan = require('../models/LaporanAset'); // Pastikan path benar dan model sudah diekspor dengan benar
const asyncHandler = require('express-async-handler');
const Aset = require('../models/Aset');
const Perawatan = require('../models/Perawatan');

// Create a new Laporan
const createLaporan = asyncHandler(async (req, res) => {
    try {
        const {
            nama_aset,
            kondisi,
            tanggal_perawatan,
            nilai_depresiasi,
            analisis_penggunaan,
        } = req.body;

        // Validasi referensi `nama_aset`
        const asetExists = await Aset.findById(nama_aset);
        if (!asetExists) {
            return res.status(400).json({ message: 'Aset tidak ditemukan.' });
        }

        // Validasi referensi `tanggal_perawatan`
        const historiExists = await Perawatan.findById(tanggal_perawatan);
        if (!historiExists) {
            return res.status(400).json({ message: 'Histori perawatan tidak ditemukan.' });
        }

        // Membuat dokumen baru
        const newLaporan = new Laporan({
            nama_aset,
            kondisi,
            tanggal_perawatan,
            nilai_depresiasi,
            analisis_penggunaan,
        });

        const savedLaporan = await newLaporan.save();

        // Populate data setelah penyimpanan
        const populatedLaporan = await Laporan.findById(savedLaporan._id)
            .populate('nama_aset', 'nama_aset') // Pilih field yang ingin diambil
            .populate('tanggal_perawatan', 'tanggal_perawatan');

        res.status(201).json(populatedLaporan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all records
const getLaporans = asyncHandler(async (req, res) => {
    try {
        const laporanList = await Laporan.find({})
            .populate('nama_aset', 'nama_aset')
            .populate('tanggal_perawatan', 'tanggal_perawatan');

        res.status(200).json(laporanList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single record by ID
const getLaporanById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const laporan = await Laporan.findById(id)
            .populate('nama_aset', 'nama_aset')
            .populate('tanggal_perawatan', 'tanggal_perawatan');

        if (!laporan) {
            return res.status(404).json({ message: 'Laporan not found' });
        }

        res.status(200).json(laporan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a record by ID
const updateLaporan = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const updatedLaporan = await Laporan.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        })
            .populate('nama_aset', 'nama_aset')
            .populate('tanggal_perawatan', 'tanggal_perawatan');

        if (!updatedLaporan) {
            return res.status(404).json({ message: 'Laporan not found' });
        }

        res.status(200).json(updatedLaporan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a record by ID
const deleteLaporan = asyncHandler(async (req, res) => {
    try {
        const laporan = await Laporan.findByIdAndDelete(req.params.id);
        if (!laporan) {
            return res.status(404).json({ message: 'Laporan not found' });
        }
        res.status(200).json({ message: 'Laporan deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = {
    createLaporan,
    getLaporans,
    getLaporanById,
    updateLaporan,
    deleteLaporan,
};
