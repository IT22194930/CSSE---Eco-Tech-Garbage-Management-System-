import React from "react";
import useAuth from "../../../hooks/useAuth";
import { useLoaderData, useNavigate } from "react-router-dom";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useUser from "../../../hooks/useUser";

const UpdateUser = () => {
  const { user } = useAuth();
  const userCredentials = useLoaderData();
  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();
  const { currentUser } = useUser();
  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = Object.fromEntries(formData);
    axiosSecure
      .put(`/update-user/${userCredentials._id}`, updatedData)
      .then((res) => {
        alert("User updated successfully !");
        navigate(`/dashboard/manage-users`);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h1 className="mt-5 text-4xl font-bold text-center">
        Update : <span className="text-secondary">{userCredentials?.name}</span>
      </h1>
      <p className="text-center">
        Change details about{" "}
        <span className="font-bold text-red-400">{userCredentials?.name}</span>
      </p>

      <div>
        {currentUser?._id === userCredentials?._id && (
          <h1 className="text-center text-lg font-semibold text-red-500 bg-green-100 p-2 rounded-md shadow-md mt-10 mx-4 mb-4">
            This is you
          </h1>
        )}
      </div>

      <section className="">
        <div className="px-4 pb-16 mx-auto sm:px-6 lg:px-8">
          <div className="p-8 bg-white rounded-lg shadow-lg lg:p-12">
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="pb-4 ml-2" htmlFor="name">
                    Name
                  </label>
                  <input
                    className="w-full p-3 mt-3 text-sm border rounded-lg outline-none border-secondary"
                    placeholder="Your Name"
                    type="text"
                    required
                    defaultValue={
                      userCredentials?.name ? userCredentials?.name : ""
                    }
                    id="name"
                    name="name"
                  />
                </div>
                <div>
                  <label className="pb-4 ml-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="w-full p-3 mt-3 text-sm border rounded-lg outline-none border-secondary"
                    placeholder="Email Address"
                    type="email"
                    required
                    defaultValue={userCredentials?.email}
                    id="email"
                    name="email"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="ml-2" htmlFor="phone">
                      Phone
                    </label>
                    <input
                      className="w-full p-3 mt-3 text-sm border rounded-lg outline-none border-secondary"
                      placeholder="Phone Number"
                      type="tel"
                      required
                      defaultValue={
                        userCredentials?.phone ? userCredentials?.phone : ""
                      }
                      id="phone"
                      name="phone"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="ml-2" htmlFor="address">
                    Address
                  </label>
                  <input
                    className="w-full p-3 mt-2 text-sm border rounded-lg outline-none border-secondary"
                    placeholder="Address"
                    type="text"
                    defaultValue={userCredentials?.address}
                    id="address"
                    name="address"
                  />
                </div>
                <div>
                  <label className="ml-2" htmlFor="photoUrl">
                    Photo URL
                  </label>
                  <input
                    className="w-full p-3 mt-2 text-sm border rounded-lg outline-none border-secondary"
                    placeholder="Photo URL"
                    type="text"
                    defaultValue={userCredentials?.photoUrl}
                    id="photoUrl"
                    name="photoUrl"
                  />
                </div>
              </div>
              <h1>Please select a role</h1>
              <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-2">
                <div>
                  <input
                    className="sr-only peer"
                    id="option1"
                    type="radio"
                    value="user"
                    defaultChecked={
                      userCredentials?.role === "user" ? true : false
                    }
                    tabIndex="-1"
                    name="role"
                  />
                  <label
                    htmlFor="option1"
                    className="block w-full p-3 border rounded-lg border-secondary peer-checked:border-secondary peer-checked:bg-secondary peer-checked:text-white"
                    tabIndex="0"
                  >
                    <span className="text-sm font-medium">User</span>
                  </label>
                </div>
                <div>
                  <input
                    className="sr-only peer"
                    id="option2"
                    type="radio"
                    value="admin"
                    defaultChecked={
                      userCredentials?.role === "admin" ? true : false
                    }
                    tabIndex="-1"
                    name="role"
                  />
                  <label
                    htmlFor="option2"
                    className="block w-full p-3 border rounded-lg border-secondary peer-checked:border-secondary peer-checked:bg-secondary peer-checked:text-white"
                    tabIndex="0"
                  >
                    <span className="text-sm font-medium">Admin</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="sr-only" htmlFor="message">
                  About
                </label>
                <textarea
                  className="w-full p-3 text-sm border rounded-lg outline-none resize-none border-secondary"
                  placeholder="About user"
                  name=""
                  id=""
                ></textarea>
              </div>

              <div className="flex justify-center">
                <button
                  className="px-10 py-5 text-white rounded-lg bg-secondary hover:bg-red-500 hover:shadow-lg hover:outline-black"
                  type="submit"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UpdateUser;
