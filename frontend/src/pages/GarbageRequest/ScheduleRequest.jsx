import React, { useState } from "react";
import useUser from "../../hooks/useUser";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";

const ScheduleRequest = () => {
  const { currentUser } = useUser();
  const userId = currentUser?._id; // Ensure userId is safely accessed
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [requestInfo, setRequestInfo] = useState({
    type: "",
    quantity: "",
    description: "",
  });
  const [pickupDetails, setPickupDetails] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "",
    province: "",
    postalCode: "",
    date: "",
    time: "",
  });

  const validateTab0 = () => {
    return requestInfo.type !== "" && requestInfo.quantity !== "";
  };

  const validateTab1 = () => {
    return (
      pickupDetails.addressLine1 !== "" &&
      pickupDetails.city !== "" &&
      pickupDetails.district !== "" &&
      pickupDetails.province !== "" &&
      pickupDetails.postalCode !== "" &&
      pickupDetails.date !== "" &&
      pickupDetails.time !== ""
    );
  };

  const handleNext = () => {
    if (activeTab === 0 && !validateTab0()) {
      alert("Please fill out all required fields in Request Information.");
      return;
    }
    if (activeTab === 1 && !validateTab1()) {
      alert("Please fill out all required fields in Pickup Details.");
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
      const response = await axiosSecure.post(
        "/api/garbageRequests/createGarbageRequest",
        requestData
      );

      if (response.status === 200 || response.status === 201) {
        alert("Request saved successfully!");
        setRequestInfo({ type: "", quantity: "", description: "" });
        setPickupDetails({
          addressLine1: "",
          addressLine2: "",
          city: "",
          district: "",
          province: "",
          postalCode: "",
          date: "",
          time: "",
        });
        setActiveTab(0); // Reset to the first tab
        navigate('/garbageRequest')
      } else {
        console.error("Response not OK:", response);
        alert("Failed to save request. Please try again.");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      if (error.response) {
        alert("Error occurred: " + error.response.data.message);
      } else {
        alert("Error occurred: " + error.message);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-28 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-around mb-4">
        <button
          className={`py-2 px-4 rounded-lg ${
            activeTab === 0 ? "bg-blue-500 text-white" : "bg-gray-200"
          } transition-colors duration-200`}
          onClick={() => setActiveTab(0)}
        >
          Request Information
        </button>
        <button
          className={`py-2 px-4 rounded-lg ${
            activeTab === 1 ? "bg-blue-500 text-white" : "bg-gray-200"
          } transition-colors duration-200`}
          onClick={() => {
            if (validateTab0()) {
              setActiveTab(1);
            } else {
              alert(
                "Please complete the Request Information before proceeding."
              );
            }
          }}
          disabled={!validateTab0()}
        >
          Pickup Details
        </button>
        <button
          className={`py-2 px-4 rounded-lg ${
            activeTab === 2 ? "bg-blue-500 text-white" : "bg-gray-200"
          } transition-colors duration-200`}
          onClick={() => {
            if (validateTab1()) {
              setActiveTab(2);
            } else {
              alert("Please complete the Pickup Details before proceeding.");
            }
          }}
          disabled={!validateTab1()}
        >
          Review & Confirm
        </button>
      </div>

      {/*  Tab 0 - Request Information */}
      {activeTab === 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Request Information</h2>
          <select
            name="type"
            value={requestInfo.type}
            onChange={handleChangeRequestInfo}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          >
            <option value="">Select Type</option>
            <option value="Bulk Waste">Bulk Waste</option>
            <option value="E Waste">E Waste</option>
            <option value="Hazardous Waste">Hazardous Waste</option>
            <option value="Other Special Waste">Other Special Waste</option>
          </select>
          <div className="flex gap-4">
          <input
            type="number"
            name="quantity"
            value={requestInfo.quantity}
            placeholder="Quantity"
            onChange={handleChangeRequestInfo}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
          <p className="font-bold my-auto">kg</p>
          </div>
          <textarea
            name="description"
            value={requestInfo.description}
            placeholder="Description"
            onChange={handleChangeRequestInfo}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <div className="flex justify-between">
            <button
              className="py-2 px-4 bg-red-500 text-white rounded-lg"
              onClick={() => navigate("/garbageRequest")}
            >
              Cancel
            </button>
            <button
              className="py-2 px-4 bg-blue-500 text-white rounded-lg"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      )}
      {/* Tab 1 - Pickup Details */}
      {activeTab === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Pickup Details</h2>
          <input
            type="text"
            name="addressLine1"
            value={pickupDetails.addressLine1}
            placeholder="Address Line 1"
            onChange={handleChangePickupDetails}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
          <input
            type="text"
            name="addressLine2"
            value={pickupDetails.addressLine2}
            placeholder="Address Line 2"
            onChange={handleChangePickupDetails}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <input
            type="text"
            name="city"
            value={pickupDetails.city}
            placeholder="City"
            onChange={handleChangePickupDetails}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
          <select
            name="district"
            value={pickupDetails.district}
            onChange={handleChangePickupDetails}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          >
            <option value="">Select District</option>
            <option value="Ampara">Ampara</option>
            <option value="Anuradhapura">Anuradhapura</option>
            <option value="Badulla">Badulla</option>
            <option value="Batticaloa">Batticaloa</option>
            <option value="Colombo">Colombo</option>
            <option value="Galle">Galle</option>
            <option value="Gampaha">Gampaha</option>
            <option value="Hambantota">Hambantota</option>
            <option value="Jaffna">Jaffna</option>
            <option value="Kalutara">Kalutara</option>
            <option value="Kandy">Kandy</option>
            <option value="Kegalle">Kegalle</option>
            <option value="Kilinochchi">Kilinochchi</option>
            <option value="Kurunegala">Kurunegala</option>
            <option value="Mannar">Mannar</option>
            <option value="Matale">Matale</option>
            <option value="Matara">Matara</option>
            <option value="Monaragala">Monaragala</option>
            <option value="Mullaitivu">Mullaitivu</option>
            <option value="Nuwara Eliya">Nuwara Eliya</option>
            <option value="Polonnaruwa">Polonnaruwa</option>
            <option value="Puttalam">Puttalam</option>
            <option value="Ratnapura">Ratnapura</option>
            <option value="Trincomalee">Trincomalee</option>
            <option value="Vavuniya">Vavuniya</option>
          </select>
          <select
            name="province"
            value={pickupDetails.province}
            onChange={handleChangePickupDetails}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          >
            <option value="">Select Province</option>
            <option value="Central">Central</option>
            <option value="Eastern">Eastern</option>
            <option value="Northern">Northern</option>
            <option value="North Central">North Central</option>
            <option value="North Western">North Western</option>
            <option value="Sabaragamuwa">Sabaragamuwa</option>
            <option value="Southern">Southern</option>
            <option value="Uva">Uva</option>
            <option value="Western">Western</option>
          </select>
          <input
            type="text"
            name="postalCode"
            value={pickupDetails.postalCode}
            placeholder="Postal Code"
            onChange={handleChangePickupDetails}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
          <input
            type="date"
            name="date"
            value={pickupDetails.date}
            onChange={handleChangePickupDetails}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
          <input
            type="time"
            name="time"
            value={pickupDetails.time}
            onChange={handleChangePickupDetails}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
          <div className="flex justify-between">
            <button
              className="py-2 px-4 bg-gray-500 text-white rounded-lg"
              onClick={handlePrevious}
            >
              Previous
            </button>
            <button
              className="py-2 px-4 bg-blue-500 text-white rounded-lg"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Tab 2 - Review & Confirm */}
      {activeTab === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Review & Confirm</h2>
          <p>
            <strong>Type:</strong> {requestInfo.type}
          </p>
          <p>
            <strong>Quantity:</strong> {requestInfo.quantity}
          </p>
          <p>
            <strong>Description:</strong> {requestInfo.description}
          </p>
          <p>
            <strong>Address:</strong> {pickupDetails.addressLine1},{" "}
            {pickupDetails.addressLine2}
          </p>
          <p>
            <strong>City:</strong> {pickupDetails.city}
          </p>
          <p>
            <strong>District:</strong> {pickupDetails.district}
          </p>
          <p>
            <strong>Province:</strong> {pickupDetails.province}
          </p>
          <p>
            <strong>Postal Code:</strong> {pickupDetails.postalCode}
          </p>
          <p>
            <strong>Date:</strong> {pickupDetails.date}
          </p>
          <p>
            <strong>Time:</strong> {pickupDetails.time}
          </p>
          <div className="flex justify-between">
            <button
              className="py-2 px-4 bg-gray-500 text-white rounded-lg"
              onClick={handlePrevious}
            >
              Previous
            </button>
            <button
              className="py-2 px-4 bg-green-500 text-white rounded-lg"
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleRequest;
