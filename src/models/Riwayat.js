const mongoose = require('mongoose');

const riwayatSchema = mongoose.Schema({
    nama_aset: { type: mongoose.Schema.Types.ObjectId, ref: 'Aset', required: true },
    jenis_transaksi: {
        type: String,
        enum: ['Masuk', 'Keluar', 'Pindah', 'Perbaikan', 'Penyewaan'],
        required: true
    },
    jumlah: { type: Number, required: true, min: 1 },
    tanggal: { type: Date, default: Date.now },
    pemasok: { type: String }, // Tidak required, bergantung pada jenis transaksi
    username: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    lokasi_asal: { type: String },
    lokasi_tujuan: { type: String },
    catatan: { type: String },
    status: {
        type: String,
        enum: ['Selesai', 'Diproses', 'Dibatalkan'],
        default: 'Diproses'
    }
});

const Riwayat = mongoose.model('riwayat-persediaan', riwayatSchema);
module.exports = Riwayat;
