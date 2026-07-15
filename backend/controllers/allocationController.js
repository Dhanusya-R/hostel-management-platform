const { Student, Room, RoomRequest, Building } = require('../models');

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

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await RoomRequest.findAll({
      include: [
        { model: Student, attributes: ['id', 'name', 'studentId'] },
        { model: Room, attributes: ['id', 'roomNumber', 'type', 'capacity'] },
        { model: Building, attributes: ['id', 'name', 'blockId'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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

exports.rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await RoomRequest.findByPk(requestId);

    if (!request) return res.status(404).json({ message: 'Request not found' });

    await request.update({ status: 'rejected' });

    res.json({ message: 'Request rejected' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};