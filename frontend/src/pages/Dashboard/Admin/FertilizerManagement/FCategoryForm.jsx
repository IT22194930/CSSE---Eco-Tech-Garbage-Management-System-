import React, { useState, useEffect } from "react";
import storage from "../../../../config/firebase.init";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const PlantForm = ({ handleSubmit, initialData }) => {
  const [img, setImg] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const [formData, setFormData] = useState({
    imageUrl: "",
    name: "",
    date: "",
    description: "",
  });
  const [uploading, setUploading] = useState(false); // Track if image is being uploaded

  useEffect(() => {
    img && uploadFile(img, "imageUrl");
  }, [img]);

  const uploadFile = (file, fileType) => {
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, "images/fruits/" + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setUploading(true); // Start uploading

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgPerc(Math.round(progress));
      },
      (error) => {
        console.log(error);
        setUploading(false); // Stop uploading on error
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("DownloadURL - ", downloadURL);
          setFormData((prev) => ({
            ...prev,
            [fileType]: downloadURL,
          }));
          setUploading(false); // Stop uploading after successful upload
        });
      }
    );
  };

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
      <div className="mb-4">
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
      </div>
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-gray-700 font-semibold mb-1"
        >
          Plant Name
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          name="name"
          placeholder="Plant Name"
          onChange={handleChange}
          value={formData.name}
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="date"
          className="block text-gray-700 font-semibold mb-1"
        >
          Date
        </label>
        <input
          type="date"
          className="w-full p-2 border border-gray-300 rounded-md"
          name="date"
          onChange={handleChange}
          value={formData.date}
          min={getCurrentDate()} // Set the min attribute to today's date
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-gray-700 font-semibold mb-1"
        >
          Description
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          name="description"
          placeholder="Description"
          onChange={handleChange}
          value={formData.description}
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

export default PlantForm;
