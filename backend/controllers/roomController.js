const { Room, Building, Student } = require('../models');

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({
      include: [{ model: Building, attributes: ['name', 'blockId'] }]
    });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRoomsByBuilding = async (req, res) => {
  try {
    const { buildingId } = req.params;
    const where = { buildingId: parseInt(buildingId, 10) };
    if (req.query.status) where.status = req.query.status;

    const rooms = await Room.findAll({
      where,
      include: [
        { model: Building, attributes: ['name', 'blockId'] },
        { model: Student, attributes: ['id', 'name', 'studentId'] }
      ],
      order: [['roomNumber', 'ASC']]
    });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { roomNumber, type, capacity, buildingId } = req.body;
    if (!roomNumber || !buildingId) {
      return res.status(400).json({ message: 'Room number and Building are required' });
    }
    const room = await Room.create({
      roomNumber: roomNumber.trim(),
      type: type || 'Single',
      capacity: capacity ? parseInt(capacity, 10) : 3,
      buildingId: parseInt(buildingId, 10),
      status: 'available'
    });
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    const { roomNumber, type, capacity, buildingId, status } = req.body;
    await room.update({
      roomNumber: roomNumber || room.roomNumber,
      type: type || room.type,
      capacity: capacity ? parseInt(capacity, 10) : room.capacity,
      buildingId: buildingId ? parseInt(buildingId, 10) : room.buildingId,
      status: status || room.status
    });
    res.json({ message: 'Room updated', room });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    await room.destroy();
    res.json({ message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
