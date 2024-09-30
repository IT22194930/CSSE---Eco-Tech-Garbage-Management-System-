import React, { useEffect, useState } from "react";
import useAxiosFetch from "../../../../hooks/useAxiosFetch";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useNavigate, useParams } from "react-router-dom";
import LargeModal from "../../../../components/Modal/LargeModal";
import Modal from "../../../../components/Modal/Modal";
import DiseaseForm from "./DiseaseForm";
import { ToastContainer, toast } from "react-toastify";
import { MdDelete, MdOutlineArrowBackIosNew } from "react-icons/md";
import { FaEdit, FaFilePdf } from "react-icons/fa";
import { Link } from "react-router-dom";
import SearchBar from "../../../../components/Search/SearchBar";
import { BlobProvider } from "@react-pdf/renderer";
import DiseaseReport from "./DiseaseReport";

function Diseases() {
  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { plantId } = useParams();
  const [diseases, setDiseases] = useState([]);
  const [filteredDiseases, setFilteredDiseases] = useState([]); // For filtered results
  const [plantName, setPlantName] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [diseasesPerPage] = useState(5); // Number of diseases per page

  useEffect(() => {
    fetchDiseases();
    fetchPlantName(); // Fetch the plant name
  }, [plantId]);

  const fetchDiseases = async () => {
    try {
      const response = await axiosFetch.get(`/api/diseases/plant/${plantId}`);
      if (Array.isArray(response.data)) {
        setDataList(response.data);
        setDiseases(response.data);
        setFilteredDiseases(response.data); // Initialize filteredDiseases
      } else {
        console.error("Unexpected data format:", response.data);
        toast.error("Unexpected data format from server.");
      }
    } catch (err) {
      console.error("Error fetching diseases:", err);
      toast.error("Failed to fetch diseases.");
    }
  };

  const fetchPlantName = async () => {
    try {
      const response = await axiosFetch.get(`/Plant/${plantId}`);
      if (response.data && response.data.name) {
        setPlantName(response.data.name);
      } else {
        console.error("Plant name not found:", response.data);
        toast.error("Failed to fetch plant name.");
      }
    } catch (err) {
      console.error("Error fetching plant details:", err);
      toast.error("Failed to fetch plant details.");
    }
  };

  const handleAddModalOpen = () => setAddModalOpen(true);
  const handleAddModalClose = () => setAddModalOpen(false);

  const handleEditModalOpen = (disease) => {
    setSelectedDisease(disease);
    setEditModalOpen(true);
  };
  const handleEditModalClose = () => setEditModalOpen(false);

  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/api/diseases/${id}`);
      toast.success("Disease Deleted!");
      fetchDiseases(); // Ensure data is refreshed after deletion
      handleCloseDeleteModal();
    } catch (err) {
      console.error("Error deleting disease:", err);
      toast.error("Failed to delete disease.");
    }
  };

  const handleAddSubmit = async (formData) => {
    try {
      await axiosSecure.post(`/api/diseases`, { ...formData, plantId });
      toast.success("Disease Added!");
      handleAddModalClose();
      fetchDiseases(); // Refresh data after adding a disease
    } catch (err) {
      console.error("Error adding disease:", err);
      toast.error("Failed to add disease.");
    }
  };

  const handleEditSubmit = async (formData) => {
    try {
      await axiosSecure.put(`/api/diseases/${formData._id}`, formData);
      toast.success("Disease Updated!");
      handleEditModalClose();
      fetchDiseases(); // Refresh data after editing a disease
    } catch (err) {
      console.error("Error updating disease:", err);
      toast.error("Failed to update disease.");
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

  // Handle Search Query
  const handleSearch = (query) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = diseases.filter((disease) =>
      disease.name.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredDiseases(filtered);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Get current diseases for pagination
  const indexOfLastDisease = currentPage * diseasesPerPage;
  const indexOfFirstDisease = indexOfLastDisease - diseasesPerPage;
  const currentDiseases = filteredDiseases.slice(
    indexOfFirstDisease,
    indexOfLastDisease
  );

  const totalPages = Math.ceil(filteredDiseases.length / diseasesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="mt-10 p-4 bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-6">
        <Link to="/dashboard/manage-plant">
          <MdOutlineArrowBackIosNew className="text-3xl mb-3" />
        </Link>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">
              Plant Diseases - {plantName}
            </h2>
            <h6 className="text-sm text-gray-500">
              Manage diseases for this plant
            </h6>
          </div>
          <div className="flex space-x-4">
            <BlobProvider
              document={<DiseaseReport dataList={dataList} />}
              fileName="DiseaseReport.pdf"
            >
              {({ url, blob }) => (
                <li className="flex items-center">
                  <a href={url} target="_blank" className="flex items-center">
                    <FaFilePdf className="text-3xl text-red-600" />
                  </a>
                </li>
              )}
            </BlobProvider>
            <button
              className="bg-secondary hover:scale-105 text-white py-2 px-4 rounded-lg"
              onClick={handleAddModalOpen}
            >
              Add Disease
            </button>
          </div>
        </div>

        {/* Add Disease Modal */}
        <LargeModal
          isOpen={addModalOpen}
          onClose={handleAddModalClose}
          title="Add Disease"
        >
          <DiseaseForm handleSubmit={handleAddSubmit} />
        </LargeModal>

        {/* Edit Disease Modal */}
        <LargeModal
          isOpen={editModalOpen}
          onClose={handleEditModalClose}
          title="Edit Disease"
        >
          <DiseaseForm
            handleSubmit={handleEditSubmit}
            initialData={selectedDisease}
          />
        </LargeModal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          title="Confirm Delete"
        >
          <p>Are you sure you want to delete this disease?</p>
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
              <th className="p-4 text-left">Causal Agent</th>
              <th className="p-4 text-left">Disease Transmission</th>
              <th className="p-4 text-left">Disease Symptoms</th>
              <th className="p-4 text-left">Control</th>
              <th className="p-4 text-left">Fertilizers</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentDiseases.length ? (
              currentDiseases.map((disease) => (
                <tr key={disease._id} className="border-b">
                  <td className="p-4">
                    {disease.imageUrl ? (
                      <img
                        src={disease.imageUrl}
                        alt={disease.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="p-4">{disease.name}</td>
                  <td className="p-4">{disease.causalAgent}</td>
                  <td className="p-4">{disease.diseaseTransmission}</td>
                  <td className="p-4">{disease.diseaseSymptoms}</td>
                  <td className="p-4">{disease.control}</td>
                  <td className="p-4 w-40">
                    <ul className="list-disc list-inside">
                      {disease.fertilizers.map((fertilizer, index) => (
                        <li key={index}>{fertilizer}</li>
                      ))}
                    </ul>
                  </td>

                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button
                        className="text-3xl text-blue-600 hover:text-blue-800"
                        onClick={(e) => {
                          handleEditModalOpen(disease);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-3xl text-red-600 hover:text-red-800"
                        onClick={(e) => {
                          handleShowDeleteModal(disease._id);
                        }}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center p-4 text-gray-500 font-semibold"
                >
                  No Diseases Found
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
      <ToastContainer />
    </div>
  );
}

export default Diseases;
