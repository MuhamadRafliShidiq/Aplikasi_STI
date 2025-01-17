const mongoose = require('mongoose');

const perawatanSchema = mongoose.Schema({
    nama_aset: { type: mongoose.Schema.Types.ObjectId, ref: "Aset", required: true }, // Referensi ke aset yang dirawat
    jenis_perawatan: {
        type: String,
        enum: ['Preventive', 'Corrective', 'Inspection'], // Jenis perawatan
        required: true
    },
    tanggal_perawatan: { type: Date, default: Date.now }, // Tanggal perawatan dilakukan
    teknisi: { type: mongoose.Schema.Types.ObjectId, ref: "users", enum: ['teknisi'], required: true }, // Referensi ke teknisi yang bertugas
    deskripsi: { type: String, required: true }, // Penjelasan singkat tentang perawatan
    biaya: { type: Number, required: false, min: 0 }, // Biaya yang dikeluarkan (opsional)
    status: {
        type: String,
        enum: ['Selesai', 'Menunggu', 'Dalam Proses'], // Status perawatan
        required: true
    },
    catatan: { type: String, required: false } // Catatan tambahan (opsional)
});

const Perawatan = mongoose.model('histori', perawatanSchema);

module.exports = Perawatan;
