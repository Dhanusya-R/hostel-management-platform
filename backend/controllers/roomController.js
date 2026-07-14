const { Room, Building } = require('../models');

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({
      include: [{ model: Building }]
    });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};