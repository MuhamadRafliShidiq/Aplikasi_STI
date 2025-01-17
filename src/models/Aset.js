const mongoose = require('mongoose');

const asetSchema = mongoose.Schema({
    nama_aset: { type: String, required: true },
    kode_aset: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    model: { type: String },
    spesifikasi: { type: String },
    kategori: { type: String, required: true },
    kondisi: { type: String, enum: ['Baik', 'Rusak', 'Perlu Perbaikan'], required: true },
    lokasi_detail: { type: String, required: true },
    tanggal_pembelian: { type: Date, default: Date.now },
    garansi: { type: Date, default: Date.now },
    harga_aset: { type: Number },
    nilai_residu: { type: Number },
    riwayat_perawatan: [
        {
            tanggal: { type: Date, required: true },
            deskripsi: { type: String, required: true },
            teknisi: { type: String }
        }
    ],
    riwayat_pengguna: [
        {
            nama_pengguna: { type: String, required: true },
            tanggal_mulai: { type: Date, required: true },
            tanggal_selesai: { type: Date }
        }
    ],
    status: { type: String, enum: ['Aktif', 'Nonaktif', 'Diperbaiki', 'Dihapus'], required: true },
    dokumen: [
        {
            nama: { type: String },
            url: { type: String }
        }
    ]
});

const Aset = mongoose.model('Aset', asetSchema);

module.exports = Aset;
