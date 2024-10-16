// QRScanner.jsx
import React from "react";
import QrScanner from "react-qr-scanner";

const QRScanner = ({ cameraActive, handleScan, handleError }) => {
  return (
    <>
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
    </>
  );
};

export default QRScanner;
