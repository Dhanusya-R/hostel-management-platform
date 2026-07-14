const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect Database
connectDB().then(async () => {
  await sequelize.sync({ alter: true }); // Use force: true only in development
  console.log('✅ Database Synced');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/buildings', require('./routes/buildingRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/allocations', require('./routes/allocationRoutes'));
app.use('/api/fees', require('./routes/feeRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});