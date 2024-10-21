const GarbageRequest = require("../../models/GarbageRequest/garbageRequest");
const GarbageRequestController = require("./garbageRequestController");

jest.mock("../../models/GarbageRequest/garbageRequest");

describe("GarbageRequestController", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Test case 1: Positive - createGarbageRequest
  it("should create a new garbage request successfully", async () => {
    const mockRequestData = { userId: "123", status: "Pending", description: "Request test" };
    const mockSavedRequest = { ...mockRequestData, _id: "abc123" };

    // Mock the save method to return the mock saved data
    GarbageRequest.prototype.save = jest.fn().mockResolvedValue(mockSavedRequest);

    req.body = mockRequestData;

    await GarbageRequestController.createGarbageRequest(req, res);

    expect(GarbageRequest.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockSavedRequest);
  });

  // Test case 2: Negative - createGarbageRequest with error
  it("should return 500 if createGarbageRequest fails", async () => {
    const mockError = new Error("Something went wrong");

    GarbageRequest.prototype.save = jest.fn().mockRejectedValue(mockError);

    await GarbageRequestController.createGarbageRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: true, message: mockError.message });
  });

  // Test case 3: Positive - getGarbageRequestsByUserId
  it("should return garbage requests for a given user", async () => {
    const mockUserId = "123";
    const mockRequests = [{ userId: "123", status: "Pending" }];
    req.query = { userId: mockUserId };

    GarbageRequest.find = jest.fn().mockResolvedValue(mockRequests);

    await GarbageRequestController.getGarbageRequestsByUserId(req, res);

    expect(GarbageRequest.find).toHaveBeenCalledWith({ userId: mockUserId });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockRequests);
  });

  // Test case 4: Negative - getGarbageRequestsByUserId with no userId
  it("should return 400 if userId is not provided", async () => {
    req.query = {};

    await GarbageRequestController.getGarbageRequestsByUserId(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "User ID is required" });
  });

  // Test case 5: Positive - updateGarbageRequest
  it("should update an existing garbage request", async () => {
    const mockRequestId = "abc123";
    const mockUpdateData = { status: "Accepted" };
    const mockUpdatedRequest = { _id: mockRequestId, status: "Accepted" };

    req.params.id = mockRequestId;
    req.body = mockUpdateData;

    GarbageRequest.findByIdAndUpdate = jest
      .fn()
      .mockResolvedValue(mockUpdatedRequest);

    await GarbageRequestController.updateGarbageRequest(req, res);

    expect(GarbageRequest.findByIdAndUpdate).toHaveBeenCalledWith(
      mockRequestId,
      mockUpdateData,
      { new: true }
    );
    expect(res.json).toHaveBeenCalledWith(mockUpdatedRequest);
  });

  // Test case 6: Negative - updateGarbageRequest with error
  it("should return 404 if garbage request not found", async () => {
    req.params.id = "nonexistent-id";
    GarbageRequest.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

    await GarbageRequestController.updateGarbageRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: true, message: "Request not found" });
  });
});
