const express = require('express');
const { getFees, createFee, updateFeeStatus } = require('../controllers/feeController');
const protect = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getFees);
router.post('/', protect, createFee);
router.put('/:id/status', protect, updateFeeStatus);

module.exports = router;