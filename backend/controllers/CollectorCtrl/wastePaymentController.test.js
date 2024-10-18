// tests/CollectorCtrl/wastePaymentController.test.js
const request = require("supertest");
const express = require("express");
const WastePaymentController = require("../CollectorCtrl/wastePaymentController");
const UserTransactionService = require("../../services/UserTransactionService");

// Mocking the UserTransactionService instance
jest.mock("../../services/UserTransactionService");

const app = express();
app.use(express.json());
app.post("/addCashBack", (req, res) =>
  WastePaymentController.addCashBack(req, res)
);
app.post("/addAdditionalPrice", (req, res) =>
  WastePaymentController.addAdditionalPrice(req, res)
);

describe("WastePaymentController", () => {
  const userId = "60b9c9c8f6b1c545d0c3e123"; // Example user ID for testing
  let transactionServiceInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    transactionServiceInstance = {
      updateAccountBalance: jest.fn(),
    };

    // Mock getInstance to return the mock instance
    UserTransactionService.getInstance.mockReturnValue(
      transactionServiceInstance
    );
  });

  describe("addCashBack", () => {
    it("should update account balance and return success message (positive case)", async () => {
      transactionServiceInstance.updateAccountBalance.mockResolvedValueOnce();

      const response = await request(app)
        .post("/addCashBack")
        .send({ userId, amount: 50 });

      expect(response.status).toBe(200);
      expect(response.body).toBe("Account balance updated..");
      expect(
        transactionServiceInstance.updateAccountBalance
      ).toHaveBeenCalledWith(userId, -50, "Cash Back");
    });

    it("should return error if userId is missing (negative case)", async () => {
      const response = await request(app)
        .post("/addCashBack")
        .send({ amount: 50 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "User ID is required" });
    });

    it("should handle errors and return 500 status (negative case)", async () => {
      transactionServiceInstance.updateAccountBalance.mockRejectedValueOnce(
        new Error("Database error")
      );

      const response = await request(app)
        .post("/addCashBack")
        .send({ userId, amount: 50 });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: true, message: "Database error" });
    });
  });

  describe("addAdditionalPrice", () => {
    it("should update account balance and return success message (positive case)", async () => {
      transactionServiceInstance.updateAccountBalance.mockResolvedValueOnce();

      const response = await request(app)
        .post("/addAdditionalPrice")
        .send({ userId, amount: 30 });

      expect(response.status).toBe(200);
      expect(response.body).toBe("Account balance updated..");
      expect(
        transactionServiceInstance.updateAccountBalance
      ).toHaveBeenCalledWith(userId, 30, "Special Waste Fee");
    });

    it("should return error if userId is missing (negative case)", async () => {
      const response = await request(app)
        .post("/addAdditionalPrice")
        .send({ amount: 30 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "User ID is required" });
    });

    it("should handle errors and return 500 status (negative case)", async () => {
      transactionServiceInstance.updateAccountBalance.mockRejectedValueOnce(
        new Error("Database error")
      );

      const response = await request(app)
        .post("/addAdditionalPrice")
        .send({ userId, amount: 30 });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: true, message: "Database error" });
    });
  });
});
