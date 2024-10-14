import React, {useEffect, useState} from 'react';
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { Link } from 'react-router-dom';
import axios, {HttpStatusCode} from "axios";
import useUser from "../../hooks/useUser.jsx";

const PaymentHistory = () => {
  const { currentUser } = useUser();
  const [transactionLog, setTransactionLog] = useState([]);

  useEffect(() => {
    const fetchTransactionLog = async () => {
      if (currentUser) {
        try {
          const response = await axios.get(`http://localhost:3000/api/payments/transactionLog/${currentUser._id}`);
          if (response.status === HttpStatusCode.Ok) {
            setTransactionLog(response.data.transactionLog)
          }
        } catch (error) {
          console.error('Payment error:', error);
        }
      }
    };

    fetchTransactionLog();
  }, [currentUser]);
  return (
    <div className="min-h-screen bg-green-200 p-6 flex justify-center items-center">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg overflow-hidden">
        
       
        <Link to="/payments">
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
          {transactionLog.map((transaction, index) => (
              <div key={index} className="bg-yellow-100 p-4 rounded-md shadow-md mb-4">
                <p className={"font-bold"+ (transaction.amount > 0 ? " text-red-600" : " text-green-600") }>{transaction.transactionType}</p>
                <p>Rs. {transaction.amount.toFixed(2)}</p>
                <p>{transaction.date}</p>
                <p>{transaction?.description}</p>
              </div>
          ))}
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
