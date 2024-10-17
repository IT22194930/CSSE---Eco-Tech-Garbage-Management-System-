const request = require('supertest');
const express = require('express');
const PaymentController = require('../../controllers/Payment/PaymentController');
const User = require('../../models/User/User');
const TransactionLog = require('../../models/User/TransactionLog');
const PaymentGateway = require('../../services/PaymentGateway');
const UserTransactionService = require('../../services/UserTransactionService');

jest.mock('../../models/User/User');
jest.mock('../../models/User/TransactionLog');
jest.mock('../../services/PaymentGateway');
jest.mock('../../services/UserTransactionService');

const app = express();
app.use(express.json());
app.get('/get-total-due/:userId', PaymentController.getTotalDueAmount);
app.get('/get-transaction-log/:userId', PaymentController.getTransactionLog);
app.post('/update-user-balance', PaymentController.updateUserAccountBalance);
app.post('/confirm-payment', PaymentController.confirmPayment);

describe('PaymentController Tests', () => {
  
  describe('getTotalDueAmount', () => {

    // Test case 1: Should return the correct balance when a valid user ID is provided
    it('should return the correct balance for a valid user', async () => {
      const mockUser = { _id: '123', balance: 5000 }; 
      User.findById.mockResolvedValue(mockUser); 

      const response = await request(app).get('/get-total-due/123'); 
      
      expect(response.status).toBe(200); 
      expect(response.body.balance).toBe(5000); 
      expect(response.body.isOverDue).toBe(false); 
    });

    // Test case 2: Should return 401 error if an invalid user ID is provided
    it('should return 401 for an invalid user ID', async () => {
      User.findById.mockResolvedValue(null); 

      const response = await request(app).get('/get-total-due/invalid-id'); 
      
      expect(response.status).toBe(401); 
      expect(response.body.message).toBe('Invalid USer ID.'); 
    });

    // Test case 3: Should return 500 on server error during user lookup
    it('should return 500 on server error', async () => {
      User.findById.mockRejectedValue(new Error('Server error')); 

      const response = await request(app).get('/get-total-due/123'); 

      expect(response.status).toBe(500); 
      expect(response.body.error).toBe(true); 
      expect(response.body.message).toBe('Server error'); 
    });
  });

  
  describe('getTransactionLog', () => {

    // Test case 1: Should return transaction log for a valid user with existing transactions
    it('should return transaction log for a valid user', async () => {
      const mockTransactionLog = [{ userId: '123', amount: 5000 }]; 
      TransactionLog.find.mockResolvedValue(mockTransactionLog); 

      const response = await request(app).get('/get-transaction-log/123'); 
      
      expect(response.status).toBe(200); 
      expect(response.body.transactionLog).toHaveLength(1); 
      expect(response.body.transactionLog[0].amount).toBe(5000); 
    });

    // Test case 2: Should return an empty transaction log if the user has no logs
    it('should return empty transaction log for a user with no logs', async () => {
      TransactionLog.find.mockResolvedValue([]); 

      const response = await request(app).get('/get-transaction-log/123'); 
      
      expect(response.status).toBe(200); 
      expect(response.body.transactionLog).toHaveLength(0); 
    });
    
    // Test case 3: Should return 500 on server error during transaction log lookup
    it('should return 500 on server error', async () => {
      TransactionLog.find.mockRejectedValue(new Error('Server error')); 

      const response = await request(app).get('/get-transaction-log/123'); 
      
      expect(response.status).toBe(500); 
      expect(response.body.error).toBe(true); 
      expect(response.body.message).toBe('Server error'); 
    });
  });

});
