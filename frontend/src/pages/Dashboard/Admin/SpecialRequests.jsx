import { useNavigate } from "react-router-dom";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";

const SpecialRequests = () => {
  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [specialRequests, setSpecialRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axiosFetch
      .get("/api/garbageRequests")
      .then((res) => {
        const specialReq = res.data.filter((request) => request.type != "Normal Waste");
        setSpecialRequests(specialReq);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="px-4 sm:px-0">
      <h1 className="text-center text-4xl font-bold my-7 dark:text-white">
        Special Requests
      </h1>

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search pending requests"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="overflow-x-auto">
        <div className="flex flex-col">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              {specialRequests.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-300">
                  No special requests found.
                </p>
              ) : (
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="border-b font-medium dark:border-neutral-500 hidden md:table-header-group">
                    <tr>
                      <th scope="col" className="px-4 py-4 dark:text-white">
                        Type
                      </th>
                      <th scope="col" className="px-4 py-4 dark:text-white">
                        Description
                      </th>
                      <th scope="col" className="px-4 py-4 dark:text-white">
                        Date
                      </th>
                      <th scope="col" className="px-4 py-4 dark:text-white">
                        Time
                      </th>
                      <th scope="col" className="px-4 py-4 dark:text-white">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-4 dark:text-white">
                        Recyclable Quantity
                      </th>
                      <th scope="col" className="px-4 py-4 dark:text-white">
                        Cashback Price
                      </th>
                      <th scope="col" className="px-4 py-4 dark:text-white">
                        Total Cost
                      </th>
                      <th scope="col" className="px-4 py-4 dark:text-white">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {specialRequests.map((specialReq, idx) => (
                      <tr
                        key={specialReq._id} // Using specialReq._id instead of user._id
                        className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
                      >
                        {/* Type */}
                        <td className="whitespace-nowrap px-4 py-4 font-medium dark:text-white">
                          {specialReq?.type}
                        </td>

                        {/* Description */}
                        <td className="whitespace-nowrap px-4 py-4 dark:text-white">
                          {specialReq?.description}
                        </td>

                        {/* Date */}
                        <td className="whitespace-nowrap px-4 py-4 dark:text-white">
                          {new Date(specialReq?.date).toLocaleDateString()}
                        </td>

                        {/* Time */}
                        <td className="whitespace-nowrap px-4 py-4 dark:text-white">
                          {specialReq?.time}
                        </td>

                        {/* Status */}
                        <td className="whitespace-nowrap px-4 py-4 dark:text-white">
                          {specialReq?.status}
                        </td>

                        {/* Recyclable Quantity */}
                        <td className="whitespace-nowrap px-4 py-4 dark:text-white">
                          {specialReq?.recyclableQuantity}
                        </td>

                        {/* Cashback Price */}
                        <td className="whitespace-nowrap px-4 py-4 dark:text-white">
                          {specialReq?.cashbackPrice}
                        </td>

                        {/* Total Cost */}
                        <td className="whitespace-nowrap px-4 py-4 dark:text-white">
                          {specialReq?.totalCost}
                        </td>

                        {/* Created At */}
                        <td className="whitespace-nowrap px-4 py-4 dark:text-white">
                          {new Date(specialReq?.createdAt).toLocaleString()}
                        </td>

                        {/* Delete Button */}
                        <td className="whitespace-nowrap px-4 py-4">
                          <span
                            onClick={() => handleDelete(specialReq._id)} // Using specialReq._id instead of user._id
                            className="inline-flex items-center gap-2 cursor-pointer bg-red-600 py-1 rounded-md px-2 text-white"
                          >
                            Delete <MdDelete className="text-white" />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialRequests;
