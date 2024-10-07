import React, { useState, useEffect } from "react";
import Scroll from "../../hooks/useScroll";
import useUser from "../../hooks/useUser";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure"; // Import Axios Secure hook

const GarbageRequest = () => {
  const { currentUser } = useUser();
  const userId = currentUser?._id;
  const axiosSecure = useAxiosSecure(); // Use your secure axios instance
  const [activeTab, setActiveTab] = useState("pending"); // State for active tab
  const [pendingRequests, setPendingRequests] = useState([]);
  const [previousRequests, setPreviousRequests] = useState([]);
  const [filter, setFilter] = useState("all"); // State for previous requests filter

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const pendingResponse = await axiosSecure.get(`api/garbageRequests/user/${userId}/pending`);
        setPendingRequests(pendingResponse.data); // Set pending requests
        const acceptedResponse = await axiosSecure.get(`api/garbageRequests/user/${userId}/accepted`);
        const rejectedResponse = await axiosSecure.get(`api/garbageRequests/user/${userId}/rejected`);
        const allPreviousRequests = [...acceptedResponse.data, ...rejectedResponse.data];
        setPreviousRequests(allPreviousRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, [userId, axiosSecure]);

  // Filter previous requests based on the selected filter
  const filteredRequests = previousRequests.filter((request) => {
    console.log("Request status:", request.status); // Log each request's status
    if (filter === "accepted") return request.status.toLowerCase() === "accepted";
    if (filter === "rejected") return request.status.toLowerCase() === "rejected";
    return true; // For "all", return all requests
  });

  console.log(filteredRequests); // Log filtered requests

  return (
    <>
      <div className="mt-20 mx-auto max-w-4xl p-6 bg-white dark:bg-slate-900 dark:shadow-slate-500 dark:mt-25 shadow-lg rounded-lg">
        <Scroll />
        <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center dark:text-white">
          Special Waste Collection Request
        </h1>

        {/* Link to Schedule a new request */}
        <div className="flex justify-center mt-6 mb-4">
          <Link to="/scheduleRequest">
            <button className="bg-secondary rounded-xl p-5 text-white px-20 hover:scale-105 duration-300">
              Schedule New Request
            </button>
          </Link>
        </div>
        
        {/* Tabs for Requests */}
        <div className="flex justify-center mb-4">
          <button
            className={`p-2 mx-2 ${activeTab === "pending" ? "bg-secondary text-white" : "bg-gray-200"} rounded-xl`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Requests
          </button>
          <button
            className={`p-2 mx-2 ${activeTab === "previous" ? "bg-secondary text-white" : "bg-gray-200"} rounded-xl`}
            onClick={() => setActiveTab("previous")}
          >
            Previous Requests
          </button>
        </div>

        {/* Display Requests based on active tab */}
        {activeTab === "pending" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Pending Requests</h2>
            {pendingRequests.length > 0 ? (
              <ul>
                {pendingRequests.map((request) => (
                  <li key={request._id} className="mb-2 p-2 border rounded-lg">
                    <p><strong>Type:</strong> {request.type}</p>
                    <p><strong>Quantity:</strong> {request.quantity}</p>
                    <p><strong>Description:</strong> {request.description}</p>
                    <p><strong>Status:</strong> {request.status}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No pending requests found.</p>
            )}
          </div>
        )}

        {activeTab === "previous" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center justify-between">
              Previous Requests
              <select
                className="ml-4 p-2 border rounded-lg"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </h2>
            {filteredRequests.length > 0 ? (
              <ul>
                {filteredRequests.map((request) => (
                  <li key={request._id} className="mb-2 p-2 border rounded-lg">
                    <p><strong>Type:</strong> {request.type}</p>
                    <p><strong>Quantity:</strong> {request.quantity}</p>
                    <p><strong>Description:</strong> {request.description}</p>
                    <p><strong>Status:</strong> {request.status}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No previous requests found.</p>
            )}
          </div>
        )}

      </div>
    </>
  );
};

export default GarbageRequest;
