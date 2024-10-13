import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


const PaymentHome = () => {
  const [amount, setAmount] = useState(0);
    const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-green-200 p-6 flex justify-center items-center">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg overflow-hidden">
        
      

        {/* Image Section */}
        <div className="flex justify-center py-4 bg-green-100">
          <img
            src="/path-to-your-garbage-truck-image" // Replace with your image path
            alt="Garbage Truck"
            className="h-48 w-auto"
          />
        </div>

        {/* Total Due Amount Section */}
        <div className="bg-yellow-200 text-center py-4">
          <p className="text-xl font-semibold">Total Due Amount</p>
          <p className="text-2xl text-red-600 font-bold">Rs. 5400.00</p>
          <p className="text-sm">Overdue On: 20/08/2024</p>
        </div>

        {/* Payment Overdue Section */}
        <div className="bg-red-200 text-center py-4 px-4">
          <p className="text-xl font-bold text-red-600">Payment Overdue!!</p>
          <p className="text-sm text-gray-700">
            Dear customer, unfortunately one or more of your payments are overdue,
            hence a fine has been added.
          </p>
          <p className="text-sm text-gray-700">
            The total overdue charges including the fine is found below,
          </p>
          <p className="text-2xl text-red-600 font-bold">Total Overdue Amount: Rs. 12420.00</p>
          <button className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600">
            More Details!!
          </button>
        </div>

        {/* Buttons Section */}
        <div className="p-4 space-y-4">
          <button 
            onClick={() => navigate(`/payments/make-payment`)}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600">
            Make Payments
          </button>
          
          <button 
            onClick={() => navigate(`payments/payment-history`)}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600">
            View Payment History
          </button>
          
          <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600">
            Cash Back Program
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentHome;
