const request = require("supertest"); // Supertest is used for HTTP assertions
const express = require("express");
const WastePaymentController = require("../CollectorCtrl/wastePaymentController");
const UserTransactionService = require("../../services/UserTransactionService");

// Mocking the UserTransactionService instance
jest.mock("../../services/UserTransactionService");

const app = express();
app.use(express.json());

// Routes for testing the controller methods
app.post("/addCashBack", (req, res) =>
  WastePaymentController.addCashBack(req, res)
);
app.post("/addAdditionalPrice", (req, res) =>
  WastePaymentController.addAdditionalPrice(req, res)
);

describe("WastePaymentController", () => {
  const userId = "60b9c9c8f6b1c545d0c3e123";
  let transactionServiceInstance;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear any mock states before each test
    transactionServiceInstance = {
      updateAccountBalance: jest.fn(), // Mock the updateAccountBalance method
    };

    // Mock the static getInstance method to return the mocked service instance
    UserTransactionService.getInstance.mockReturnValue(
      transactionServiceInstance
    );
  });

  // Test suite for the addCashBack method
  describe("addCashBack", () => {
    // Positive test case: should update account balance successfully
    it("should update account balance and return success message (positive case)", async () => {
      // Mocking the successful response from updateAccountBalance
      transactionServiceInstance.updateAccountBalance.mockResolvedValueOnce();

      // Simulate a POST request to /addCashBack
      const response = await request(app)
        .post("/addCashBack")
        .send({ userId, amount: 50 }); // Sample request payload

      // Expect a successful status code and response message
      expect(response.status).toBe(200);
      expect(response.body).toBe("Account balance updated..");

      // Ensure the mocked method was called with correct parameters
      expect(
        transactionServiceInstance.updateAccountBalance
      ).toHaveBeenCalledWith(userId, -50, "Cash Back");
    });

    // Negative test case: should return an error if userId is missing
    it("should return error if userId is missing (negative case)", async () => {
      // Simulate a POST request with missing userId
      const response = await request(app)
        .post("/addCashBack")
        .send({ amount: 50 }); // Only amount is sent, no userId

      // Expect a 400 status code and appropriate error message
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "User ID is required" });
    });

    // Negative test case: should handle database errors gracefully
    it("should handle errors and return 500 status (negative case)", async () => {
      // Mocking a rejected promise to simulate a database error
      transactionServiceInstance.updateAccountBalance.mockRejectedValueOnce(
        new Error("Database error")
      );

      // Simulate a POST request
      const response = await request(app)
        .post("/addCashBack")
        .send({ userId, amount: 50 });

      // Expect a 500 status code and error message
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: true, message: "Database error" });
    });
  });

  // Test suite for the addAdditionalPrice method
  describe("addAdditionalPrice", () => {
    // Positive test case: should update account balance successfully
    it("should update account balance and return success message (positive case)", async () => {
      // Mocking the successful response from updateAccountBalance
      transactionServiceInstance.updateAccountBalance.mockResolvedValueOnce();

      // Simulate a POST request to /addAdditionalPrice
      const response = await request(app)
        .post("/addAdditionalPrice")
        .send({ userId, amount: 30 });

      // Expect a successful status code and response message
      expect(response.status).toBe(200);
      expect(response.body).toBe("Account balance updated..");

      // Ensure the mocked method was called with correct parameters
      expect(
        transactionServiceInstance.updateAccountBalance
      ).toHaveBeenCalledWith(userId, 30, "Special Waste Fee");
    });

    // Negative test case: should return an error if userId is missing
    it("should return error if userId is missing (negative case)", async () => {
      // Simulate a POST request with missing userId
      const response = await request(app)
        .post("/addAdditionalPrice")
        .send({ amount: 30 }); // Only amount is sent, no userId

      // Expect a 400 status code and appropriate error message
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "User ID is required" });
    });

    // Negative test case: should handle database errors gracefully
    it("should handle errors and return 500 status (negative case)", async () => {
      // Mocking a rejected promise to simulate a database error
      transactionServiceInstance.updateAccountBalance.mockRejectedValueOnce(
        new Error("Database error")
      );

      // Simulate a POST request
      const response = await request(app)
        .post("/addAdditionalPrice")
        .send({ userId, amount: 30 });

      // Expect a 500 status code and error message
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: true, message: "Database error" });
    });
  });
});
