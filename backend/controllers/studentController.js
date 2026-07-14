const { Student, Room } = require('../models');

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [{ model: Room }]
    });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};