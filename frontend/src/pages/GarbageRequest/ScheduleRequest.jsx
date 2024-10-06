import React, { useState } from 'react';
import useUser from '../../hooks/useUser';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const ScheduleRequest = () => {
  const { currentUser } = useUser();
  const userId = currentUser?._id; // Ensure userId is safely accessed
  const axiosSecure = useAxiosSecure();

  const [activeTab, setActiveTab] = useState(0);
  const [requestInfo, setRequestInfo] = useState({
    type: '',
    quantity: '',
    description: ''
  });
  const [pickupDetails, setPickupDetails] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    district: '',
    province: '',
    postalCode: '',
    date: '',
    time: ''
  });

  const handleNext = () => {
    // Check if the current tab is valid before moving to the next tab
    if (activeTab === 0 && (requestInfo.type === '' || requestInfo.quantity === '')) {
      alert('Please fill out all required fields in Request Information.');
      return;
    }
    if (activeTab === 1 && (pickupDetails.addressLine1 === '' || pickupDetails.city === '' || pickupDetails.district === '' || pickupDetails.province === '' || pickupDetails.postalCode === '' || pickupDetails.date === '' || pickupDetails.time === '')) {
      alert('Please fill out all required fields in Pickup Details.');
      return;
    }
    setActiveTab(activeTab + 1);
  };

  const handlePrevious = () => {
    setActiveTab(activeTab - 1);
  };

  const handleChangeRequestInfo = (e) => {
    setRequestInfo({ ...requestInfo, [e.target.name]: e.target.value });
  };

  const handleChangePickupDetails = (e) => {
    setPickupDetails({ ...pickupDetails, [e.target.name]: e.target.value });
  };

  const handleConfirm = async () => {
    const requestData = {
      userId,
      ...requestInfo,
      ...pickupDetails,
    };

    try {
      const response = await axiosSecure.post('/api/garbageRequests/createGarbageRequest', requestData);

      if (response.status === 200 || response.status === 201) {
        alert('Request saved successfully!');
        // Reset the state or redirect if needed
        setRequestInfo({ type: '', quantity: '', description: '' });
        setPickupDetails({
          addressLine1: '',
          addressLine2: '',
          city: '',
          district: '',
          province: '',
          postalCode: '',
          date: '',
          time: ''
        });
        setActiveTab(0); // Optionally reset to the first tab
      } else {
        console.error("Response not OK:", response); // Log the response for debugging
        alert('Failed to save request. Please try again.');
      }
    } catch (error) {
      console.error("Error occurred:", error); // Log the error for debugging
      if (error.response) {
        alert('Error occurred: ' + error.response.data.message);
      } else {
        alert('Error occurred: ' + error.message);
      }
    }
  };

  return (
    <div className='mt-28 p-6 bg-white rounded-lg shadow-md'>
      <div className='flex justify-around mb-4'>
        <button className={`py-2 px-4 rounded-lg ${activeTab === 0 ? 'bg-blue-500 text-white' : 'bg-gray-200'} transition-colors duration-200`} onClick={() => setActiveTab(0)}>Request Information</button>
        <button className={`py-2 px-4 rounded-lg ${activeTab === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'} transition-colors duration-200`} onClick={() => setActiveTab(1)}>Pickup Details</button>
        <button className={`py-2 px-4 rounded-lg ${activeTab === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'} transition-colors duration-200`} onClick={() => setActiveTab(2)}>Review & Confirm</button>
      </div>

      {activeTab === 0 && (
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold'>Request Information</h2>
          <select name="type" onChange={handleChangeRequestInfo} className='w-full border border-gray-300 rounded-lg p-2' required>
            <option value="">Select Type</option>
            <option value="Bulk Waste">Bulk Waste</option>
            <option value="E Waste">E Waste</option>
            <option value="Hazardous Waste">Hazardous Waste</option>
            <option value="Other Special Waste">Other Special Waste</option>
          </select>
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            onChange={handleChangeRequestInfo}
            className='w-full border border-gray-300 rounded-lg p-2'
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChangeRequestInfo}
            className='w-full border border-gray-300 rounded-lg p-2'
          />
          <div className='flex justify-between'>
            <button className='py-2 px-4 bg-red-500 text-white rounded-lg' onClick={() => setActiveTab(0)}>Cancel</button>
            <button className='py-2 px-4 bg-blue-500 text-white rounded-lg' onClick={handleNext}>Next</button>
          </div>
        </div>
      )}

      {activeTab === 1 && (
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold'>Pickup Details</h2>
          <input
            type="text"
            name="addressLine1"
            placeholder="Address Line 1"
            onChange={handleChangePickupDetails}
            className='w-full border border-gray-300 rounded-lg p-2'
            required
          />
          <input
            type="text"
            name="addressLine2"
            placeholder="Address Line 2"
            onChange={handleChangePickupDetails}
            className='w-full border border-gray-300 rounded-lg p-2'
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            onChange={handleChangePickupDetails}
            className='w-full border border-gray-300 rounded-lg p-2'
            required
          />
          <input
            type="text"
            name="district"
            placeholder="District"
            onChange={handleChangePickupDetails}
            className='w-full border border-gray-300 rounded-lg p-2'
            required
          />
          <input
            type="text"
            name="province"
            placeholder="Province"
            onChange={handleChangePickupDetails}
            className='w-full border border-gray-300 rounded-lg p-2'
            required
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            onChange={handleChangePickupDetails}
            className='w-full border border-gray-300 rounded-lg p-2'
            required
          />
          <input
            type="date"
            name="date"
            onChange={handleChangePickupDetails}
            className='w-full border border-gray-300 rounded-lg p-2'
            required
          />
          <input
            type="time"
            name="time"
            onChange={handleChangePickupDetails}
            className='w-full border border-gray-300 rounded-lg p-2'
            required
          />
          <div className='flex justify-between'>
            <button className='py-2 px-4 bg-gray-500 text-white rounded-lg' onClick={handlePrevious}>Previous</button>
            <button className='py-2 px-4 bg-blue-500 text-white rounded-lg' onClick={handleNext}>Next</button>
          </div>
        </div>
      )}

      {activeTab === 2 && (
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold'>Review & Confirm</h2>
          <p><strong>Type:</strong> {requestInfo.type}</p>
          <p><strong>Quantity:</strong> {requestInfo.quantity}</p>
          <p><strong>Description:</strong> {requestInfo.description}</p>
          <p><strong>Address:</strong> {pickupDetails.addressLine1}, {pickupDetails.addressLine2}</p>
          <p><strong>City:</strong> {pickupDetails.city}</p>
          <p><strong>District:</strong> {pickupDetails.district}</p>
          <p><strong>Province:</strong> {pickupDetails.province}</p>
          <p><strong>Postal Code:</strong> {pickupDetails.postalCode}</p>
          <p><strong>Date:</strong> {pickupDetails.date}</p>
          <p><strong>Time:</strong> {pickupDetails.time}</p>
          <div className='flex justify-between'>
            <button className='py-2 px-4 bg-gray-500 text-white rounded-lg' onClick={handlePrevious}>Previous</button>
            <button className='py-2 px-4 bg-blue-500 text-white rounded-lg' onClick={handleConfirm}>Confirm</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleRequest;
