const mongoose = require('mongoose');

const laporanSchema = mongoose.Schema({
    nama_aset: { type: mongoose.Schema.Types.ObjectId, ref: "Aset", required: true },
    kondisi: { type: String, enum: ['Baik', 'Rusak', 'Perlu Perbaikan'], required: true },
    tanggal_perawatan: {
        type: mongoose.Schema.Types.ObjectId, ref: "histori", required: true
    },
    nilai_depresiasi: { type: String, required: true },
    analisis_penggunaan: { type: String, required: true }
});

const Laporan = mongoose.model('laporan', laporanSchema);

module.exports = Laporan;   