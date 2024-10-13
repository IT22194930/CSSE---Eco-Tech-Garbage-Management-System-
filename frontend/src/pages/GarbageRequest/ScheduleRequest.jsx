import React, { useEffect, useState } from "react";
import useUser from "../../hooks/useUser";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";

const ScheduleRequest = () => {
  const { currentUser } = useUser();
  const userId = currentUser?._id; // Ensure userId is safely accessed
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [garbageTypes, setGarbageTypes] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [requestInfo, setRequestInfo] = useState({
    type: "",
    description: "",
  });
  const [pickupDetails, setPickupDetails] = useState({
    date: "",
    time: "",
  });

  const validateTab0 = () => {
    return requestInfo.type !== "" && requestInfo.description !== "";
  };

  const validateTab1 = () => {
    return (
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
        setRequestInfo({ type: "", description: "" });
        setPickupDetails({
          date: "",
          time: "",
        });
        setActiveTab(0); // Reset to the first tab
        navigate("/garbageRequest");
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

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const garbageTypes = await axiosSecure.get(`api/garbageTypes/`);
        setGarbageTypes(garbageTypes.data);
      } catch (error) {
        console.error("Error fetching garbage types:", error);
      }
    };

    fetchTypes();
  }, [axiosSecure]);

  const selectedGarbageType = garbageTypes.find(
    (type) => type.type === requestInfo.type
  );

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
            {garbageTypes.map((type) => (
              <option key={type._id} value={type.type}>
                {type.type}
              </option>
            ))}
          </select>

          <textarea
            name="description"
            value={requestInfo.description}
            placeholder="Description"
            onChange={handleChangeRequestInfo}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
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
        <div className="space-y-4 mt-4">
          <h2 className="text-xl font-semibold">Pickup Details</h2>
          <label htmlFor="date" className="block text-gray-700 font-bold mb-2">
            Pickup Date
          </label>
          <input
            type="date"
            name="date"
            value={pickupDetails.date}
            onChange={handleChangePickupDetails}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />

          <label htmlFor="date" className="block text-gray-700 font-bold mb-2">
            Pickup Time
          </label>
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
            <strong>Description:</strong> {requestInfo.description}
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
