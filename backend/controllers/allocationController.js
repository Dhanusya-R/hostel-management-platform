const { Student, Room } = require('../models');

exports.allocateRoom = async (req, res) => {
  try {
    const { studentId, roomId } = req.body;

    const student = await Student.findByPk(studentId);
    const room = await Room.findByPk(roomId);

    if (!student || !room) {
      return res.status(404).json({ message: 'Student or Room not found' });
    }

    if (room.status === 'occupied') {
      return res.status(400).json({ message: 'Room is already occupied' });
    }

    await student.update({ roomId });
    await room.update({ status: 'occupied' });

    res.json({ message: 'Room allocated successfully', student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};