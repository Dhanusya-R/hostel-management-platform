const express = require('express');
const protect = require('../middleware/auth');
const allocationController = require('../controllers/allocationController');

const router = express.Router();

router.post('/', protect, allocationController.allocateRoom);
router.put('/requests/:requestId/approve', protect, allocationController.approveRequest);

module.exports = router;