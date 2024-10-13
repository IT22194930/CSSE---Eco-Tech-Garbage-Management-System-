import React, { useState, useEffect } from "react";
import Scroll from "../../hooks/useScroll";
import useUser from "../../hooks/useUser";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import EditRequestModal from "./EditRequestModal";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";

const GarbageRequest = () => {
  const { currentUser } = useUser();
  const userId = currentUser?._id;
  const axiosSecure = useAxiosSecure();
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedRequest, setSelectedRequest] = useState(null); // State for selected request

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const pendingResponse = await axiosSecure.get(
          `api/garbageRequests/user/${userId}/pending`
        );
        setPendingRequests(pendingResponse.data);

        const acceptedResponse = await axiosSecure.get(
          `api/garbageRequests/user/${userId}/accepted`
        );
        setAcceptedRequests(acceptedResponse.data);

        const rejectedResponse = await axiosSecure.get(
          `api/garbageRequests/user/${userId}/rejected`
        );
        setRejectedRequests(rejectedResponse.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, [userId, axiosSecure]);

  const handleEditClick = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true); // Open the modal
  };

  const handleUpdateRequest = async (updatedRequest) => {
    try {
      await axiosSecure.put(
        `api/garbageRequests/${updatedRequest._id}`,
        updatedRequest
      ); // Update the request on the server
      // Update the local state after successful update
      setPendingRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === updatedRequest._id ? updatedRequest : request
        )
      );
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this request?"
    );
    if (confirmed) {
      try {
        await axiosSecure.delete(`api/garbageRequests/${requestId}`); // Delete the request on the server
        // Update the local state after successful deletion
        setPendingRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== requestId)
        );
      } catch (error) {
        console.error("Error deleting request:", error);
      }
    }
  };

  const filteredRequests = (requests) => {
    if (filter === "accepted")
      return requests.filter(
        (request) => request.status.toLowerCase() === "accepted"
      );
    if (filter === "rejected")
      return requests.filter(
        (request) => request.status.toLowerCase() === "rejected"
      );
    return requests; // For "all", return all requests
  };

  if (!currentUser) {
    return (
      <div className="mt-20 mx-auto max-w-4xl p-6 bg-white dark:bg-slate-900 dark:shadow-slate-500 shadow-lg rounded-lg text-center">
        <Scroll />
        <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white">
          You have to login first
        </h1>
        <Link to="/login">
          <button className="bg-secondary rounded-xl p-5 text-white px-20 hover:scale-105 duration-300">
            Go to Login
          </button>
        </Link>
      </div>
    );
  }

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
            className={`p-2 mx-2 ${
              activeTab === "pending"
                ? "bg-secondary text-white"
                : "bg-gray-200"
            } rounded-xl`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Requests
          </button>
          <button
            className={`p-2 mx-2 ${
              activeTab === "previous"
                ? "bg-secondary text-white"
                : "bg-gray-200"
            } rounded-xl`}
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
                  <li
                    key={request._id}
                    className="mb-2 p-2 border rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p>
                        <strong>Type:</strong> {request.type}
                      </p>
                      <p>
                        <strong>Description:</strong> {request.description}
                      </p>
                      <p>
                        <strong>Status:</strong> {request.status}
                      </p>
                      <p>
                        <strong>Pickup Date: </strong>
                        {new Date(request.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p>
                        <strong>Pickup Time: </strong>
                        {request.time}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <button
                        className="ml-2 text-blue-500"
                        onClick={() => handleEditClick(request)} // Open the edit modal
                      >
                        <FaRegEdit size={20} />
                      </button>
                      <button
                        className="ml-2 text-red-500"
                        onClick={() => handleDeleteRequest(request._id)} // Handle delete request
                      >
                        <FaTrashAlt size={20} />
                      </button>
                    </div>
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
                className="ml-4 p-2 border rounded-lg text-lg"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </h2>
            {/* Display both accepted and rejected requests */}
            {filteredRequests([...acceptedRequests, ...rejectedRequests])
              .length > 0 ? (
              <ul>
                {filteredRequests([
                  ...acceptedRequests,
                  ...rejectedRequests,
                ]).map((request) => (
                  <li key={request._id} className="mb-2 p-2 border rounded-lg">
                    <p>
                      <strong>Type:</strong> {request.type}
                    </p>
                    <p>
                      <strong>Description:</strong> {request.description}
                    </p>
                    <p>
                      <strong>Status:</strong> {request.status}
                    </p>
                    <p>
                      <strong>Pickup Date: </strong>
                      {new Date(request.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p>
                      <strong>Pickup Time: </strong>
                      {request.time}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No previous requests found.</p>
            )}
          </div>
        )}
      </div>

      {/* Render the edit modal */}
      <EditRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={selectedRequest}
        onUpdate={handleUpdateRequest}
      />
    </>
  );
};

export default GarbageRequest;
