const Crop = require("../../models/LocationManagement/crop");

// Get all crops by location ID
exports.getCropsByLocationId = async (req, res) => {
  try {
    const crops = await Crop.find({ locationId: req.params.locationId });
    res.status(200).json(crops);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve crops", error: err.message });
  }
};

// Get a single crop by ID
exports.getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: "Crop not found" });
    res.status(200).json(crop);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve crop", error: err.message });
  }
};

// Add a new crop
exports.createCrop = async (req, res) => {
  const {
    cropName,
    cropType,
    landSize,
    plantingQuantity,
    expectedQuantity,
    plantingDate,
    expectedDate,
    locationId,
  } = req.body;

  if (
    !cropName ||
    !cropType ||
    !landSize ||
    !plantingQuantity ||
    !expectedQuantity ||
    !plantingDate ||
    !expectedDate ||
    !locationId
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const crop = new Crop({
    cropName,
    cropType,
    landSize,
    plantingQuantity,
    expectedQuantity,
    plantingDate,
    expectedDate,
    locationId,
  });

  try {
    const newCrop = await crop.save();
    res.status(201).json(newCrop);
  } catch (err) {
    res.status(400).json({ message: "Failed to create crop", error: err.message });
  }
};

// Update a crop
exports.updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: "Crop not found" });

    crop.cropName = req.body.cropName || crop.cropName;
    crop.cropType = req.body.cropType || crop.cropType;
    crop.landSize = req.body.landSize || crop.landSize;
    crop.plantingQuantity = req.body.plantingQuantity || crop.plantingQuantity;
    crop.expectedQuantity = req.body.expectedQuantity || crop.expectedQuantity;
    crop.plantingDate = req.body.plantingDate || crop.plantingDate;
    crop.expectedDate = req.body.expectedDate || crop.expectedDate;

    const updatedCrop = await crop.save();
    res.status(200).json(updatedCrop);
  } catch (err) {
    res.status(400).json({ message: "Failed to update crop", error: err.message });
  }
};

// Delete a crop
exports.deleteCrop = async (req, res) => {
  try {
    const result = await Crop.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Crop not found" });
    res.status(200).json({ message: "Crop deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete crop", error: err.message });
  }
};
