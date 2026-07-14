// backend/models/index.js
const { sequelize } = require('../config/db');

const User = require('./User');
const Building = require('./Building');
const Room = require('./Room');
const Student = require('./Student');
const Fee = require('./Fee');
const RoomRequest = require('./RoomRequest');   // ← Must exist

// ====================== ASSOCIATIONS ======================
Building.hasMany(Room, { foreignKey: 'buildingId' });
Room.belongsTo(Building, { foreignKey: 'buildingId' });

Room.hasMany(Student, { foreignKey: 'roomId' });
Student.belongsTo(Room, { foreignKey: 'roomId' });

Student.hasMany(Fee, { foreignKey: 'studentId' });
Fee.belongsTo(Student, { foreignKey: 'studentId' });

// RoomRequest Associations
Student.hasMany(RoomRequest, { foreignKey: 'studentId' });
RoomRequest.belongsTo(Student, { foreignKey: 'studentId' });

Room.hasMany(RoomRequest, { foreignKey: 'roomId' });
RoomRequest.belongsTo(Room, { foreignKey: 'roomId' });

module.exports = { 
  sequelize, 
  User, 
  Building, 
  Room, 
  Student, 
  Fee, 
  RoomRequest 
};