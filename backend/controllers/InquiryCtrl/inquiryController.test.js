const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Inquiry = require("../../models/Inquiry/Inquiry");
const inquiryController = require("../../controllers/InquiryCtrl/inquiryController");

jest.mock("../../models/Inquiry/Inquiry");

const app = express();
app.use(bodyParser.json());

app.post("/api/inquiries", inquiryController.createInquiry);
app.get("/api/inquiries", inquiryController.getAllInquiries);
app.get("/api/inquiries/:id", inquiryController.getInquiryById);

describe("Inquiry Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/inquiries", () => {
    // Positive Test Case: Successfully create an inquiry
    it("should create a new inquiry successfully", async () => {
      // Arrange
      const requestBody = {
        topic: "Test Inquiry",
        message: "This is a test inquiry message",
      };
      Inquiry.prototype.save = jest.fn().mockResolvedValueOnce(true);

      const response = await request(app)
        .post("/api/inquiries")
        .send(requestBody);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Inquiry added successfully");
      expect(Inquiry.prototype.save).toHaveBeenCalledTimes(1);
    });

    // Negative Test Case: Validation fails when required fields are missing
    it("should return 400 if required fields are missing", async () => {
      const response = await request(app)
        .post("/api/inquiries")
        .send({ topic: "" });
      expect(response.status).toBe(400);
    });

    // Negative Test Case: Internal server error during inquiry creation
    it("should handle server errors during inquiry creation", async () => {
      // Arrange
      const requestBody = {
        topic: "Test Inquiry",
        message: "This is a test inquiry message",
      };
      Inquiry.prototype.save = jest
        .fn()
        .mockRejectedValueOnce(new Error("Server error"));

      const response = await request(app)
        .post("/api/inquiries")
        .send(requestBody);

      // Assert
      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Failed to create inquiry");
      expect(Inquiry.prototype.save).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /api/inquiries", () => {
    // Positive Test Case: Successfully get all inquiries
    it("should fetch all inquiries successfully", async () => {
      // Arrange
      const mockInquiries = [
        { _id: "1", topic: "Test Inquiry 1", message: "Message 1" },
        { _id: "2", topic: "Test Inquiry 2", message: "Message 2" },
      ];
      Inquiry.find = jest.fn().mockResolvedValueOnce(mockInquiries);

      const response = await request(app).get("/api/inquiries");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockInquiries);
      expect(Inquiry.find).toHaveBeenCalledTimes(1);
    });

    // Negative Test Case: Internal server error during fetching inquiries
    it("should handle server errors while fetching inquiries", async () => {
      // Arrange
      Inquiry.find = jest.fn().mockRejectedValueOnce(new Error("Server error"));

      const response = await request(app).get("/api/inquiries");

      // Assert
      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Failed to fetch inquiries");
      expect(Inquiry.find).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /api/inquiries/:id", () => {
    // Positive Test Case: Successfully get an inquiry by ID
    it("should fetch an inquiry by ID successfully", async () => {
      // Arrange
      const mockInquiry = {
        _id: "1",
        topic: "Test Inquiry",
        message: "Test message",
      };
      Inquiry.findById = jest.fn().mockResolvedValueOnce(mockInquiry);

      const response = await request(app).get("/api/inquiries/1");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockInquiry);
      expect(Inquiry.findById).toHaveBeenCalledWith("1");
      expect(Inquiry.findById).toHaveBeenCalledTimes(1);
    });

    // Negative Test Case: Return 404 if inquiry not found
    it("should return 404 if inquiry is not found", async () => {
      // Arrange
      Inquiry.findById = jest.fn().mockResolvedValueOnce(null);

      const response = await request(app).get("/api/inquiries/1");

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Inquiry not found");
      expect(Inquiry.findById).toHaveBeenCalledWith("1");
    });

    // Negative Test Case: Internal server error while fetching inquiry by ID
    it("should handle server errors while fetching inquiry by ID", async () => {
      // Arrange
      Inquiry.findById = jest
        .fn()
        .mockRejectedValueOnce(new Error("Server error"));

      const response = await request(app).get("/api/inquiries/1");

      // Assert
      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Failed to fetch inquiry");
      expect(Inquiry.findById).toHaveBeenCalledWith("1");
    });
  });
});
