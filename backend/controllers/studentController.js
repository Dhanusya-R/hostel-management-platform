const bcrypt = require('bcryptjs');
const { Student, Room, Building, User } = require('../models');

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [{ model: Room, include: [{ model: Building, attributes: ['name', 'blockId'] }] }]
    });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const student = await Student.findOne({
      where: { userId: req.user.id },
      include: [{
        model: Room,
        include: [{ model: Building, attributes: ['name', 'blockId', 'floors'] }]
      }]
    });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { studentId, name, email, department, password } = req.body;
    if (!studentId || !name) {
      return res.status(400).json({ message: 'Student ID and Name are required' });
    }

    let userId = null;
    if (email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'A user with this email already exists' });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password || 'student123', salt);
      const user = await User.create({
        name: name.trim(),
        email: email.trim(),
        password: hashedPassword,
        role: 'student',
        department: department || null
      });
      userId = user.id;
    }

    const student = await Student.create({
      userId,
      studentId: studentId.trim(),
      name: name.trim(),
      email: email || null,
      department: department || null
    });
    res.status(201).json(student);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Student ID already exists' });
    }
    res.status(500).json({ message: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const { studentId, name, email, department } = req.body;
    await student.update({
      studentId: studentId || student.studentId,
      name: name || student.name,
      email: email !== undefined ? email : student.email,
      department: department !== undefined ? department : student.department
    });
    res.json({ message: 'Student updated', student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    await student.destroy();
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
