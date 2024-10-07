import React from 'react';
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';

const CardPayment = () => {
  return (
    <div className="min-h-screen bg-green-200 p-6 flex justify-center items-center">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6">

      <Link to="/dashboard/make-payment">
          <MdOutlineArrowBackIosNew className="text-3xl mb-4" />
        </Link>

        {/* Header Section */}
        <h2 className="text-center text-2xl font-bold mb-4">Card Payment</h2>

        {/* Card Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Card Type</label>
          <select className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400">
            <option value="">Select Card Type</option>
            <option value="visa">Visa</option>
            <option value="mastercard">MasterCard</option>
            <option value="amex">American Express</option>
          </select>
        </div>

        {/* Card Number Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
          <input 
            type="text" 
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter card number"
          />
        </div>

        {/* Name on Card */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Name on Card</label>
          <input 
            type="text" 
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter name as on card"
          />
        </div>

        {/* Expiration Date */}
        <div className="mb-4 flex space-x-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiration Date</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="MM/YY"
            />
          </div>
          {/* CVV */}
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="CVV"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600">
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default CardPayment;
