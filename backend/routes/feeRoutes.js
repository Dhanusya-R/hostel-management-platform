// backend/routes/feeRoutes.js
const express = require('express');
const protect = require('../middleware/auth');
const feeController = require('../controllers/feeController');

const router = express.Router();

router.get('/', protect, feeController.getMyFees);           // Student
router.get('/all', protect, feeController.getAllFees);       // Admin
router.post('/', protect, feeController.createFee);          // Create Fee
router.put('/:id', protect, feeController.updateFeeStatus);  // Update Status

module.exports = router;