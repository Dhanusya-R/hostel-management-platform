const express = require('express');
const { getStudents, getMe, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController');
const protect = require('../middleware/auth');

const router = express.Router();

router.get('/me', protect, getMe);
router.get('/', protect, getStudents);
router.post('/', protect, createStudent);
router.put('/:id', protect, updateStudent);
router.delete('/:id', protect, deleteStudent);

module.exports = router;