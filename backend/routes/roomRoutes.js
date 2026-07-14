const express = require('express');
const { getRooms, createRoom } = require('../controllers/roomController');
const protect = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getRooms);
router.post('/', protect, createRoom);

module.exports = router;