const router = require("express").Router();

const LocationCtrl = require("../../controllers/LocationManagement/LocationCtrl");

// Route for adding a new location
router.post("/add", LocationCtrl.addLocation);

// Route for getting all locations
router.get("/", LocationCtrl.getAllLocations);

// Route for getting a specific location by ID
router.get("/:id", LocationCtrl.getOneLocation); // Adjusted to match frontend route

// Route for deleting a location by ID
router.delete("/delete/:id", LocationCtrl.deleteLocation);

// Route for updating a location by ID
router.put("/update/:id", LocationCtrl.updateLocation);

module.exports = router;
