const GarbageRequest = require("../../models/GarbageRequest/garbageRequest");

class GarbageRequestController {
  // Step 2: Create a private static instance variable
  static instance;

  // Step 3: Create a private constructor to prevent direct instantiation
  constructor() {
    if (GarbageRequestController.instance) {
      throw new Error("Use GarbageRequestController.getInstance() to get an instance.");
    }
  }

  // Step 4: Create a static method to get the single instance
  static getInstance() {
    if (!GarbageRequestController.instance) {
      GarbageRequestController.instance = new GarbageRequestController();
    }
    return GarbageRequestController.instance;
  }

  // Create a new garbage request
  async createGarbageRequest(req, res) {
    try {
      const request = new GarbageRequest({ ...req.body });
      const result = await request.save();
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
  }

  // Get garbage requests by User ID
  async getGarbageRequestsByUserId(req, res) {
    try {
      const { userId } = req.query;
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
  }

  // Get garbage request by ID
  async getGarbageRequestById(req, res) {
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
  }

  // Get all garbage requests
  async getGarbageRequests(req, res) {
    try {
      const requests = await GarbageRequest.find();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
  }

  // Update a garbage request by ID
  async updateGarbageRequest(req, res) {
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
  }

  // Delete a garbage request by ID
  async deleteGarbageRequest(req, res) {
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
  }

  // Get all pending garbage requests
  async getPendingGarbageRequests(req, res) {
    try {
      const pendingRequests = await GarbageRequest.find({ status: "Pending" });
      res.status(200).json(pendingRequests);
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
  }

  // Get all accepted garbage requests
  async getAcceptedGarbageRequests(req, res) {
    try {
      const acceptedRequests = await GarbageRequest.find({ status: "Accepted" });
      res.status(200).json(acceptedRequests);
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
  }

  // Get all declined garbage requests
  async getRejectedGarbageRequests(req, res) {
    try {
      const declinedRequests = await GarbageRequest.find({ status: "Rejected" });
      res.status(200).json(declinedRequests);
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
  }

  // Get a single user's pending garbage requests
  async getUserPendingGarbageRequests(req, res) {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const pendingRequests = await GarbageRequest.find({
        userId,
        status: "Pending",
      });
      if (pendingRequests.length === 0) {
        return res
          .status(404)
          .json({ message: "No pending requests found for this user." });
      }
      res.status(200).json(pendingRequests);
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
  }

  // Get a single user's accepted garbage requests
  async getUserAcceptedGarbageRequests(req, res) {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const acceptedRequests = await GarbageRequest.find({
        userId,
        status: "Accepted",
      });
      if (acceptedRequests.length === 0) {
        return res
          .status(404)
          .json({ message: "No accepted requests found for this user." });
      }
      res.status(200).json(acceptedRequests);
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
  }

  // Get a single user's declined garbage requests
  async getUserRejectedGarbageRequests(req, res) {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const rejectedRequests = await GarbageRequest.find({
        userId,
        status: "Rejected",
      });
      if (rejectedRequests.length === 0) {
        return res
          .status(404)
          .json({ message: "No declined requests found for this user." });
      }
      res.status(200).json(rejectedRequests);
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
  }
}

// Step 5: Export a single instance of the controller
module.exports = GarbageRequestController.getInstance();
