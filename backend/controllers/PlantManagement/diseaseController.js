const Disease = require("../../models/PlantManagement/Disease");

// Get all diseases by plant ID
exports.getDiseasesByPlantId = async (req, res) => {
  try {
    const diseases = await Disease.find({ plantId: req.params.plantId });
    res.status(200).json(diseases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single disease by ID
exports.getDiseaseById = async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id);
    if (!disease) return res.status(404).json({ message: "Disease not found" });
    res.status(200).json(disease);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new disease
exports.createDisease = async (req, res) => {
  const disease = new Disease({
    name: req.body.name,
    causalAgent: req.body.causalAgent,
    diseaseTransmission: req.body.diseaseTransmission,
    diseaseSymptoms: req.body.diseaseSymptoms,
    control: req.body.control,
    fertilizers: req.body.fertilizers, // Expecting an array
    plantId: req.body.plantId,
    imageUrl: req.body.imageUrl, // New field
  });

  try {
    const newDisease = await disease.save();
    res.status(201).json(newDisease);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a disease
exports.updateDisease = async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id);
    if (!disease) return res.status(404).json({ message: "Disease not found" });

    disease.name = req.body.name || disease.name;
    disease.causalAgent = req.body.causalAgent || disease.causalAgent;
    disease.diseaseTransmission =
      req.body.diseaseTransmission || disease.diseaseTransmission;
    disease.diseaseSymptoms =
      req.body.diseaseSymptoms || disease.diseaseSymptoms;
    disease.control = req.body.control || disease.control;
    disease.fertilizers = req.body.fertilizers || disease.fertilizers; // Expecting an array
    disease.imageUrl = req.body.imageUrl || disease.imageUrl; // New field

    const updatedDisease = await disease.save();
    res.status(200).json(updatedDisease);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a disease
exports.deleteDisease = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Disease.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ message: "Disease not found" });
    res.status(200).json({ message: "Disease Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
