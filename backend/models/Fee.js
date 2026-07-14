const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Fee = sequelize.define('Fee', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  studentId: { type: DataTypes.INTEGER },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  semester: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('paid', 'pending'), defaultValue: 'pending' }
}, { timestamps: true });

module.exports = Fee;