const router = require("express").Router();

const FertilizerCtrl = require("../../controllers/FertilizerManagement/FertilizerCtrl");

// Route for adding a new Fertilizer
router.post("/add", FertilizerCtrl.addFertilizer);

// Route for getting all Fertilizers
router.get("/", FertilizerCtrl.getAllFertilizers);

// Route for getting a specific Fertilizer by ID
router.get("/:id", FertilizerCtrl.getOneFertilizer); // Adjusted to match frontend route

// Route for deleting a Fertilizer by ID
router.delete("/delete/:id", FertilizerCtrl.deleteFertilizer);

// Route for updating a Fertilizer by ID
router.put("/update/:id", FertilizerCtrl.updateFertilizer);

module.exports = router;
