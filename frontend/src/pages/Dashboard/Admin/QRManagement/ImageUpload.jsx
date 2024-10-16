// ImageUpload.jsx
import React from "react";

const ImageUpload = ({ handleImageUpload, qrImage }) => {
  return (
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
    </div>
  );
};

export default ImageUpload;
