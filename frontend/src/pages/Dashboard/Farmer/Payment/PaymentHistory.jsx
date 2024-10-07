import React from 'react';
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';

const PaymentHistory = () => {
  return (
    <div className="min-h-screen bg-green-200 p-6 flex justify-center items-center">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg overflow-hidden">
        
       
        <Link to="/dashboard/payments">
          <MdOutlineArrowBackIosNew className="text-3xl mb-4" />
        </Link>

        {/* Payment History Filter Section */}
        <div className="bg-green-100 p-4">
          <h2 className="text-center text-2xl font-bold text-brown-700 mb-4">Payment History</h2>
          
          <div className="flex justify-between space-x-2">
            <input
              type="date"
              className="border border-gray-400 rounded-md p-2 w-full"
              placeholder="DD/MM/YYYY"
            />
            <input
              type="date"
              className="border border-gray-400 rounded-md p-2 w-full"
              placeholder="DD/MM/YYYY"
            />
            <select
              className="border border-gray-400 rounded-md p-2 w-full"
            >
              <option value="all">Show All</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Payment Cards Section */}
        <div className="p-4 space-y-4">
          {/* Payment Completed Card */}
          <div className="bg-yellow-100 p-4 rounded-md shadow-md">
            <p className="font-bold text-green-600">Payment Completed</p>
            <p>Payment Date: 15/04/2024</p>
            <p>Amount: Rs. 5400.00</p>
            <p>Payment Mode: Credit Card</p>
            <button className="mt-2 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600">
              View Details
            </button>
          </div>

          {/* Payment Rejected Card */}
          <div className="bg-yellow-100 p-4 rounded-md shadow-md">
            <p className="font-bold text-red-600">Payment Rejected</p>
            <p>Payment Date: 13/04/2024</p>
            <p>Amount: Rs. 5400.00</p>
            <p>Payment Mode: Debit Card</p>
            <button className="mt-2 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600">
              View Details
            </button>
          </div>

          {/* Payment Completed Card */}
          <div className="bg-yellow-100 p-4 rounded-md shadow-md">
            <p className="font-bold text-green-600">Payment Completed</p>
            <p>Payment Date: 15/03/2024</p>
            <p>Amount: Rs. 5400.00</p>
            <p>Payment Mode: Debit Card</p>
            <button className="mt-2 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600">
              View Details
            </button>
          </div>

          {/* Payment Completed Card */}
          <div className="bg-yellow-100 p-4 rounded-md shadow-md">
            <p className="font-bold text-green-600">Payment Completed</p>
            <p>Payment Date: 12/02/2024</p>
            <p>Amount: Rs. 11610.00</p>
            <p>Payment Mode: Bank Transfer</p>
            <button className="mt-2 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600">
              View Details
            </button>
          </div>
        </div>

        {/* Go Back Button */}
        <div className="p-4">
          <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600">
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
