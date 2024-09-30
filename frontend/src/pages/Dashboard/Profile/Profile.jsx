import React from "react";
import useUser from "../../../hooks/useUser";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Profile = () => {
  const { currentUser } = useUser();
  const userCredentials = currentUser;
  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = Object.fromEntries(formData);
    axiosSecure
      .put(`/update-user/${userCredentials._id}`, updatedData)
      .then((res) => {
        alert("User updated successfully !");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h1 className="mt-5 text-4xl font-bold text-center">
        Update <span className="text-secondary">Profile</span>
      </h1>
      <p className="text-center">
        Change your details
      </p>

      <section className="">
        <div className="px-4 py-16 mx-auto sm:px-6 lg:px-8">
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
                    disabled
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
              
              
              <div className="flex justify-center">
                <button
                  className="px-10 py-5 text-white rounded-lg bg-secondary hover:bg-red-500 hover:shadow-lg hover:outline-black"
                  type="submit"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
