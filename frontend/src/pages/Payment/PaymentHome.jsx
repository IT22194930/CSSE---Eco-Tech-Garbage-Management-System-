import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, {HttpStatusCode} from 'axios';
import useUser from '../../hooks/useUser.jsx';

const PaymentHome = () => {
    const [amount, setAmount] = useState(0);
    const navigate = useNavigate();
    const { currentUser } = useUser();
    const [ isOverDue, setIsOverDue ] = useState(false);

    useEffect(() => {
        const fetchDueAmount = async () => {
            if (currentUser) {
                try {
                    const response = await axios.get(`http://localhost:3000/api/payments/totalDueAmount/${currentUser._id}`);
                    if (response.status === HttpStatusCode.Ok) {
                        setAmount(Number(response.data.balance));
                        setIsOverDue(response.data.isOverDue);
                    }
                } catch (error) {
                    console.error('Payment error:', error);
                }
            }
        };

        fetchDueAmount();
    }, [currentUser]);

    return (
        <div className="min-h-screen bg-green-200 p-6 flex justify-center items-center">
            <div className="max-w-lg w-full bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Image Section */}
                <div className="flex justify-center py-4 bg-green-100">
                    <img
                        src="/path-to-your-garbage-truck-image" // Replace with your actual image path
                        alt="Garbage Truck"
                        className="h-48 w-auto"
                    />
                </div>

                {/* Total Due Amount Section */}
                {!isOverDue && <div className="bg-yellow-200 text-center py-4">
                    <p className="text-xl font-semibold">Total Due Amount</p>
                    <p className="text-2xl text-red-600 font-bold">Rs. {amount.toFixed(2)}</p>
                    <p className="text-sm">Overdue On: 20/08/2024</p>
                </div>}

                {/* Payment Overdue Section */}
                { isOverDue && <div className="bg-red-200 text-center py-4 px-4">
                    <p className="text-xl font-bold text-red-600">Payment Overdue!!</p>
                    <p className="text-sm text-gray-700">
                        Dear customer, unfortunately one or more of your payments are overdue,
                        hence a fine has been added.
                    </p>
                    <p className="text-sm text-gray-700">
                        The total overdue charges including the fine is found below,
                    </p>
                    <p className="text-2xl text-red-600 font-bold">Total Overdue Amount: Rs. {amount.toFixed(2)}</p>
                </div>}

                {/* Buttons Section */}
                <div className="p-4 space-y-4">
                    <button
                        onClick={() => navigate(`/payments/make-payment`)}
                        className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600"
                    >
                        Make Payments
                    </button>

                    <button
                        onClick={() => navigate(`/payments/payment-history`)}
                        className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600"
                    >
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
