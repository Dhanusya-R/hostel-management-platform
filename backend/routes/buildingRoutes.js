// backend/routes/buildingRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getBuildings, 
  createBuilding, 
  updateBuilding, 
  deleteBuilding 
} = require('../controllers/buildingController');

const protect = require('../middleware/auth');

// GET all buildings (Public)
router.get('/', getBuildings);

// CREATE building (Protected)
router.post('/', protect, createBuilding);

// UPDATE building (Protected)
router.put('/:id', protect, updateBuilding);

// DELETE building (Protected)
router.delete('/:id', protect, deleteBuilding);

module.exports = router;