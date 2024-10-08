import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useUser from "../hooks/useUser";
import logo from "../assets/logo.png";
import { BiHomeAlt, BiLogInCircle } from "react-icons/bi";
import { FaUsers, FaUserAlt } from "react-icons/fa";
import { GiFertilizerBag, GiField } from "react-icons/gi";
import { MdPayments } from "react-icons/md";
import { BsQrCodeScan } from "react-icons/bs";
import { RiDashboardFill } from "react-icons/ri";
import Swal from "sweetalert2";
import Scroll from "../hooks/useScroll";
import Loader from "../components/Loader/Loader";

const adminNavItems = [
  {
    to: "/dashboard/admin-home",
    icon: <RiDashboardFill className="text-2xl" />,
    label: "Dashboard",
  },
  {
    to: "/dashboard/manage-users",
    icon: <FaUsers className="text-2xl" />,
    label: "Manage Users",
  },
  {
    to: "/dashboard/manage-fertilizers",
    icon: <GiFertilizerBag className="text-2xl" />,
    label: "Fertilizer Management",
  },
  {
    to: "/dashboard/manage-plant",
    icon: <BsQrCodeScan className="text-2xl" />,
    label: "QR Code Scanner",
  },
];

const farmerNavItems = [
  {
    to: "/dashboard/farmer-home",
    icon: <RiDashboardFill className="text-2xl" />,
    label: "Dashboard",
  },
  {
    to: "/dashboard/location",
    icon: <GiField className="text-2xl" />,
    label: "My Locations",
  },
  {
    to: "/dashboard/user-plant",
    icon: <BsQrCodeScan className="text-2xl" />,
    label: "Plants",
  },
  {
    to: "/dashboard/my-payments",
    icon: <MdPayments className="text-2xl" />,
    label: "Payment History",
  },
];

const lastMenuItems = [
  { to: "/", icon: <BiHomeAlt className="text-2xl" />, label: "Main Home" },
  {
    to: "/dashboard/user-profile",
    icon: <FaUserAlt className="text-2xl" />,
    label: "Profile",
  },
];

const DashboardLayout = () => {
  const [open, setOpen] = useState(true);
  const { loader, logout } = useAuth();
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const role = currentUser?.role;

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure want to logout?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout me!",
    }).then((result) => {
      if (result.isConfirmed) {
        logout().then(
          Swal.fire({
            title: "Logged Out!",
            text: "You have been successfully logged out.",
            icon: "success",
          })
        );
        navigate("/").catch((error) => console.log(error));
      }
    });
  };

  if (loader) {
    return <Loader />;
  }

  return (
    <div className="flex">
      <div
        className={`${
          open ? "w-72 overflow-y-auto" : "w-[90px] overflow-auto"
        } bg-white h-screen p-5 md:block hidden pt-8 relative duration-300`}
      >
        <div className="flex gap-x-4 items-center">
          <img
            onClick={() => setOpen(!open)}
            src={logo}
            alt="logo"
            className={`cursor-pointer h-[40px] duration-500 ${
              open && "rotate-[360deg]"
            }`}
          />
          <h1
            onClick={() => setOpen(!open)}
            className={`text-secondary cursor-pointer font-bold origin-left text-xl duration-200 ${
              !open && "scale-0"
            }`}
          >
            EcoTech
          </h1>
        </div>

        {/* NavLinks */}

        {/* admin role */}
        {role === "admin" && (
          <ul className="pt-6">
            <p
              className={`uppercase ml-3 text-gray-500 mb-3 ${
                !open && "hidden"
              }`}
            >
              <small>Menu</small>
            </p>
            {role === "admin" &&
              adminNavItems.map((menuItem, index) => (
                <li key={index} className="mb-2">
                  <NavLink
                    to={menuItem.to}
                    className={({ isActive }) =>
                      `flex ${
                        isActive ? "bg-secondary text-white" : "text-[#413F44]"
                      } duration-150 rounded-md p-2 cursor-pointer hover:scale-105 hover:shadow-md font-bold text-sm items-center gap-x-4`
                    }
                  >
                    {menuItem.icon}
                    <span
                      className={`${
                        !open && "hidden"
                      } origin-left duration-200`}
                    >
                      {menuItem.label}
                    </span>
                  </NavLink>
                </li>
              ))}
          </ul>
        )}

        {/* farmer role */}
        {role === "user" && (
          <ul className="pt-6">
            <p
              className={`uppercase ml-3 text-gray-500 mb-3 ${
                !open && "hidden"
              }`}
            >
              <small>Menu</small>
            </p>
            {role === "user" &&
              farmerNavItems.map((menuItem, index) => (
                <li key={index} className="mb-2">
                  <NavLink
                    to={menuItem.to}
                    className={({ isActive }) =>
                      `flex ${
                        isActive ? "bg-secondary text-white" : "text-[#413F44]"
                      } duration-150 rounded-md p-2 cursor-pointer hover:scale-105 hover:shadow-md font-bold text-sm items-center gap-x-4`
                    }
                  >
                    {menuItem.icon}
                    <span
                      className={`${
                        !open && "hidden"
                      } origin-left duration-200`}
                    >
                      {menuItem.label}
                    </span>
                  </NavLink>
                </li>
              ))}
          </ul>
        )}

        <ul className="pt-6">
          <p
            className={`uppercase ml-3 text-gray-500 mb-3 ${!open && "hidden"}`}
          >
            <small>Useful links</small>
          </p>
          {lastMenuItems.map((menuItem, index) => (
            <li key={index} className="mb-2">
              <NavLink
                to={menuItem.to}
                className={({ isActive }) =>
                  `flex ${
                    isActive ? "bg-secondary text-white" : "text-[#413F44]"
                  } duration-150 rounded-md p-2 cursor-pointer hover:scale-105 hover:shadow-md font-bold text-sm items-center gap-x-4`
                }
              >
                {menuItem.icon}
                <span
                  className={`${!open && "hidden"} origin-left duration-200`}
                >
                  {menuItem.label}
                </span>
              </NavLink>
            </li>
          ))}

          <li>
            <button
              onClick={handleLogout}
              className={`flex w-full text-[#413F44] duration-150 rounded-md p-2 cursor-pointer hover:shadow-md hover:text-red-500 font-bold text-sm items-center gap-x-4`}
            >
              <BiLogInCircle className="text-2xl" />
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                Logout
              </span>
            </button>
          </li>
        </ul>

        {/* User Info Section */}
        {currentUser && (
          <div className="absolute bottom-5 px-4 flex items-center gap-x-4">
            <Link to={`/dashboard/user-profile`}>
              <img
                src={currentUser?.photoUrl}
                alt={currentUser?.name}
                className="w-12 h-12 rounded-full object-cover border-2"
              />
            </Link>
            <span
              className={`${
                !open && "hidden"
              } text-gray-700 font-semibold text-sm`}
            >
              {currentUser?.name || "User"}
            </span>
          </div>
        )}
      </div>

      <div className="h-screen overflow-y-auto px-8 flex-1">
        <Scroll />
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
