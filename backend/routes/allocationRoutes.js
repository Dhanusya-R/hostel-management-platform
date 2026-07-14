const express = require('express');
const { allocateRoom } = require('../controllers/allocationController');
const protect = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, allocateRoom);

module.exports = router;