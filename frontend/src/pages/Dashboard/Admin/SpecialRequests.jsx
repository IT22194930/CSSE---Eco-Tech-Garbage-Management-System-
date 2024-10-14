import { useNavigate } from "react-router-dom";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";

const SpecialRequests = () => {
  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [specialRequests, setSpecialRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [reqFilter ,setReqFilter] = useState("");

  useEffect(() => {
    axiosFetch
      .get("/api/garbageRequests")
      .then((res) => {
        const specialReq = res.data.filter((request) => request.type !== "Normal Waste");
        setSpecialRequests(specialReq);
      })
      .catch((err) => console.log(err));
  }, []);

  const filteredSpecialReq = specialRequests.filter((specialReq) => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const matchesSearch =
      specialReq?.type?.toLowerCase().includes(lowercasedQuery) ||
      specialReq?.username?.toLowerCase().includes(lowercasedQuery); // Include username search

    const matchesReq = reqFilter ? specialReq?.type === reqFilter : true;
    return matchesSearch && matchesReq;
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure you want to delete the special request?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete special request!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/api/garbageRequests/${id}`)
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "You have successfully deleted the special request.",
              icon: "success",
            }).then(() => {
              window.location.reload();
            });
          })
          .catch((err) => console.log(err));
      }
    });
  };

  return (
    <div className="px-4 sm:px-0">
      <h1 className="text-center text-4xl font-bold my-7">
        Special Requests
      </h1>

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search pending requests by name or type"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-md "
        />
      </div>

      <div className="overflow-x-auto">
        <div className="flex flex-col">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              {filteredSpecialReq.length === 0 ? (
                <p className="text-center text-gray-500">
                  No special requests found.
                </p>
              ) : (
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="border-b font-medium hidden md:table-header-group">
                    <tr>
                        <th scope="col" className="px-4 py-4">
                        Name
                      </th>
                      <th scope="col" className="px-4 py-4 ">
                        Type
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Description
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Date
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Time
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Recyclable Quantity
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Cashback Price
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Total Cost
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSpecialReq.map((specialReq, idx) => (
                      <tr
                        key={specialReq._id}
                        className="border-b transition duration-300 ease-in-out hover:bg-neutral-100"
                      >
                        <td className="whitespace-nowrap px-4 py-4 font-medium">
                          {specialReq?.username}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 font-medium">
                          {specialReq?.type}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          {specialReq?.description}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          {new Date(specialReq?.date).toLocaleDateString()}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          {specialReq?.time}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          {specialReq?.status}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          {specialReq?.recyclableQuantity}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          {specialReq?.cashbackPrice}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          {specialReq?.totalCost}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          {new Date(specialReq?.createdAt).toLocaleString()}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          <span
                            onClick={() => handleDelete(specialReq._id)}
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
