// UserDetailsModal.jsx
import React from "react";
import Slider from "react-slick";
import LargeModal from "../../../../components/Modal/LargeModal";

const UserDetailsModal = ({
  isModalOpen,
  setIsModalOpen,
  userDetails,
  garbageRequests,
  sliderSettings,
  activeTab,
  setActiveTab,
  addCashBack,
  addAdditionalPrice,
  amount,
  setAmount,
}) => {
  return (
    <LargeModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="User Details"
    >
      {userDetails ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-left w-full max-w-2xl mx-auto">
          <p className="mb-4">
            <strong>Name:</strong> {userDetails.name}
          </p>
          <p className="mb-4">
            <strong>Email:</strong> {userDetails.email}
          </p>
          <p className="mb-4">
            <strong>Phone:</strong> {userDetails.phone}
          </p>
          <p className="mb-4">
            <strong>Address:</strong> {userDetails.address}
          </p>

          {garbageRequests.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Garbage Requests
              </h3>
              <Slider {...sliderSettings}>
                {garbageRequests.map((request) => (
                  <div
                    key={request._id}
                    className="p-4 bg-gray-100 rounded-lg shadow-sm border border-gray-300"
                  >
                    <p className="mb-2">
                      <strong>Type:</strong> {request.type}
                    </p>
                    <p className="mb-2">
                      <strong>Description:</strong> {request.description}
                    </p>
                    <p className="mb-2">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`font-semibold ${
                          request.status === "pending"
                            ? "text-yellow-500"
                            : request.status === "Accepted"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {request.status}
                      </span>
                    </p>
                  </div>
                ))}
              </Slider>
              <div className="space-y-4 mt-4">
                <div className="flex space-x-4 border-b border-gray-300 mb-4">
                  <button
                    onClick={() => setActiveTab("cashBack")}
                    className={`py-2 px-4 ${
                      activeTab === "cashBack"
                        ? "border-b-2 border-blue-500 text-blue-500"
                        : "text-gray-500"
                    }`}
                  >
                    Cash Back
                  </button>
                  <button
                    onClick={() => setActiveTab("additionalFee")}
                    className={`py-2 px-4 ${
                      activeTab === "additionalFee"
                        ? "border-b-2 border-blue-500 text-blue-500"
                        : "text-gray-500"
                    }`}
                  >
                    Additional Fee
                  </button>
                </div>

                {/* Cash Back Form */}
                {activeTab === "cashBack" && (
                  <form onSubmit={addCashBack} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Cash Back Amount
                      </label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    >
                      Submit
                    </button>
                  </form>
                )}

                {/* Additional Fee Form */}
                {activeTab === "additionalFee" && (
                  <form onSubmit={addAdditionalPrice} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Additional Fee Amount
                      </label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    >
                      Submit
                    </button>
                  </form>
                )}
              </div>
            </div>
          ) : (
            <p>No garbage requests found.</p>
          )}
        </div>
      ) : (
        <p className="text-lg text-gray-600">Loading user details...</p>
      )}
    </LargeModal>
  );
};

export default UserDetailsModal;
