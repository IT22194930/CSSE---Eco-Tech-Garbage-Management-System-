import React, { useEffect, useState } from "react";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useUser from "../../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { GrUpdate } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";

const ManageUsers = () => {
  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [roleFilter, setRoleFilter] = useState(""); // State for role filter

  useEffect(() => {
    axiosFetch
      .get("/users")
      .then((res) => {
        // Sorting users by name in alphabetical order
        const sortedUsers = res.data.sort((a, b) => a.name.localeCompare(b.name));
        setUsers(sortedUsers);
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

  // Filter users by search query and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter ? user?.role === roleFilter : true; // Check if role matches or no role is selected
    return matchesSearch && matchesRole;
  });

  return (
    <div className="px-4 sm:px-0">
      <h1 className="text-center text-4xl font-bold my-7 dark:text-white">
        Manage <span className="text-secondary">Users</span>
      </h1>

      {/* Search and Filter Inputs */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search users by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <div className="flex flex-col">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              {filteredUsers.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-300">
                  No users found
                </p>
              ) : (
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="border-b font-medium dark:border-neutral-500 hidden md:table-header-group">
                    <tr>
                      <th scope="col" className="px-4 py-4 dark:text-white">
                        #
                      </th>
                      <th scope="col" className="px-4 py-4 dark:text-white">
                        PHOTO
                      </th>
                      <th scope="col" className="px-4 py-4 dark:text-white">
                        NAME
                      </th>
                      <th scope="col" className="px-4 py-4 dark:text-white">
                        ROLE
                      </th>
                      <th scope="col" className="px-4 py-4 dark:text-white">
                        UPDATE
                      </th>
                      <th scope="col" className="px-4 py-4 dark:text-white">
                        DELETE
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, idx) => (
                      <tr
                        key={user._id}
                        className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
                      >
                        <td className="whitespace-nowrap px-4 py-4 font-medium dark:text-white">
                          {idx + 1}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <img
                            src={user?.photoUrl}
                            alt=""
                            className="h-[35px] w-[35px] object-cover rounded-full"
                          />
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 dark:text-white">
                          {user?.name}{" "}
                          {currentUser?._id === user._id && (
                            <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-md">
                              You
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 dark:text-white">
                          {user?.role}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <span
                            onClick={() =>
                              navigate(`/dashboard/update-user/${user._id}`)
                            }
                            className="inline-flex items-center gap-2 cursor-pointer bg-green-500 py-1 rounded-md px-2 text-white"
                          >
                            Update <GrUpdate className="text-white" />
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <span
                            onClick={() => handleDelete(user._id)}
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
              
              {/* Responsive Table for Mobile */}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;