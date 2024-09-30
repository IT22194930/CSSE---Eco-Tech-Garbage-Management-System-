import React, { useContext, useEffect, useState } from "react";
import storage from "../../config/firebase.init";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useForm } from "react-hook-form";
import {
  AiOutlineLock,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineUser,
} from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import GoogleLogin from "../../components/Social/GoogleLogin";
import { AuthContext } from "../../utilities/providers/AuthProvider";
import axios from "axios";
import Scroll from "../../hooks/useScroll";

const Register = () => {
  const navigate = useNavigate();
  const [imgPerc, setImgPerc] = useState(0);
  const [img, setImg] = useState(undefined);
  const { signUp, updateUser, setError } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [generalError, setGeneralError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoUrl: "",
    role: "",
    gender: "",
    phone: "",
    address: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (img) {
      uploadFile(img, "photoUrl");
    }
  }, [img]);

  const uploadFile = (file, fileType) => {
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, "images/profilePictures/" + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setUploading(true);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgPerc(Math.round(progress));
      },
      (error) => {
        console.log(error);
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({
            ...prev,
            [fileType]: downloadURL,
          }));
          setUploading(false);
        });
      }
    );
  };

  const onSubmit = (data) => {
    setError("");
    setGeneralError("");
    signUp(data.email, data.password)
      .then((result) => {
        const user = result.user;
        if (user) {
          return updateUser(data.name, data.photoUrl).then(() => {
            const userImp = {
              name: user?.displayName,
              email: user?.email,
              photoUrl: formData.photoUrl,
              role: "user",
              gender: data.gender,
              phone: data.phone,
              address: data.address,
            };

            if (userImp.email && user.displayName) {
              return axios
                .post("http://localhost:3000/new-user", userImp)
                .then(() => {
                  setError("");
                  navigate("/");
                })
                .catch((err) => {
                  setGeneralError(
                    err.response?.data?.message ||
                      "An error occurred. Please try again."
                  );
                });
            }
          });
        }
      })
      .catch((err) => {
        setGeneralError(err.message);
      });
  };

  const password = watch("password", "");

  return (
    <div className="flex justify-center items-center pt-14 bg-white dark:bg-gray-900 -mt-14">
      <Scroll />
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-secondary mb-6">
          Please Register
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center gap-5">
            <div className="mb-4">
              <label
                htmlFor="photoUrl"
                className="block  text-gray-700 font-semibold mb-1"
              >
                {uploading ? `Uploading: ${imgPerc}%` : "Image"}
              </label>
              <input
                type="file"
                className="w-full p-2 border border-gray-300 rounded-md"
                name="photoUrl"
                onChange={(e) => setImg(e.target.files[0])}
              />
              {formData.photoUrl && !uploading && (
                <div className="mt-4">
                  <img
                    src={formData.photoUrl}
                    alt="Uploaded Preview"
                    className="w-40 h-40 rounded-md border border-gray-300"
                  />
                </div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 font-bold mb-2"
              >
                <AiOutlineUser className="inline-block mr-2 mb-1 text-lg" />
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                {...register("name", { required: true })}
                className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:border-blue-300"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">Name is required</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-bold mb-2"
              >
                <AiOutlineLock className="inline-block mr-2 mb-1 text-lg" />
                Password
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                {...register("password", { required: true })}
                className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:border-blue-300"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">Password is required</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-bold mb-2"
              >
                <AiOutlineLock className="inline-block mr-2 mb-1 text-lg" />
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: true,
                  validate: (value) =>
                    value === password || "Password does not match",
                })}
                className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:border-blue-300"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-gray-700 font-bold mb-2"
              >
                <AiOutlinePhone className="inline-block mr-2 mb-1 text-lg" />
                Phone
              </label>
              <input
                type="tel"
                placeholder="Phone Number"
                {...register("phone", { required: true })}
                className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:border-blue-300"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">Phone number is required</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-bold mb-2"
              >
                <AiOutlineMail className="inline-block mr-2 mb-1 text-lg" />
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: true })}
                className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:border-blue-300"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">Email is required</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="gender"
              className="block text-gray-700 font-bold mb-2"
            >
              <AiOutlineUser className="inline-block mr-2 mb-1 text-lg" />
              Gender
            </label>
            <select
              {...register("gender", { required: true })}
              className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm">Gender is required</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-gray-700 font-bold mb-2"
            >
              <HiOutlineLocationMarker className="inline-block mr-2 mb-1 text-lg" />
              Address
            </label>
            <textarea
              {...register("address", { required: true })}
              rows={3}
              placeholder="Enter address"
              className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:border-blue-300"
            ></textarea>
            {errors.address && (
              <p className="text-red-500 text-sm">Address is required</p>
            )}
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-secondary hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              Register
            </button>
          </div>
          {generalError && (
            <div className="text-red-500 text-sm w-full mt-1">
              {generalError}
            </div>
          )}
        </form>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="underline text-blue-500 ml-1">
            Login
          </Link>
        </p>
        <GoogleLogin />
      </div>
    </div>
  );
};

export default Register;
