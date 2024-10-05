const express = require("express");
const router = express.Router();
const {
  createGarbageRequest,
  getGarbageRequests,
  getGarbageRequestsByUserId,
  getGarbageRequestById,
  updateGarbageRequest,
  deleteGarbageRequest,
  getRejectedGarbageRequests,
  getAcceptedGarbageRequests,
} = require("../../controllers/GarbageRequests/garbageRequestController");

// Route to create a new garbage request
router.post("/createGarbageRequest", createGarbageRequest);

// Route to get all garbage requests
router.get("/", getGarbageRequests);

// Route to get garbage requests by User ID
router.get("/user", getGarbageRequestsByUserId); // Change to /user for query params

// Route to get all accepted garbage requests
router.get("/accepted", getAcceptedGarbageRequests);

// Route to get all declined garbage requests
router.get("/rejected", getRejectedGarbageRequests);

// Route to get a single garbage request by ID
router.get("/:id", getGarbageRequestById); // New route to get by ID

// Route to update a garbage request by ID
router.put("/:id", updateGarbageRequest);

// Route to delete a garbage request by ID
router.delete("/:id", deleteGarbageRequest);

module.exports = router;
