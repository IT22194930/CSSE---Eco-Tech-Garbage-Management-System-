const GarbageRequest = require("../../models/GarbageRequest/garbageRequest");

// Create a new garbage request
exports.createGarbageRequest = async (req, res) => {
  try {
    const request = new GarbageRequest({ ...req.body });
    const result = await request.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Get garbage requests by User ID
exports.getGarbageRequestsByUserId = async (req, res) => {
  try {
    const { userId } = req.query; // Retrieve userId from query parameters
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const requests = await GarbageRequest.find({ userId });
    if (requests.length === 0) {
      return res
        .status(404)
        .json({ message: "No requests found for this user." });
    }
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Get garbage request by ID
exports.getGarbageRequestById = async (req, res) => {
  try {
    const request = await GarbageRequest.findById(req.params.id);
    if (!request) {
      return res
        .status(404)
        .json({ error: true, message: "Request not found" });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Get all garbage requests
exports.getGarbageRequests = async (req, res) => {
  try {
    const requests = await GarbageRequest.find();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Update a garbage request by ID
exports.updateGarbageRequest = async (req, res) => {
  try {
    const request = await GarbageRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (request) {
      res.json(request);
    } else {
      res.status(404).json({ error: true, message: "Request not found" });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Delete a garbage request by ID
exports.deleteGarbageRequest = async (req, res) => {
  try {
    const result = await GarbageRequest.findByIdAndDelete(req.params.id);
    if (result) {
      res.json({ message: "Request deleted successfully" });
    } else {
      res.status(404).json({ error: true, message: "Request not found" });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Get all pending garbage requests
exports.getPendingGarbageRequests = async (req, res) => {
   try {
     const pendingRequests = await GarbageRequest.find({ status: "Pending" });
     res.status(200).json(pendingRequests);
   } catch (error) {
     res.status(500).json({ error: true, message: error.message });
   }
 };

// Get all accepted garbage requests
exports.getAcceptedGarbageRequests = async (req, res) => {
  try {
    const acceptedRequests = await GarbageRequest.find({ status: "Accepted" });
    res.status(200).json(acceptedRequests);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Get all declined garbage requests
exports.getRejectedGarbageRequests = async (req, res) => {
  try {
    const declinedRequests = await GarbageRequest.find({ status: "Rejected" });
    res.status(200).json(declinedRequests);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};