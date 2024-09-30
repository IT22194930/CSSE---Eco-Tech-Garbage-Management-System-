const express = require("express");
const router = express.Router();
const diseaseController = require("../../controllers/PlantManagement/diseaseController");

// Get all diseases by plant ID
router.get("/plant/:plantId", diseaseController.getDiseasesByPlantId);

// Get a single disease by ID
router.get("/:id", diseaseController.getDiseaseById);

// Add a new disease
router.post("/", diseaseController.createDisease);

// Update a disease by ID
router.put("/:id", diseaseController.updateDisease);

// Delete a disease by ID
router.delete("/:id", diseaseController.deleteDisease);

module.exports = router;
