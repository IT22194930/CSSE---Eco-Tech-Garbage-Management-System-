import React, { useState, useEffect } from "react";
import storage from "../../../../config/firebase.init";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const FertilizerForm = ({ handleSubmit, initialData }) => {
  const [img, setImg] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const [formData, setFormData] = useState({
    imageUrl: "",
    productName: "",
    category: "",
    description: "",
    quantity: "",
    price: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    img && uploadFile(img, "imageUrl");
  }, [img]);

  const uploadFile = (file, fileType) => {
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, "images/fertilizers/" + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setUploading(true);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgPerc(Math.round(progress));
      },
      (error) => {
        console.log(error);
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("DownloadURL - ", downloadURL);
          setFormData((prev) => ({
            ...prev,
            [fileType]: downloadURL,
          }));
          setUploading(false);
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

    if (name === "productName" && /[^\p{L}\s]/u.test(value)) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
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
            {img ? (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(img)}
                  alt="Selected"
                  className="w-32 h-32 object-cover rounded-md"
                />
              </div>
            ) : (
              formData.imageUrl && (
                <div className="mt-2">
                  <img
                    src={formData.imageUrl}
                    alt="Uploaded"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                </div>
              )
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="productName"
              className="block text-gray-700 font-semibold mb-1"
            >
              Fertilizer Name
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              name="productName"
              placeholder="Fertilizer Name"
              onChange={handleChange}
              value={formData.productName}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-gray-700 font-semibold mb-1"
            >
              Category
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              name="category"
              placeholder="Category"
              onChange={handleChange}
              value={formData.category}
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 font-semibold mb-1"
            >
              Description
            </label>
            <textarea
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              name="description"
              placeholder="Description"
              onChange={handleChange}
              value={formData.description}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="quantity"
              className="block text-gray-700 font-semibold mb-1"
            >
              Quantity
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              name="quantity"
              placeholder="Quantity"
              onChange={handleChange}
              value={formData.quantity}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-gray-700 font-semibold mb-1"
            >
              Price
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              name="price"
              placeholder="Price"
              onChange={handleChange}
              value={formData.price}
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-secondary text-white rounded hover:bg-green-600"
          disabled={uploading}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default FertilizerForm;
