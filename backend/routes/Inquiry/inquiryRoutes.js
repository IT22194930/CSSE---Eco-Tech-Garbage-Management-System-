// routes/inquiryRoutes.js
const express = require("express");
const {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
} = require("../../controllers/InquiryCtrl/inquiryController");

const router = express.Router();

// Create a new inquiry
router.post("/", createInquiry);

// Get all inquiries
router.get("/", getAllInquiries);

// Get inquiry by ID
router.get("/:id", getInquiryById);

// Update inquiry status
router.put("/:id", updateInquiryStatus);

// Delete an inquiry
router.delete("/:id", deleteInquiry);

module.exports = router;
