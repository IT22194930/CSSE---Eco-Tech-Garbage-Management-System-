const router = require("express").Router();

const PlantCtrl = require("../../controllers/PlantManagement/PlantCtrl");

// Route for adding a new plant
router.post("/add", PlantCtrl.addPlant);

// Route for getting all plants
router.get("/", PlantCtrl.getAllPlants);

// Route for getting a specific plant by ID
router.get("/:id", PlantCtrl.getOnePlant); // Adjusted to match frontend route

// Route for deleting a plant by ID
router.delete("/delete/:id", PlantCtrl.deletePlant);

// Route for updating a plant by ID
router.put("/update/:id", PlantCtrl.updatePlant);

module.exports = router;
