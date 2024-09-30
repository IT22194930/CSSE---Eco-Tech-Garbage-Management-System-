import React, { useEffect, useState } from "react";
import useAxiosFetch from "../../../../hooks/useAxiosFetch";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../../../components/Modal/Modal";
import CropForm from "./CropForm";
import SearchBar from "../../../../components/Search/SearchBar";
import { ToastContainer, toast } from "react-toastify";
import { MdDelete, MdOutlineArrowBackIosNew } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";

function Crop() {
  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { locationId } = useParams();
  const [crop, setCrop] = useState([]);
  const [filteredCrops,setFilteredCrops] = useState([]);
  const [location, setLocation] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [filteredDataList, setFilteredDataList] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [cropsPerPage] = useState(5); // Number of diseases per page

  useEffect(() => {
    fetchCrops();
    fetchLocation();
  }, [locationId]);

  useEffect(() => {
    setFilteredCrops(dataList);
  }, [dataList]);
  

  const fetchCrops = async () => {
    try {
      const response = await axiosFetch.get(`/api/crops/location/${locationId}`);
      console.log("Fetched Crops Data:", response.data); // Debug log
      // Verify the data structure
      if (Array.isArray(response.data)) {
        setDataList(response.data);
        setCrop(response.data);
        setFilteredDataList(response.data);
      } else {
        console.error("Unexpected data format:", response.data);
        toast.error("Unexpected data format from server.");
      }
    } catch (err) {
      console.error("Error fetching crops:", err);
      toast.error("Failed to fetch crops.");
    }
  };

  const fetchLocation = async () => {
    try {
      const response = await axiosFetch.get(`/Location/${locationId}`);
      if (response.data && response.data.city) {
        setLocation(response.data.city);
      } else {
        console.error("Location not found:", response.data);
        toast.error("Failed to fetch location.");
      }
    } catch (err) {
      console.error("Error fetching crops details:", err);
      toast.error("Failed to fetch crops details.");
    }
  };

  const handleSearch = (query) => {
    const filteredList = dataList.filter((crop) => {
      const cropName = `${crop.cropName}`;
      return cropName.toLowerCase().includes(query.toLowerCase());
    });
    setFilteredCrops(filteredList);
  };  

  const handleRefreshClick = () => {
    fetchCrops();
  };

  const handleAddModalOpen = () => setAddModalOpen(true);
  const handleAddModalClose = () => setAddModalOpen(false);

  const handleEditModalOpen = (crop) => {
    setSelectedCrop(crop);
    setEditModalOpen(true);
  };
  const handleEditModalClose = () => setEditModalOpen(false);

  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/api/crops/${id}`);
      toast.success("Successfully Deleted!");
      fetchCrops(); // Ensure data is refreshed after deletion
      handleCloseDeleteModal();
    } catch (err) {
      console.error("Error deleting crop:", err);
      toast.error("Failed to delete crop.");
    }
  };

  const handleAddSubmit = async (formData) => {
    try {
      await axiosSecure.post("/api/crops", { ...formData, locationId });
      toast.success("Crop Added!");
      handleAddModalClose();
      fetchCrops(); // Refresh data after adding a crop
    } catch (err) {
      console.error("Error adding crop:", err);
      toast.error("Failed to add crop.");
    }
  };

  const handleEditSubmit = async (formData) => {
    try {
      await axiosSecure.put(`/api/crops/${formData._id}`, formData);
      toast.success("Crop Updated!");
      handleEditModalClose();
      fetchCrops(); // Refresh data after editing a crop
    } catch (err) {
      console.error("Error updating crop:", err);
      toast.error("Failed to update crop.");
    }
  };

  const handleShowDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  // Get current crops for pagination
  const indexOfLastCrop = currentPage * cropsPerPage;
  const indexOfFirstCrop = indexOfLastCrop - cropsPerPage;
  const currentCrops = filteredCrops.slice(
    indexOfFirstCrop,
    indexOfLastCrop
  );

  const totalPages = Math.ceil(filteredCrops.length / cropsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="mt-10 p-4 bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-6">
        <Link to="/dashboard/location">
          <MdOutlineArrowBackIosNew className="text-3xl mb-3" />
        </Link>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">
              Crop Details - {location}
            </h2>
            <h6 className="text-sm text-gray-500">Manage crop details</h6>
          </div>
          <div className="flex space-x-4">
            <button
              className="text-blue-500 hover:underline"
              onClick={handleRefreshClick}
            >
              Refresh
            </button>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              onClick={handleAddModalOpen}
            >
              Add Crop
            </button>
          </div>
        </div>

        {/* Add Crop Modal */}
        <Modal
          isOpen={addModalOpen}
          onClose={handleAddModalClose}
          title="Add Crop"
        >
          <CropForm handleSubmit={handleAddSubmit} />
        </Modal>

        {/* Edit Crop Modal */}
        <Modal
          isOpen={editModalOpen}
          onClose={handleEditModalClose}
          title="Edit Crop"
        >
          <CropForm
            handleSubmit={handleEditSubmit}
            initialData={selectedCrop}
          />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          title="Confirm Delete"
        >
          <p>Are you sure you want to delete this record?</p>
          <div className="mt-6 flex justify-end">
            <button
              className="px-4 py-2 mr-4 bg-gray-300 rounded hover:bg-gray-400"
              onClick={handleCloseDeleteModal}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => handleDelete(deleteId)}
            >
              Delete
            </button>
          </div>
        </Modal>

        <SearchBar onSearch={handleSearch} />

        <table className="w-full mt-6 bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
                <tr>
                <th className="p-4 text-left">Crop Name</th>
                <th className="p-4 text-left">Crop Type</th>
                <th className="p-4 text-left">Land Size</th>
                <th className="p-4 text-left">Planting Quantity</th>
                <th className="p-4 text-left">Expected Quantity</th>
                <th className="p-4 text-left">Planting Date</th>
                <th className="p-4 text-left">Expected Date</th>
                <th className="p-4 text-left">Action</th>
                </tr>
            </thead>
            <tbody>
                {currentCrops.length ? (
                currentCrops.map((crop) => (
                    <tr key={crop._id} className="border-b">
                    <td className="p-4">{crop.cropName}</td>
                    <td className="p-4">{crop.cropType}</td>
                    <td className="p-4">{crop.landSize}</td>
                    <td className="p-4">{crop.plantingQuantity}</td>
                    <td className="p-4">{crop.expectedQuantity}</td>
                    <td className="p-4">{crop.plantingDate}</td>
                    <td className="p-4">{crop.expectedDate}</td>
                    <td className="p-4 flex space-x-2">
                        <button
                        className="text-blue-500 hover:underline"
                        onClick={() => handleEditModalOpen(crop)}
                        >
                        <FaEdit className="text-3xl" />
                        </button>
                        <button
                        className="text-red-500 hover:underline"
                        onClick={() => handleShowDeleteModal(crop._id)}
                        >
                        <MdDelete className="text-3xl" />
                        </button>
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan="8" className="p-4 text-center text-gray-500">
                    No Data
                    </td>
                </tr>
                )}
            </tbody>
            </table>
          {/* Pagination */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 mr-2 rounded-lg ${
              currentPage === 1 ? "bg-gray-300" : "bg-secondary text-white"
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 ml-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-300"
                : "bg-secondary text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default Crop;
