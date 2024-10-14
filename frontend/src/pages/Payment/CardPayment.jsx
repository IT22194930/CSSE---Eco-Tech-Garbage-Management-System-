import React, { useState } from 'react';
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import useUser from "../../hooks/useUser";
import visa from '../../assets/gallery/cards/visa.png';
import master from '../../assets/gallery/cards/mastercard.png';
import amex from '../../assets/gallery/cards/amex.png';
import axios from 'axios';

const CardPayment = () => {
  const { currentUser } = useUser();
  const [cardNumber, setCardNumber] = useState('');
  const [formattedCardNumber, setFormattedCardNumber] = useState('');
  const [cardType, setCardType] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [cvv, setCvv] = useState('');
  const location = useLocation();
  const { amount } = location.state || {};

  // Function to detect card type based on card number
  const detectCardType = (number) => {
    const visaRegex = /^4[0-9]{0,}$/; // Visa starts with 4
    const mastercardRegex = /^5[1-5][0-9]{0,}$/; // MasterCard starts with 51-55
    const amexRegex = /^3[47][0-9]{0,}$/; // American Express starts with 34 or 37

    if (visaRegex.test(number)) {
      return 'visa';
    } else if (mastercardRegex.test(number)) {
      return 'mastercard';
    } else if (amexRegex.test(number)) {
      return 'amex';
    } else {
      return ''; // Unknown card type
    }
  };

  // Format the card number with spaces
  const formatCardNumber = (number) => {
    return number.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  // Handle card number input change and card type detection
  const handleCardNumberChange = (e) => {
    let number = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    const formattedNumber = formatCardNumber(number); // Format card number
    setFormattedCardNumber(formattedNumber);
    setCardNumber(number);

    const detectedCardType = detectCardType(number);
    setCardType(detectedCardType);
  };

  // Handle expiration date input (MM/YY)
  const handleExpiryDateChange = (e) => {
    let input = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    if (input.length <= 4) {
      if (input.length > 2) {
        input = `${input.slice(0, 2)}/${input.slice(2)}`; // Format as MM/YY
      }
      setExpiryDate(input);
    }
  };

  const handleCardHolderNameChange = (e) => {
    const input = e.target.value;
    setCardHolderName(input);
  };

  // Handle CVV input (3 or 4 digits based on card type)
  const handleCvvChange = (e) => {
    const maxCvvLength = cardType === 'amex' ? 4 : 3; // American Express uses 4 digits for CVV, others use 3
    const input = e.target.value.replace(/\D/g, '').slice(0, maxCvvLength);
    setCvv(input);
  };

  // Function to render the card type logo
  const renderCardTypeLogo = () => {
    switch (cardType) {
      case 'visa':
        return <img src={visa} alt="Visa" className="w-10 h-10" />;
      case 'mastercard':
        return <img src={master} alt="MasterCard" className="w-10 h-10" />;
      case 'amex':
        return <img src={amex} alt="AmericanExpress" className="w-10 h-10" />;
      default:
        return <div className="w-10 h-10 bg-gray-200 rounded"></div>; // Empty placeholder
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/payments/processPayment', {
        amount: Number(amount) ,
        paymentMethodId: paymentMethod.id,
      });

      if (response.data.success) {
        alert('Payment successful!');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed');
    }
  };

  return (
      <div className="min-h-screen bg-green-200 p-6 flex justify-center items-center">
        <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6">
          <Link to="../../payments/make-payment">
            <MdOutlineArrowBackIosNew className="text-3xl mb-4" />
          </Link>

          {/* Header Section */}
          <h2 className="text-center text-2xl font-bold mb-4">Card Payment</h2>

          <form onSubmit={handleSubmit}> {/* Add form tag */}
            {/* Card Number Input with Card Type Image */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
              <div className="flex items-center">
                {renderCardTypeLogo()} {/* Card type image */}
                <input
                    type="text"
                    value={formattedCardNumber}
                    onChange={handleCardNumberChange}
                    maxLength="19" // Maximum length including spaces (16 digits + 3 spaces)
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 ml-4"
                    placeholder="Enter card number"
                />
              </div>
            </div>

            {/* Name on Card */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Name on Card</label>
              <input
                  type="text"
                  onChange={handleCardHolderNameChange}
                  value={cardHolderName}
                  className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Enter name as on card"
              />
            </div>

            {/* Expiration Date and CVV */}
            <div className="mb-4 flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiration Date</label>
                <input
                    type="text"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    maxLength="5" // MM/YY format has a max length of 5
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="MM/YY"
                />
              </div>
              {/* CVV */}
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                <input
                    type="password"
                    value={cvv}
                    onChange={handleCvvChange}
                    maxLength={cardType === 'amex' ? 4 : 3} // Max length depends on card type
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="CVV"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Pay - Rs. {amount}
            </button>
          </form>
        </div>
      </div>
  );
};

export default CardPayment;
