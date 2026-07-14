const { Building, Room } = require('../models');

// Get all buildings with rooms
exports.getBuildings = async (req, res) => {
  try {
    const buildings = await Building.findAll({
      include: [{ model: Room }]
    });
    res.json(buildings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new building
exports.createBuilding = async (req, res) => {
  try {
    const building = await Building.create(req.body);
    res.status(201).json(building);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update building
exports.updateBuilding = async (req, res) => {
  try {
    const building = await Building.findByPk(req.params.id);
    if (!building) {
      return res.status(404).json({ message: 'Building not found' });
    }

    await building.update(req.body);
    res.json({ 
      message: 'Building updated successfully', 
      building 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete building
exports.deleteBuilding = async (req, res) => {
  try {
    const building = await Building.findByPk(req.params.id);
    if (!building) {
      return res.status(404).json({ message: 'Building not found' });
    }

    await building.destroy();
    res.json({ message: 'Building deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};