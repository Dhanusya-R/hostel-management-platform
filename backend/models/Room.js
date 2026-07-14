const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Room = sequelize.define('Room', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  roomNumber: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING }, // Single, Double, Triple
  capacity: { type: DataTypes.INTEGER, defaultValue: 3 },
  status: { 
    type: DataTypes.ENUM('available', 'occupied', 'maintenance'), 
    defaultValue: 'available' 
  },
  buildingId: { type: DataTypes.INTEGER, allowNull: false }
}, { timestamps: true });

module.exports = Room;