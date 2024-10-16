import React, { useEffect, useState } from "react";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useUser from "../../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { GrUpdate } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { writeFile } from "xlsx";
import CollectorReport from "./Reports/CollectorReports";
import { BlobProvider } from "@react-pdf/renderer";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";

const ManageCollectors = () => {
  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [collectors, setCollectors] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [roleFilter, setRoleFilter] = useState("");
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    axiosFetch
      .get("/users")
      .then((res) => {
        const collector = res.data.filter((user) => user.role === "admin");
        // Sorting users by name in alphabetical order
        const sortedAdmins = collector.sort((a, b) => a.name.localeCompare(b.name));
        setCollectors(sortedAdmins);
        setDataList(sortedAdmins);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure you want to delete the user?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete User!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/delete-user/${id}`)
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "You have successfully deleted the user.",
              icon: "success",
            }).then(() => {
              window.location.reload();
            });
          })
          .catch((err) => console.log(err));
      }
    });
  };

  const generateExcelFile = () => {
    const rearrangedDataList = dataList.map((user) => ({
      Name: user.name,
      Email: user.email,
      Address: user.address,
      Telephone: user.phone
    }));

    const ws = XLSX.utils.json_to_sheet(rearrangedDataList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Collecotrs Report");
    writeFile(wb, "collectors_report.xlsx");
  };

  const handleButtonClick = () => {
    generateExcelFile();
  };

//   Filter collectors by search query and role
  const filteredCollectors = collectors.filter((collector) => {
    const matchesSearch = collector?.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="px-4 sm:px-0">
      <h1 className="text-center text-4xl font-bold my-7">
        Manage <span className="text-secondary">Collectors</span>
      </h1>

      {/* Search and Filter Inputs */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search collectors by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
        <div
            className="flex space-x-4"
            data-aos="flip-up"
            data-aos-duration="1000"
          >
            <BlobProvider
              document={<CollectorReport dataList={dataList} />}
              fileName="CollectorReport.pdf"
            >
              {({ url }) => (
                <li className="flex items-center">
                  <a href={url} target="_blank" className="flex items-center">
                    <FaFilePdf className="text-3xl text-red-600" />
                  </a>
                </li>
              )}
            </BlobProvider>
            <li className="flex items-center">
              <a
                href="#"
                onClick={handleButtonClick}
                className="flex items-center"
              >
                <FaFileExcel className="text-3xl text-green-600" />
              </a>
            </li>
            
          </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex flex-col">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              {filteredCollectors.length === 0 ? (
                <p className="text-center text-gray-500">
                  No collectors found
                </p>
              ) : (
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="border-b font-medium hidden md:table-header-group">
                    <tr>
                      <th scope="col" className="px-4 py-4">
                        #
                      </th>
                      <th scope="col" className="px-4 py-4">
                        PHOTO
                      </th>
                      <th scope="col" className="px-4 py-4">
                        NAME
                      </th>
                      <th scope="col" className="px-4 py-4">
                        UPDATE
                      </th>
                      <th scope="col" className="px-4 py-4">
                        DELETE
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCollectors.map((collector, idx) => (
                      <tr
                        key={collector._id}
                        className="border-b transition duration-300 ease-in-out hover:bg-neutral-100"
                      >
                        <td className="whitespace-nowrap px-4 py-4 font-medium">
                          {idx + 1}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <img
                            src={collector?.photoUrl}
                            alt=""
                            className="h-[35px] w-[35px] object-cover rounded-full"
                          />
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          {collector?.name}{" "}
                          {currentUser?._id === collector._id && (
                            <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-md">
                              You
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <span
                            onClick={() =>
                              navigate(`/dashboard/update-collector/${collector._id}`)
                            }
                            className="inline-flex items-center gap-2 cursor-pointer bg-green-500 py-1 rounded-md px-2 text-white"
                          >
                            Update <GrUpdate className="text-white" />
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <span
                            onClick={() => handleDelete(collector._id)}
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
              
              {/* Responsive Table for Mobile
              {filteredUsers.length > 0 && (
                <div className="md:hidden">
                  {filteredUsers.map((user, idx) => (
                    <div key={user._id} className="border-b py-4 flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className="font-medium dark:text-white">#{idx + 1}</span>
                        <img
                          src={user?.photoUrl}
                          alt=""
                          className="h-[35px] w-[35px] rounded-full"
                        />
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="dark:text-white">{user?.name}</span>
                        {currentUser?._id === user._id && (
                          <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-md">
                            You
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="dark:text-white">{user?.role}</span>
                        <span
                          onClick={() =>
                            navigate(`/dashboard/update-user/${user._id}`)
                          }
                          className="cursor-pointer bg-green-500 py-1 rounded-md px-2 text-white"
                        >
                          Update
                        </span>
                        <span
                          onClick={() => handleDelete(user._id)}
                          className="cursor-pointer bg-red-600 py-1 rounded-md px-2 text-white"
                        >
                          Delete
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCollectors;