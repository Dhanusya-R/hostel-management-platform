const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Room = sequelize.define('Room', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  roomNumber: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING },
  capacity: { type: DataTypes.INTEGER },
  status: { type: DataTypes.ENUM('available', 'occupied', 'maintenance'), defaultValue: 'available' }
}, { timestamps: true });

module.exports = Room;