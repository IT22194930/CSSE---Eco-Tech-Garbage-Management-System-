import React, { useEffect, useState } from "react";
import useAxiosFetch from "../../../../hooks/useAxiosFetch";
import { useParams } from "react-router-dom";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { Link } from "react-router-dom";
import SearchBar from "../../../../components/Search/SearchBar";
import LargeModal from "../../../../components/Modal/LargeModal";

function Diseases() {
  const axiosFetch = useAxiosFetch();
  const { plantId } = useParams();
  const [diseases, setDiseases] = useState([]);
  const [filteredDiseases, setFilteredDiseases] = useState([]);
  const [plantName, setPlantName] = useState("");
  const [selectedDisease, setSelectedDisease] = useState(null);

  useEffect(() => {
    fetchDiseases();
    fetchPlantName();
  }, [plantId]);

  useEffect(() => {
    // Save filtered diseases in local storage
    localStorage.setItem(
      `diseases-filteredDiseases-${plantId}`,
      JSON.stringify(filteredDiseases)
    );
  }, [filteredDiseases]);

  useEffect(() => {
    // Load saved state
    const savedFilteredDiseases = localStorage.getItem(
      `diseases-filteredDiseases-${plantId}`
    );

    if (savedFilteredDiseases)
      setFilteredDiseases(JSON.parse(savedFilteredDiseases));
  }, [plantId]);

  const fetchDiseases = async () => {
    try {
      const response = await axiosFetch.get(`/api/diseases/plant/${plantId}`);
      if (Array.isArray(response.data)) {
        setDiseases(response.data);
        setFilteredDiseases(response.data);
      } else {
        console.error("Unexpected data format:", response.data);
      }
    } catch (err) {
      console.error("Error fetching diseases:", err);
    }
  };

  const fetchPlantName = async () => {
    try {
      const response = await axiosFetch.get(`/Plant/${plantId}`);
      if (response.data && response.data.name) {
        setPlantName(response.data.name);
      } else {
        console.error("Plant name not found:", response.data);
      }
    } catch (err) {
      console.error("Error fetching plant details:", err);
    }
  };

  const handleSearch = (query) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = diseases.filter((disease) =>
      disease.name.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredDiseases(filtered);
  };

  const handleDiseaseClick = (disease) => {
    setSelectedDisease(disease);
  };

  return (
    <div className="mt-10 p-4 bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-6">
        <Link to="/dashboard/user-plant">
          <MdOutlineArrowBackIosNew className="text-3xl mb-3" />
        </Link>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">
              Plant Diseases - {plantName}
            </h2>
            <h6 className="text-sm text-gray-500">
              View diseases for this plant
            </h6>
          </div>
        </div>

        <SearchBar onSearch={handleSearch} />

        {/* Disease Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {filteredDiseases.length ? (
            filteredDiseases.map((disease) => (
              <div
                key={disease._id}
                onClick={() => handleDiseaseClick(disease)}
                className="cursor-pointer bg-white shadow-md rounded-lg p-4 flex flex-col items-center justify-center"
              >
                {disease.imageUrl ? (
                  <img
                    src={disease.imageUrl}
                    alt={disease.name}
                    className="w-20 h-20 object-cover rounded-lg mb-2"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-300 rounded-lg mb-2" />
                )}
                <h4 className="text-md font-semibold text-gray-700">
                  {disease.name}
                </h4>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No Diseases Found
            </p>
          )}
        </div>
      </div>

      {/* Large Modal for Disease Details */}
      {selectedDisease && (
        <LargeModal
          isOpen={!!selectedDisease}
          onClose={() => setSelectedDisease(null)}
          title={selectedDisease.name}
        >
          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="flex flex-col space-y-4">
              <img
                src={selectedDisease.imageUrl}
                alt={selectedDisease.name}
                className="w-full h-64 object-cover rounded-lg mb-4 border border-gray-300"
                loading="lazy"
              />
              <div className="text-gray-700 space-y-3">
                <p className="text-lg font-semibold">
                  <strong>Causal Agent:</strong> {selectedDisease.causalAgent}
                </p>
                <p className="text-sm">
                  <strong>Transmission:</strong>{" "}
                  {selectedDisease.diseaseTransmission}
                </p>
                <p className="text-sm">
                  <strong>Symptoms:</strong> {selectedDisease.diseaseSymptoms}
                </p>
                <p className="text-sm">
                  <strong>Control:</strong> {selectedDisease.control}
                </p>
                <div>
                  <strong>Fertilizers:</strong>
                  <ul className="list-disc list-inside">
                    {selectedDisease.fertilizers.map((fertilizer, index) => (
                      <li key={index}>{fertilizer}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </LargeModal>
      )}
    </div>
  );
}

export default Diseases;
