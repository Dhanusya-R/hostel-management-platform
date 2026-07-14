const { Fee, Student } = require('../models');

exports.getFees = async (req, res) => {
  try {
    const fees = await Fee.findAll({
      include: [{ model: Student }]
    });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createFee = async (req, res) => {
  try {
    const fee = await Fee.create(req.body);
    res.status(201).json(fee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateFeeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const fee = await Fee.findByPk(id);
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });

    await fee.update({ status });
    res.json({ message: 'Fee status updated', fee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};