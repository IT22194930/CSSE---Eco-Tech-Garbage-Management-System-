const request = require('supertest');
const express = require('express');
const PaymentController = require('../../controllers/Payment/paymentController');
const User = require('../../models/User/User');
const TransactionLog = require('../../models/User/TransactionLog');
const PaymentGateway = require('../../services/PaymentGateway');
const UserTransactionService = require('../../services/UserTransactionService');

// Mocking the necessary modules
jest.mock('../../models/User/User');
jest.mock('../../models/User/TransactionLog');
jest.mock('../../services/PaymentGateway');
jest.mock('../../services/UserTransactionService');

const app = express();
app.use(express.json());
app.use('/api/payment', PaymentController);

// Sample test data
const mockUser = {
  _id: 'user1',
  name: 'John Doe',
  balance: 5000,
};
const mockTransactionLogs = [
  { userId: 'user1', amount: 100, transactionType: 'Debit', date: new Date() },
];

// Mock Payment Gateway methods
PaymentGateway.getInstance().validateCardDetails = jest.fn();
PaymentGateway.getInstance().createPaymentIntent = jest.fn();
PaymentGateway.getInstance().confirmPayment = jest.fn();

// Mock UserTransactionService methods
UserTransactionService.getInstance().updateAccountBalance = jest.fn();

// Unit tests
describe('PaymentController Tests', () => {
  
  // Test case 1: Positive test for getTotalDueAmount
  test('should return user balance and overdue status', async () => {
    User.findById.mockResolvedValue(mockUser); // Mocking User model
    const res = await request(app).get('/api/payment/totalDue/user1');
    
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ balance: 5000, isOverDue: false });
  });

  // Test case 2: Negative test for getTotalDueAmount (invalid user)
  test('should return 401 for invalid user ID', async () => {
    User.findById.mockResolvedValue(null); // User does not exist
    const res = await request(app).get('/api/payment/totalDue/invalidUserId');
    
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid User ID.');
  });

  // Test case 3: Positive test for getTransactionLog
  test('should return transaction logs for user', async () => {
    TransactionLog.find.mockResolvedValue(mockTransactionLogs); // Mock transaction logs
    const res = await request(app).get('/api/payment/transactionLogs/user1');
    
    expect(res.status).toBe(200);
    expect(res.body.transactionLog).toEqual(mockTransactionLogs);
  });

  // Test case 4: Negative test for getTransactionLog (no logs found)
  test('should return empty array if no transaction logs exist', async () => {
    TransactionLog.find.mockResolvedValue([]); // No transaction logs
    const res = await request(app).get('/api/payment/transactionLogs/user1');
    
    expect(res.status).toBe(200);
    expect(res.body.transactionLog).toEqual([]);
  });

  // Test case 5: Positive test for confirmPayment (valid card details)
  test('should confirm payment and update balance on success', async () => {
    const paymentData = {
      userId: 'user1',
      clientSecret: 'mock_client_secret',
      amount: 100,
      cardNumber: '4242424242424242',
      cvv: '123',
      expiryDate: '12/25',
    };
    
    PaymentGateway.getInstance().validateCardDetails.mockReturnValue(true);
    PaymentGateway.getInstance().confirmPayment.mockReturnValue('succeeded');

    const res = await request(app).post('/api/payment/confirm').send(paymentData);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Payment Successful');
  });

  // Test case 6: Negative test for confirmPayment (invalid card details)
  test('should fail payment due to invalid card details', async () => {
    const paymentData = {
      userId: 'user1',
      clientSecret: 'mock_client_secret',
      amount: 100,
      cardNumber: '1234567890123456',
      cvv: '123',
      expiryDate: '12/25',
    };

    PaymentGateway.getInstance().validateCardDetails.mockReturnValue(false); // Invalid card

    const res = await request(app).post('/api/payment/confirm').send(paymentData);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid Card Details1');
    expect(res.body.success).toBe(false);
  });
});
