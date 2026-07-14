const express = require('express');
const protect = require('../middleware/auth');
const roomController = require('../controllers/roomController');

const router = express.Router();

router.get('/', roomController.getRooms);
router.post('/', protect, roomController.createRoom);
router.put('/:id', protect, roomController.updateRoom);
router.delete('/:id', protect, roomController.deleteRoom);

module.exports = router;