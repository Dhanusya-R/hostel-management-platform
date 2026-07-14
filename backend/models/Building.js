const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Building = sequelize.define('Building', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  blockId: { type: DataTypes.STRING, unique: true },
  floors: { type: DataTypes.INTEGER },
  wardenName: { type: DataTypes.STRING }
}, { timestamps: true });

module.exports = Building;