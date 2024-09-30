import React, { useState, useEffect } from "react";
import storage from "../../../../config/firebase.init";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const LocationForm = ({ handleSubmit, initialData }) => {
  // const [img, setImg] = useState(undefined);
  // const [imgPerc, setImgPerc] = useState(0);
  const [formData, setFormData] = useState({
    province: "",
    district: "",
    city: "",
    latitude: "",
    longitude: "",
    areaSize: "",
    soilType: "",
    irrigationType: "",
  });
  // const [uploading, setUploading] = useState(false); // Track if image is being uploaded

  // useEffect(() => {
  //   img && uploadFile(img, "imageUrl");
  // }, [img]);

  // const uploadFile = (file, fileType) => {
  //   const fileName = new Date().getTime() + file.name;
  //   const storageRef = ref(storage, "images/fruits/" + fileName);
  //   const uploadTask = uploadBytesResumable(storageRef, file);
  //   setUploading(true); // Start uploading

  //   uploadTask.on(
  //     "state_changed",
  //     (snapshot) => {
  //       const progress =
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       setImgPerc(Math.round(progress));
  //     },
  //     (error) => {
  //       console.log(error);
  //       setUploading(false); // Stop uploading on error
  //     },
  //     () => {
  //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //         console.log("DownloadURL - ", downloadURL);
  //         setFormData((prev) => ({
  //           ...prev,
  //           [fileType]: downloadURL,
  //         }));
  //         setUploading(false); // Stop uploading after successful upload
  //       });
  //     }
  //   );
  // };

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const currentDate = getCurrentDate();
    setFormData((prevState) => ({
      ...prevState,
      date: currentDate,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name" && /[^\p{L}\s]/u.test(value)) {
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
      {/* <div className="mb-4">
        <label
          htmlFor="imageUrl"
          className="block text-gray-700 font-semibold mb-1"
        >
          {uploading ? `Uploading: ${imgPerc}%` : "Image"}
        </label>
        <input
          type="file"
          className="w-full p-2 border border-gray-300 rounded-md"
          name="imageUrl"
          onChange={(e) => setImg(e.target.files[0])}
        />
      </div> */}
      <div className="mb-4">
        <label htmlFor="province" className="block text-gray-700 font-semibold mb-1">
          Province
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          name="province"
          placeholder="Province"
          onChange={handleChange}
          value={formData.province}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="district" className="block text-gray-700 font-semibold mb-1">
          District
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          name="district"
          placeholder="District"
          onChange={handleChange}
          value={formData.district}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="city" className="block text-gray-700 font-semibold mb-1">
          City
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          name="city"
          placeholder="City"
          onChange={handleChange}
          value={formData.city}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="latitude" className="block text-gray-700 font-semibold mb-1">
          Latitude
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          name="latitude"
          placeholder="Latitude"
          onChange={handleChange}
          value={formData.latitude}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="longitude" className="block text-gray-700 font-semibold mb-1">
          Longitude
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          name="longitude"
          placeholder="Longitude"
          onChange={handleChange}
          value={formData.longitude}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="areaSize" className="block text-gray-700 font-semibold mb-1">
          Area Size
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          name="areaSize"
          placeholder="Area Size (e.g., acres, hectares)"
          onChange={handleChange}
          value={formData.areaSize}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="soilType" className="block text-gray-700 font-semibold mb-1">
          Soil Type
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          name="soilType"
          placeholder="Soil Type"
          onChange={handleChange}
          value={formData.soilType}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="irrigationType" className="block text-gray-700 font-semibold mb-1">
          Irrigation Type
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          name="irrigationType"
          placeholder="Irrigation Type"
          onChange={handleChange}
          value={formData.irrigationType}
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

export default LocationForm;
