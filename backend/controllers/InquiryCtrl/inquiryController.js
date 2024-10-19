const Inquiry = require("../../models/Inquiry/Inquiry");

class InquiryController {
  static instance;

  constructor() {
    if (InquiryController.instance) {
      throw new Error(
        "Cannot instantiate directly. Use InquiryController.getInstance() instead."
      );
    }
  }

  static getInstance() {
    if (!InquiryController.instance) {
      InquiryController.instance = new InquiryController();
    }
    return InquiryController.instance;
  }

  // Create a new inquiry
  async createInquiry(req, res) {
    try {
      const { topic, message } = req.body;

      // Validate required fields
      if (!topic || !message) {
        return res
          .status(400)
          .json({ message: "Topic and message are required." });
      }

      const newInquiry = new Inquiry({ topic, message });
      await newInquiry.save();
      res.status(201).json({ message: "Inquiry added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to create inquiry", error });
    }
  }

  // Get all inquiries
  async getAllInquiries(req, res) {
    try {
      const inquiries = await Inquiry.find();
      res.status(200).json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiries", error });
    }
  }

  // Get inquiry by ID
  async getInquiryById(req, res) {
    try {
      const inquiry = await Inquiry.findById(req.params.id);
      if (!inquiry)
        return res.status(404).json({ message: "Inquiry not found" });
      res.status(200).json(inquiry);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiry", error });
    }
  }

  // Update inquiry status
  async updateInquiryStatus(req, res) {
    try {
      const inquiry = await Inquiry.findById(req.params.id);
      if (!inquiry)
        return res.status(404).json({ message: "Inquiry not found" });

      inquiry.status = req.body.status || inquiry.status;
      await inquiry.save();
      res.status(200).json({ message: "Inquiry updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update inquiry", error });
    }
  }

  // Delete an inquiry
  async deleteInquiry(req, res) {
    try {
      const inquiry = await Inquiry.findById(req.params.id);
      if (!inquiry)
        return res.status(404).json({ message: "Inquiry not found" });

      await inquiry.deleteOne();
      res.status(200).json({ message: "Inquiry deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete inquiry", error });
    }
  }
}

module.exports = InquiryController.getInstance();
