// backend/controllers/feeController.js
const { Fee, Student } = require('../models');

exports.getMyFees = async (req, res) => {
  try {
    const fees = await Fee.findAll({
      where: { studentId: req.user.id },
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
      studentId,
      amount: parseFloat(amount),
      semester,
      status: status || 'pending'
    });

    const newFee = await Fee.findByPk(fee.id, {
      include: [{ model: Student }]
    });

    res.status(201).json({ 
      success: true, 
      message: 'Fee created successfully', 
      fee: newFee 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to save fee: ' + err.message });
  }
};

exports.updateFeeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const fee = await Fee.findByPk(id);
    if (!fee) return res.status(404).json({ message: 'Fee not found' });

    await fee.update({ status });
    res.json({ success: true, message: 'Status updated', fee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};