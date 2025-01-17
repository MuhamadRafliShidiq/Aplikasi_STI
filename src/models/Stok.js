const mongoose = require('mongoose');

const stokSchema = mongoose.Schema({
    username: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: false },
    nama_aset: { type: mongoose.Schema.Types.ObjectId, ref: "Aset", required: true },
    jumlah: { type: Number, required: true, min: 0 },
    lokasi: { type: String, required: true },
    status: {
        type: String,
        enum: ['Tersedia', 'Tidak Tersedia', 'Habis', 'Dalam Pemesanan'],
        required: true
    },
    tanggal_pembaruan: { type: Date, default: Date.now },
    catatan: { type: String }
});

const Stok = mongoose.model('stok', stokSchema);
module.exports = Stok;
