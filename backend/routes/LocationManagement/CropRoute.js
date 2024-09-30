const router = require("express").Router();
const CropCtrl = require("../../controllers/LocationManagement/CropCtrl");

// Route for adding a new crop
router.post("/", CropCtrl.createCrop);

// Route for getting all crops by location ID
router.get("/location/:locationId", CropCtrl.getCropsByLocationId);

// Route for getting a single crop by ID
router.get("/:id", CropCtrl.getCropById);

// Route for updating a crop by ID
router.put("/:id", CropCtrl.updateCrop);

// Route for deleting a crop by ID
router.delete("/:id", CropCtrl.deleteCrop);

module.exports = router;
