const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes');
const asetRoutes = require('./routes/asetRoutes')
const riwayatRoutes = require('./routes/riwayatRoutes')
const stokRoutes = require('./routes/stokRoutes')
const laporanRoutes = require('./routes/laporanRoutes')
const perawatanRoutes = require('./routes/perawatanRoutes')
const activityRoutes = require('./routes/activityRoutes');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Mengonfigurasi CORS
app.use(cors({
    origin: 'http://localhost:5173',
}));

// Connect to database
connectDB();

// Middleware to parse JSON body
app.use(express.json());

// API Routes
app.use('/login', authRoutes)
app.use('/users', userRoutes)
app.use('/asets', asetRoutes)
app.use('/riwayat', riwayatRoutes)
app.use('/stok', stokRoutes)
app.use('/laporan', laporanRoutes)
app.use('/histori', perawatanRoutes)
app.use('/api', activityRoutes);



module.exports = app;
