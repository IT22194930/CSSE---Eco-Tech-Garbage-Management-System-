import { useEffect, useState } from "react";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { MdDelete, MdPushPin, MdVisibilityOff } from "react-icons/md";

const Feedbacks = () => {
  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackFilter, setFeedbackFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hiddenFeedbacks, setHiddenFeedbacks] = useState(new Set());
  const [pinnedFeedbacks, setPinnedFeedbacks] = useState(new Set());

  useEffect(() => {
    axiosFetch
      .get("/api/garbageRequests")
      .then((res) => {
        setFeedbacks(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const filteredFeedback = feedbacks.filter((feedback) => {
    const matchesSearch = feedback?.username
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFeedback = feedbackFilter
      ? feedback?.username === feedbackFilter
      : true;
    return matchesSearch && matchesFeedback && !hiddenFeedbacks.has(feedback._id);
  });

  const handleClearFeedback = (id) => {
    axiosSecure
      .patch(`/api/garbageRequests/${id}`, { feedback: "" })  // Update the feedback field only
      .then((response) => {
        console.log("Feedback deleted successfully:", response); // Log success response
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.map((feedback) =>
            feedback._id === id ? { ...feedback, feedback: "" } : feedback
          )
        );
      })
      .catch((err) => {
        console.error("Error clearing feedback:", err); // Log any errors
      });
  };

  // Function to pin feedback
  const handlePin = (id) => {
    setPinnedFeedbacks((prev) => {
      const updatedPins = new Set(prev);
      updatedPins.has(id) ? updatedPins.delete(id) : updatedPins.add(id);
      return updatedPins;
    });
  };

  return (
    <div className="px-4 sm:px-0">
      <h1 className="text-center text-4xl font-bold my-7">Customer Feedbacks</h1>

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search feedback by user"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeedback.length === 0 ? (
          <p className="text-center text-gray-500">No user found.</p>
        ) : (
          filteredFeedback.map((feedback) => (
            <div key={feedback._id} className="bg-white border rounded-md p-4 shadow-md transition-transform duration-300 hover:scale-105">
              <h2 className="text-xl font-semibold">{feedback?.username}</h2>
              <p className="mt-2 text-gray-700">{feedback?.feedback || "No feedback available."}</p>
              <div className="mt-4">
                <span
                  onClick={() => handleClearFeedback(feedback._id)}  // Use the new clear feedback function
                  className="inline-flex items-center gap-2 cursor-pointer bg-red-600 py-1 rounded-md px-2 text-white"
                >
                  Clear Feedback <MdDelete className="text-white" />
                </span>
                <span
                  onClick={() => handlePin(feedback._id)}
                  className={`inline-flex items-center gap-2 cursor-pointer py-1 rounded-md px-2 ${pinnedFeedbacks.has(feedback._id) ? 'bg-blue-600' : 'bg-yellow-600'} text-white`}
                >
                  {pinnedFeedbacks.has(feedback._id) ? 'Unpin' : 'Pin'} <MdPushPin className="text-white" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feedbacks;
