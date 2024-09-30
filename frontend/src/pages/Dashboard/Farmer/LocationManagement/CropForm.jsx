import React, { useState, useEffect } from "react";

const CropForm = ({ handleSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    cropName: "",
    cropType: "",
    landSize: "",
    plantingQuantity: "",
    expectedQuantity: "",
    plantingDate: "",
    expectedDate: "",
    ...initialData, // Pre-populate form data if initialData is provided
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Basic validation to prevent numbers in cropName if needed
    if (name === "cropName" && /[^\p{L}\s]/u.test(value)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div className="mb-4">
        <label htmlFor="cropName" className="block text-gray-700 font-semibold mb-1">
          Crop Name
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          name="cropName"
          placeholder="Crop Name"
          onChange={handleChange}
          value={formData.cropName}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="cropType" className="block text-gray-700 font-semibold mb-1">
          Crop Type
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          name="cropType"
          placeholder="Crop Type"
          onChange={handleChange}
          value={formData.cropType}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="landSize" className="block text-gray-700 font-semibold mb-1">
          Land Size
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          name="landSize"
          placeholder="Land Size (e.g., acres, hectares)"
          onChange={handleChange}
          value={formData.landSize}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="plantingQuantity" className="block text-gray-700 font-semibold mb-1">
          Planting Quantity
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          name="plantingQuantity"
          placeholder="Planting Quantity"
          onChange={handleChange}
          value={formData.plantingQuantity}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="expectedQuantity" className="block text-gray-700 font-semibold mb-1">
          Expected Quantity
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          name="expectedQuantity"
          placeholder="Expected Quantity"
          onChange={handleChange}
          value={formData.expectedQuantity}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="plantingDate" className="block text-gray-700 font-semibold mb-1">
          Planting Date
        </label>
        <input
          type="date"
          className="w-full p-2 border border-gray-300 rounded-md"
          name="plantingDate"
          onChange={handleChange}
          value={formData.plantingDate}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="expectedDate" className="block text-gray-700 font-semibold mb-1">
          Expected Date
        </label>
        <input
          type="date"
          className="w-full p-2 border border-gray-300 rounded-md"
          name="expectedDate"
          onChange={handleChange}
          value={formData.expectedDate}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
};

export default CropForm;
