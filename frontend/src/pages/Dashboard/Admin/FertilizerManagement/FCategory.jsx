import React, { useEffect, useState } from "react";
import useAxiosFetch from "../../../../hooks/useAxiosFetch";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";
import Modal from "../../../../components/Modal/Modal";
import PlantForm from "./PlantForm";
import SearchBar from "./SearchBar";
import { ToastContainer, toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

function Plant() {
  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [plant, setPlant] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [filteredDataList, setFilteredDataList] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await axiosFetch.get("/Plant/");
      console.log("Fetched Plants Data:", response.data); // Debug log
      // Verify the data structure
      if (Array.isArray(response.data)) {
        setDataList(response.data);
        setFilteredDataList(response.data);
      } else {
        console.error("Unexpected data format:", response.data);
        toast.error("Unexpected data format from server.");
      }
    } catch (err) {
      console.error("Error fetching plants:", err);
      toast.error("Failed to fetch plants.");
    }
  };

  const handleSearch = (query) => {
    const filteredList = dataList.filter((plant) => {
      const fullName = `${plant.name} ${plant.date}`;
      return fullName.toLowerCase().includes(query.toLowerCase());
    });
    setFilteredDataList(filteredList);
  };

  const handleRefreshClick = () => {
    fetchPlants();
  };

  const handleAddModalOpen = () => setAddModalOpen(true);
  const handleAddModalClose = () => setAddModalOpen(false);

  const handleEditModalOpen = (plant) => {
    setSelectedPlant(plant);
    setEditModalOpen(true);
  };
  const handleEditModalClose = () => setEditModalOpen(false);

  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/Plant/delete/${id}`);
      toast.success("Successfully Deleted!");
      fetchPlants(); // Ensure data is refreshed after deletion
      handleCloseDeleteModal();
    } catch (err) {
      console.error("Error deleting plant:", err);
      toast.error("Failed to delete plant.");
    }
  };

  const handleAddSubmit = async (formData) => {
    try {
      await axiosSecure.post("/Plant/add", formData);
      toast.success("Plant Added!");
      handleAddModalClose();
      fetchPlants(); // Refresh data after adding a plant
    } catch (err) {
      console.error("Error adding plant:", err);
      toast.error("Failed to add plant.");
    }
  };

  const handleEditSubmit = async (formData) => {
    try {
      await axiosSecure.put(`/Plant/update/${formData._id}`, formData);
      toast.success("Plant Updated!");
      handleEditModalClose();
      fetchPlants(); // Refresh data after editing a plant
    } catch (err) {
      console.error("Error updating plant:", err);
      toast.error("Failed to update plant.");
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

  return (
    <div className="mt-10 p-4 bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">
              Plant Details
            </h2>
            <h6 className="text-sm text-gray-500">Manage plant details</h6>
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
              Add Plant
            </button>
          </div>
        </div>

        {/* Add Plant Modal */}
        <Modal
          isOpen={addModalOpen}
          onClose={handleAddModalClose}
          title="Add Plant"
        >
          <PlantForm handleSubmit={handleAddSubmit} />
        </Modal>

        {/* Edit Plant Modal */}
        <Modal
          isOpen={editModalOpen}
          onClose={handleEditModalClose}
          title="Edit Plant"
        >
          <PlantForm
            handleSubmit={handleEditSubmit}
            initialData={selectedPlant}
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
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDataList.length ? (
              filteredDataList.map((plant) => (
                <tr key={plant._id} className="border-b">
                  <td className="p-4">
                    {plant.imageUrl && (
                      <img
                        src={plant.imageUrl}
                        alt="Plant"
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    )}
                  </td>
                  <td className="p-4">{plant.name}</td>
                  <td className="p-4">{plant.date}</td>
                  <td className="p-4">{plant.description}</td>
                  <td className="p-4 flex space-x-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleEditModalOpen(plant)}
                    >
                      <FaEdit className="text-3xl" />
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleShowDeleteModal(plant._id)}
                    >
                      <MdDelete className="text-3xl" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No Data
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

export default Plant;
