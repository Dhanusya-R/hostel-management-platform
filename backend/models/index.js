// hostel-management-platform/backend/models/index.js
const { sequelize } = require('../config/db');

const User = require('./User');
const Building = require('./Building');
const Room = require('./Room');
const Student = require('./Student');
const Fee = require('./Fee');
const RoomRequest = require('./RoomRequest');   // ← New model

// ====================== ASSOCIATIONS ======================

// Building ↔ Room
Building.hasMany(Room, { foreignKey: 'buildingId' });
Room.belongsTo(Building, { foreignKey: 'buildingId' });

// Room ↔ Student
Room.hasMany(Student, { foreignKey: 'roomId' });
Student.belongsTo(Room, { foreignKey: 'roomId' });

// Student ↔ Fee
Student.hasMany(Fee, { foreignKey: 'studentId' });
Fee.belongsTo(Student, { foreignKey: 'studentId' });

// Student ↔ RoomRequest (New)
Student.hasMany(RoomRequest, { foreignKey: 'studentId' });
RoomRequest.belongsTo(Student, { foreignKey: 'studentId' });

// Optional: Room ↔ RoomRequest
Room.hasMany(RoomRequest, { foreignKey: 'roomId' });
RoomRequest.belongsTo(Room, { foreignKey: 'roomId' });

module.exports = { 
  sequelize, 
  User, 
  Building, 
  Room, 
  Student, 
  Fee,
  RoomRequest   // ← Export it
};