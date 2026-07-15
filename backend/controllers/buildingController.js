const { Building, Room } = require('../models');

exports.getBuildings = async (req, res) => {
  try {
    const buildings = await Building.findAll({ include: [{ model: Room }] });
    res.json(buildings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createBuilding = async (req, res) => {
  try {
    const { name, blockId, floors, wardenName } = req.body;
    if (!name || !blockId) {
      return res.status(400).json({ message: 'Name and Block ID are required' });
    }
    const building = await Building.create({
      name: name.trim(),
      blockId: blockId.trim(),
      floors: floors ? parseInt(floors, 10) : 1,
      wardenName: wardenName ? wardenName.trim() : null
    });
    res.status(201).json(building);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Block ID already exists' });
    }
    res.status(500).json({ message: err.message });
  }
};

exports.updateBuilding = async (req, res) => {
  try {
    const building = await Building.findByPk(req.params.id);
    if (!building) return res.status(404).json({ message: 'Building not found' });
    const { name, blockId, floors, wardenName } = req.body;
    await building.update({
      name: name || building.name,
      blockId: blockId || building.blockId,
      floors: floors ? parseInt(floors, 10) : building.floors,
      wardenName: wardenName !== undefined ? wardenName : building.wardenName
    });
    res.json({ message: 'Building updated', building });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBuilding = async (req, res) => {
  try {
    const building = await Building.findByPk(req.params.id);
    if (!building) return res.status(404).json({ message: 'Building not found' });
    await building.destroy();
    res.json({ message: 'Building deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
