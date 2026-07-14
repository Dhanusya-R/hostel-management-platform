const express = require('express');
const protect = require('../middleware/auth');
const { RoomRequest } = require('../models');

const router = express.Router();

// Submit new room request
router.post('/', protect, async (req, res) => {
  try {
    const { roomId, buildingId, message } = req.body;
    const request = await RoomRequest.create({
      studentId: req.user.id,
      roomId,
      buildingId,
      message: message || 'Request for room allocation'
    });
    res.status(201).json({ 
      success: true, 
      message: 'Request submitted successfully', 
      request 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get student's own requests
router.get('/my', protect, async (req, res) => {
  try {
    const requests = await RoomRequest.findAll({ 
      where: { studentId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;