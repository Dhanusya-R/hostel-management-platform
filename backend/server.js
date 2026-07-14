// hostel-management-platform/backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection & Sync
connectDB().then(async () => {
  try {
    await sequelize.sync({ alter: true }); // Safe for development
    console.log('✅ Database Synced Successfully');
  } catch (syncError) {
    console.error('❌ Database Sync Error:', syncError);
  }
}).catch(err => {
  console.error('❌ Database Connection Failed:', err);
  process.exit(1);
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const buildingRoutes = require('./routes/buildingRoutes');
const roomRoutes = require('./routes/roomRoutes');
const studentRoutes = require('./routes/studentRoutes');
const allocationRoutes = require('./routes/allocationRoutes');
const feeRoutes = require('./routes/feeRoutes');
const requestRoutes = require('./routes/requests'); // New route for student requests

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/allocations', allocationRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/requests', requestRoutes); // Student room booking requests

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CampusStay Backend is running' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});