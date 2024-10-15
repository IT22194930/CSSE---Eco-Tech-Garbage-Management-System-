// controllers/inquiryController.js
const Inquiry = require("../../models/Inquiry/Inquiry");

// Create a new inquiry
const createInquiry = async (req, res) => {
  try {
    const { topic, message } = req.body;
    const newInquiry = new Inquiry({ topic, message });
    await newInquiry.save();
    res.status(201).json({ message: "Inquiry added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to create inquiry", error });
  }
};

// Get all inquiries
const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find();
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inquiries", error });
  }
};

// Get inquiry by ID
const getInquiryById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
    res.status(200).json(inquiry);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inquiry", error });
  }
};

// Update inquiry status
const updateInquiryStatus = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

    inquiry.status = req.body.status || inquiry.status;
    await inquiry.save();
    res.status(200).json({ message: "Inquiry updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update inquiry", error });
  }
};

// Delete an inquiry
const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

    await inquiry.deleteOne();
    res.status(200).json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete inquiry", error });
  }
};

module.exports = {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
};
