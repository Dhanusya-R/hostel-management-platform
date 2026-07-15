const express = require('express');
const protect = require('../middleware/auth');
const allocationController = require('../controllers/allocationController');

const router = express.Router();

router.get('/requests', protect, allocationController.getAllRequests);
router.post('/', protect, allocationController.allocateRoom);
router.put('/requests/:requestId/approve', protect, allocationController.approveRequest);
router.put('/requests/:requestId/reject', protect, allocationController.rejectRequest);

module.exports = router;