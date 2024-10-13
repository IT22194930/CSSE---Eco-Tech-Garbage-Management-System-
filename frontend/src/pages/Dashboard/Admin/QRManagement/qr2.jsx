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
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [totalDueAmount, setTotalDueAmount] = useState(0); // Added for total amount
  const [paymentDetails, setPaymentDetails] = useState({
    amount: "",
    transactionType: "",
  });
  const [garbageRequests, setGarbageRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSmallModalOpen, setIsSmallModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);

  const axiosSecure = useAxiosSecure();

  // Handle QR code scanning
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

  // Fetch user details based on scanned result
  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(userId);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();

      setUserDetails({ name: data.name, email: data.email, phone: data.phone });

      // Fetch garbage requests
      const garbageRequestsResponse = await axiosSecure.get(
        `api/garbageRequests/user?userId=${data._id}`
      );
      setGarbageRequests(
        garbageRequestsResponse.data.map((request) => ({
          ...request,
          isInEditMode: false, // Add the isInEditMode property for each request
        }))
      );

      // Fetch total due amount
      const totalDueResponse = await axiosSecure.get(
        `/api/payments/totalDueAmount/${data._id}`
      );
      setTotalDueAmount(totalDueResponse.data.totalDueAmount);

      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("No data found");
    }
  };

  // Toggle camera visibility
  const toggleCamera = () => {
    setCameraActive((prev) => !prev);
    setQrImage(null);
  };

  // Handle image upload for QR code
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

  // Handle form input change for payment
  const handlePaymentInputChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value,
    });
  };

  // Handle payment submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosSecure.post("/api/payments", {
        userId: userDetails._id,
        amount: paymentDetails.amount,
        transactionType: paymentDetails.transactionType,
      });
      toast.success("Payment processed successfully!");
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Payment failed");
    }
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
        title="User Details and Payment"
      >
        {loading ? (
          <p className="text-lg text-gray-600">Loading user details...</p>
        ) : (
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
              <strong>Total Due Amount:</strong> {totalDueAmount}
            </p>

            {/* Payment Form */}
            <form onSubmit={handlePaymentSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="amount"
                >
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={paymentDetails.amount}
                  onChange={handlePaymentInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="transactionType"
                >
                  Transaction Type
                </label>
                <select
                  id="transactionType"
                  name="transactionType"
                  value={paymentDetails.transactionType}
                  onChange={handlePaymentInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select Transaction Type</option>
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                  <option value="transfer">Cash Back</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg"
              >
                Process Payment
              </button>
            </form>
          </div>
        )}
      </LargeModal>

      <SmallModal
        isOpen={isSmallModalOpen}
        onClose={() => setIsSmallModalOpen(false)}
        title="Action Confirmation"
        onConfirm={() => handleConfirmAction(selectedRequestId)}
      >
        <p>
          Are you sure you want to <strong>{selectedAction}</strong> this
          request?
        </p>
      </SmallModal>

      <ToastContainer />
    </div>
  );
}

export default App;
