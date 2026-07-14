const { sequelize } = require('../config/db');
const User = require("./User");
const Building = require('./Building');
const Room = require('./Room');
const Student = require('./Student');
const Fee = require('./Fee');

// Associations
Building.hasMany(Room, { foreignKey: 'buildingId' });
Room.belongsTo(Building, { foreignKey: 'buildingId' });

Room.hasMany(Student, { foreignKey: 'roomId' });
Student.belongsTo(Room, { foreignKey: 'roomId' });

Student.hasMany(Fee, { foreignKey: 'studentId' });
Fee.belongsTo(Student, { foreignKey: 'studentId' });

module.exports = { sequelize, User, Building, Room, Student, Fee };

// Add this
const RoomRequest = require('./RoomRequest');

// Associations
// ... existing ones
RoomRequest.belongsTo(require('./Student'), { foreignKey: 'studentId' });
require('./Student').hasMany(RoomRequest, { foreignKey: 'studentId' });