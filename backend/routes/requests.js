const express = require('express');
const protect = require('../middleware/auth');
const { RoomRequest, Student, Room, Building } = require('../models');

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { roomId, buildingId, message } = req.body;

    const student = await Student.findOne({ where: { userId: req.user.id } });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found. Please contact admin.' });
    }

    const request = await RoomRequest.create({
      studentId: student.id,
      roomId,
      buildingId,
      message: message || 'Room allocation request',
      status: 'pending'
    });

    const fullRequest = await RoomRequest.findByPk(request.id, {
      include: [
        { model: Student, attributes: ['id', 'name', 'studentId', 'email'] },
        { model: Room, attributes: ['id', 'roomNumber', 'type', 'capacity'] },
        { model: Building, attributes: ['id', 'name', 'blockId'] }
      ]
    });

    res.status(201).json({ success: true, message: 'Request submitted', request: fullRequest });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/my', protect, async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const requests = await RoomRequest.findAll({
      where: { studentId: student.id },
      include: [
        { model: Room, attributes: ['id', 'roomNumber', 'type', 'capacity'] },
        { model: Building, attributes: ['id', 'name', 'blockId'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
