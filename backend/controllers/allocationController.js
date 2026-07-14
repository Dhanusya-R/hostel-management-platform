const { Student, Room, RoomRequest } = require('../models');

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

    res.json({ message: 'Room allocated successfully', student, room });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve Request (Admin only)
exports.approveRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await RoomRequest.findByPk(requestId, {
      include: [Student, Room]
    });

    if (!request) return res.status(404).json({ message: 'Request not found' });

    await request.update({ status: 'approved' });
    await request.Room.update({ status: 'occupied' });
    await request.Student.update({ roomId: request.roomId });

    res.json({ message: 'Request approved and room allocated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};