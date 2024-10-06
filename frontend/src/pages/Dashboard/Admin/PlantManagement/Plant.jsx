import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure"; // Assuming this handles authenticated requests
import { ToastContainer, toast } from "react-toastify";
import QrScanner from "react-qr-scanner";
import jsQR from "jsqr"; // Import jsqr for decoding QR codes from images
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [scanResult, setScanResult] = useState("");
  // const [userDetails, setUserDetails] = useState(null); // Renamed state to userDetails
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [cameraActive, setCameraActive] = useState(false); // State to toggle the camera
  const [qrImage, setQrImage] = useState(null); // State to hold the uploaded QR code image
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userStatus, setUserStatus] = useState("");

  const axiosSecure = useAxiosSecure(); // Use the secure Axios hook

  const userDetails = scanResult;

  console.log(scanResult);

  const handleScan = (data) => {
    if (data) {
      const userId = data.text; // Store scanned result as userId
      setScanResult(userId); // Store scanned result (userId)
      fetchUserDetails(userId); // Fetch user details
      setCameraActive(false); // Turn off camera after scan
    }
  };

  const handleError = (err) => {
    console.error("QR Scan Error: ", err);
    toast.error("Error scanning QR code");
  };

  // Fetch user details from the API
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(userDetails); // Make a GET request to the API
        const data = await response.json(); // Convert the response to JSON

        // Set the user's name and email in the state
        setUserName(data.name);
        setUserEmail(data.email);
        setUserStatus(data.status);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails(); // Call the function to fetch user details
  }, [userDetails]);

  // Fetch user details from the API
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(userDetails); // Make a GET request to the API
        const data = await response.json(); // Convert the response to JSON

        // Set the user's name and email in the state
        setUserName(data.name);
        setUserEmail(data.email);
        setUserStatus(data.status);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails(); // Call the function to fetch user details
  }, [userDetails]);

  const toggleCamera = () => {
    setCameraActive(!cameraActive); // Toggle camera on or off
    setQrImage(null); // Reset the QR image when toggling
  };

  // Handle image upload and QR code scanning from the image
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    setQrImage(img.src); // Store the uploaded QR image

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

      if (qrCode) {
        const userId = qrCode.data; // Set scanned result as userId
        setScanResult(userId);
        fetchUserDetails(userId); // Fetch user details
        setCameraActive(false); // Turn off camera after scan
      } else {
        toast.error("No QR code found in the image");
      }
    };
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">
        QR Code Scanner for Users
      </h1>

      <button
        onClick={toggleCamera}
        className={`px-6 py-2 rounded-lg text-white mb-6 transition-all duration-300 ${
          cameraActive
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {cameraActive ? "Turn off Camera" : "Turn on Camera"}
      </button>
      {cameraActive && (
        <div className="border-2 border-gray-300 p-4 rounded-lg mb-6">
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
          className="px-6 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer"
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
      {/* Show the uploaded QR code image */}
      {qrImage && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Uploaded QR Code:</h2>
          <img
            src={qrImage}
            alt="Uploaded QR Code"
            className="max-w-xs rounded-lg shadow-md"
          />
        </div>
      )}
      {/* {scanResult && (
        <p className="text-lg text-gray-600 mb-4">
          Scanned User ID: {scanResult}
        </p>
      )} */}
      {loading ? (
        <p className="text-lg text-gray-600">Loading user details...</p>
      ) : userDetails ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-left w-full max-w-lg">
          <h2 className="text-2xl font-semibold mb-4">User Details</h2>
          <p className="mb-2">
            <strong>Name:</strong> {userName}
          </p>
          <p className="mb-2">
            <strong>Email:</strong> {userEmail}
          </p>
          <p className="mb-4">
            <strong>Status:</strong> {userStatus}
          </p>
        </div>
      ) : (
        scanResult &&
        !loading && (
          <p className="text-lg text-gray-600">
            No user details found for this ID.
          </p>
        )
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
