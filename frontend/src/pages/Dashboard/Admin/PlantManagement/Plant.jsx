import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { ToastContainer, toast } from "react-toastify";
import QrScanner from "react-qr-scanner";
import jsQR from "jsqr";
import "../../../../components/Toast/customToast.css";

import "react-toastify/dist/ReactToastify.css";
import LargeModal from "../../../../components/Modal/LargeModal";
import SmallModal from "../../../../components/Modal/Modal";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  const [scanResult, setScanResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [qrImage, setQrImage] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [garbageRequests, setGarbageRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isSmallModalOpen, setIsSmallModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);

  const axiosSecure = useAxiosSecure();

  const userDetails = scanResult;

  const handleScan = (data) => {
    if (data) {
      const phone = data.text;
      setScanResult(phone);
      setCameraActive(false);
      fetchUserDetails(phone);
    }
  };

  const handleError = (err) => {
    console.error("QR Scan Error: ", err);
    toast.error("Error scanning QR code");
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(userDetails);
        const data = await response.json();

        setUserName(data.name);
        setUserEmail(data.email);
        setPhone(data.phone);

        const garbageRequestsResponse = await axiosSecure.get(
          `api/garbageRequests/user?userId=${data._id}`
        );
        setGarbageRequests(garbageRequestsResponse.data);
        setIsModalOpen(true);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("No data found");
      }
    };

    if (userDetails) {
      fetchUserDetails();
    }
  }, [userDetails]);

  const toggleCamera = () => {
    setCameraActive(!cameraActive);
    setQrImage(null);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    setQrImage(img.src);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

      if (qrCode) {
        const userId = qrCode.data;
        setScanResult(userId);
        fetchUserDetails(userId);
        setCameraActive(false);
      } else {
        toast.error("No QR code found in the image");
      }
    };
  };

  const confirmAction = (requestId, action) => {
    setSelectedRequestId(requestId);
    setSelectedAction(action);
    setIsSmallModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedRequestId || !selectedAction) return;
    try {
      await axiosSecure.put(`/api/garbageRequests/${selectedRequestId}`, {
        status: selectedAction,
      });
      setGarbageRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === selectedRequestId
            ? { ...request, status: selectedAction, isInEditMode: false }
            : request
        )
      );
      toast.success(`Status updated to ${selectedAction}`);
      setIsSmallModalOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const toggleEditMode = (requestId) => {
    setGarbageRequests((prevRequests) =>
      prevRequests.map((request) =>
        request._id === requestId
          ? { ...request, isInEditMode: !request.isInEditMode }
          : request
      )
    );
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-white min-h-screen flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-800 text-center">
        QR Code Scanner
      </h1>

      <button
        onClick={toggleCamera}
        className={`px-6 py-3 rounded-lg text-white mb-6 transition-all duration-300 ${
          cameraActive
            ? "bg-red-500 hover:bg-red-600"
            : "bg-indigo-500 hover:bg-indigo-600"
        }`}
      >
        {cameraActive ? "Turn off Camera" : "Turn on Camera"}
      </button>

      {cameraActive && (
        <div className="border-4 border-gray-300 p-4 rounded-lg mb-6 max-w-xs sm:max-w-md">
          <QrScanner
            delay={300}
            className="mx-auto"
            style={{ height: 240, width: 320 }}
            onError={handleError}
            onScan={handleScan}
          />
        </div>
      )}

      <div className="flex flex-col items-center mb-6">
        <label
          htmlFor="qr-upload"
          className="px-6 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer transition-all"
        >
          Upload QR Code Image
        </label>
        <input
          id="qr-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {qrImage && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-center">
            Uploaded QR Code:
          </h2>
          <img
            src={qrImage}
            alt="Uploaded QR Code"
            className="max-w-full sm:max-w-xs rounded-lg shadow-md"
          />
        </div>
      )}

      <LargeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="User Details"
      >
        {loading ? (
          <p className="text-lg text-gray-600">Loading user details...</p>
        ) : userDetails ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-left w-full max-w-2xl mx-auto">
            <p className="mb-4">
              <strong>Name:</strong> {userName}
            </p>
            <p className="mb-4">
              <strong>Email:</strong> {userEmail}
            </p>
            <p className="mb-4">
              <strong>Phone:</strong> {phone}
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
                        <strong>Address:</strong> {request.addressdivne1},{" "}
                        {request.city}, {request.district}
                      </p>
                      <p className="mb-2">
                        <strong>Description:</strong> {request.description}
                      </p>
                      <p className="mb-2">
                        <strong>Status:</strong>{" "}
                        <span
                          className={`${
                            request.status === "pending"
                              ? "text-yellow-500"
                              : request.status === "completed"
                              ? "text-green-500"
                              : "text-red-500"
                          } font-semibold`}
                        >
                          {request.status}
                        </span>
                      </p>

                      {request.isInEditMode ? (
                        <>
                          <div className="flex gap-4 mt-4">
                            <button
                              onClick={() =>
                                confirmAction(request._id, "completed")
                              }
                              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                            >
                              Mark as Completed
                            </button>
                            <button
                              onClick={() =>
                                confirmAction(request._id, "cancelled")
                              }
                              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                            >
                              Cancel Request
                            </button>
                          </div>
                        </>
                      ) : (
                        <button
                          onClick={() => toggleEditMode(request._id)}
                          className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
                        >
                          Edit Status
                        </button>
                      )}
                    </div>
                  ))}
                </Slider>
              </div>
            ) : (
              <p>No garbage requests found for this user.</p>
            )}
          </div>
        ) : (
          <p>No user details found.</p>
        )}
      </LargeModal>

      <SmallModal
        isOpen={isSmallModalOpen}
        onClose={() => setIsSmallModalOpen(false)}
        title="Confirm Action"
      >
        <div className="p-4">
          <p>Are you sure you want to mark this request as {selectedAction}?</p>
          <div className="flex justify-end mt-6">
            <button
              onClick={() => setIsSmallModalOpen(false)}
              className="px-4 py-2 mr-4 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateStatus}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all"
            >
              Confirm
            </button>
          </div>
        </div>
      </SmallModal>

      <ToastContainer
        className="custom-toast"
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
