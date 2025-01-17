const Aset = require('../models/Aset');
const asyncHandler = require('express-async-handler');

const createAset = asyncHandler(async (req, res) => {
    const {
        nama_aset, kode_aset, kategori, kondisi, lokasi_detail, tanggal_pembelian, garansi,
        status
    } = req.body;

    // Validation: Check if required fields are present
    if (!nama_aset || !kode_aset || !kondisi || !kategori || !status) {
        res.status(400);
        throw new Error('Missing required fields');
    }

    // Check if the asset already exists based on kode_aset
    const assetExists = await Aset.findOne({ kode_aset });
    if (assetExists) {
        res.status(400);
        throw new Error('Kode Aset Sudah dipakai');
    }

    // Create new asset
    const asset = new Aset({
        nama_aset, kode_aset, kategori, kondisi, lokasi_detail, tanggal_pembelian, garansi,
        status
    });

    // Save the asset to the database
    const createdAsset = await asset.save();

    // Respond with the created asset
    res.status(201).json({
        message: 'Asset successfully created',
        asset: createdAsset
    });
});


// Get all assets
const getAsets = asyncHandler(async (req, res) => {
    const assets = await Aset.find({});
    res.json(assets);
});

// Get asset by ID
const getAsetById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const asset = await Aset.findById(id);

    if (asset) {
        res.json(asset);
    } else {
        res.status(404);
        throw new Error('Asset not found');
    }
});

// Update asset by ID
const updateAset = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    const asset = await Aset.findById(id);

    if (asset) {
        // Menggunakan Object.assign untuk mengupdate aset dengan data baru
        Object.assign(asset, updatedData);

        const updatedAsset = await asset.save();
        res.json(updatedAsset);
    } else {
        res.status(404);
        throw new Error('Asset not found');
    }
});


// Delete an asset by ID
const deleteAset = async (req, res) => {
    try {
        const deletedAsset = await Aset.findByIdAndDelete(req.params.id);
        if (!deletedAsset) {
            return res.status(404).json({ message: 'Asset not found' });
        }
        res.status(200).json({ message: 'Asset deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAsets,
    getAsetById,
    createAset,
    updateAset,
    deleteAset
};
