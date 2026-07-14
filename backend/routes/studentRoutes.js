const express = require('express');
const { getStudents, createStudent } = require('../controllers/studentController');
const protect = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getStudents);
router.post('/', protect, createStudent);

module.exports = router;