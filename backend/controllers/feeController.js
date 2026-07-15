const { Fee, Student } = require('../models');

exports.getMyFees = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });
    if (!student) return res.json([]);
    const fees = await Fee.findAll({
      where: { studentId: student.id },
      include: [{ model: Student }]
    });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllFees = async (req, res) => {
  try {
    const fees = await Fee.findAll({
      include: [{ model: Student, attributes: ['name', 'studentId'] }]
    });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createFee = async (req, res) => {
  try {
    const { studentId, amount, semester, status } = req.body;
    if (!studentId || !amount || !semester) {
      return res.status(400).json({ message: 'Student ID, Amount and Semester are required' });
    }
    const fee = await Fee.create({
      studentId: parseInt(studentId, 10),
      amount: parseFloat(amount),
      semester: semester.trim(),
      status: status || 'pending'
    });
    const newFee = await Fee.findByPk(fee.id, { include: [{ model: Student }] });
    res.status(201).json({ success: true, message: 'Fee created', fee: newFee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateFeeStatus = async (req, res) => {
  try {
    const fee = await Fee.findByPk(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee not found' });
    await fee.update({ status: req.body.status });
    res.json({ success: true, message: 'Status updated', fee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
