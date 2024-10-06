import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { FaBars, FaTimes } from "react-icons/fa"; // Import the sun and moon icons
import { LuSun } from "react-icons/lu";
import farmerImg from "../../assets/farmer.jpg";
import { motion } from "framer-motion";
import { AuthContext } from "../../utilities/providers/AuthProvider";
import Swal from "sweetalert2";
import useUser from "../../hooks/useUser";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const navLinks = [
  { name: "Home", route: "/" },
  { name: "About Us", route: "/aboutUs" },
  { name: "Products", route: "/products" },
  { name: "Services", route: "/services" },
  { name: "Contact Us", route: "/contact" },
];

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff0000",
    },
    secondary: {
      main: "#00ff00",
    },
  },
});

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHome, setIsHome] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isFixed, setIsFixed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [navBg, setNavBg] = useState("bg-[#15151580]");
  const { logout, user } = useContext(AuthContext);
  const { currentUser } = useUser();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const darkClass = "dark";
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add(darkClass);
    } else {
      root.classList.remove(darkClass);
    }
  }, [isDarkMode]);

  useEffect(() => {
    setIsHome(location.pathname === "/");
    setIsLogin(location.pathname === "/login");
    setIsFixed(
      location.pathname === "/register" || location.pathname === "/login"
    );
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.pageYOffset;
      setScrollPosition(currentPosition);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  useEffect(() => {
    if (isHome) {
      if (scrollPosition > 100) {
        setNavBg(
          "bg-white backdrop-filter backdrop-blur-xl bg-opacity-0 text-black dark:text-white"
        );
      } else {
        setNavBg("bg-transparent text-white dark:text-white");
      }
    } else {
      setNavBg("bg-white dark:bg-gray-900 text-black dark:text-white");
    }
  }, [scrollPosition, isHome]);

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

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`${
        isHome
          ? navBg
          : "bg-white dark:bg-gray-900 backdrop-blur-2xl text-black dark:text-white"
      } ${
        isFixed ? "static" : "fixed"
      } top-0 transition-colors duration-500 ease-in-out w-full z-10`}
    >
      <div className="lg:w-[95%] mx-auto sm:px-6 lg:px-6">
        <div className="px-4 py-4 flex items-center justify-between">
          {/* logo */}
          <div
            onClick={() => navigate("/")}
            className="flex-shrink-0 cursor-pointer pl-7 md:p-0 flex items-center"
          >
            <div>
              <h1 className="text-2xl font-bold inline-flex gap-3 items-center">
                AgriPeace <img src="/logo.png" alt="" className="w-8 h-8" />
              </h1>
              <p className="font-bold text-[13px] tracking-[6px]">
                Farm With Ease
              </p>
            </div>
          </div>

          {/* mobile menu icons */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="text-secondary hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="h-6 w-6 hover:text-white" /> // Show close icon when menu is open
              ) : (
                <FaBars className="h-6 w-6 hover:text-white" /> // Show hamburger icon when menu is closed
              )}
            </button>
          </div>

          {/* Navigational links */}
          <div className="hidden md:block">
            <div className="flex">
              <ul className="ml-10 flex items-center space-x-5 pr-4">
                {navLinks.map((link) => (
                  <li key={link.route}>
                    <NavLink
                      to={link.route}
                      style={{ whiteSpace: "nowrap" }}
                      className={({ isActive }) =>
                        `font-bold ${
                          isActive
                            ? "text-secondary"
                            : navBg.includes("bg-transparent") && isHome
                            ? "text-white"
                            : "text-black dark:text-white"
                        } hover:text-secondary duration-300`
                      }
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))}

                {/* based on users */}
                {user ? null : isLogin ? (
                  <li>
                    <NavLink
                      to="/register"
                      className={({ isActive }) =>
                        `font-bold ${
                          isActive
                            ? "text-secondary"
                            : `${
                                navBg.includes("bg-transparent")
                                  ? "text-white"
                                  : "text-black dark:text-white"
                              }`
                        } hover:text-secondary duration-300`
                      }
                    >
                      Register
                    </NavLink>
                  </li>
                ) : (
                  <li>
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        `font-bold ${
                          isActive
                            ? "text-secondary"
                            : `${
                                navBg.includes("bg-transparent")
                                  ? "text-white"
                                  : "text-black dark:text-white"
                              }`
                        } hover:text-secondary duration-300`
                      }
                    >
                      Login
                    </NavLink>
                  </li>
                )}

                {user && (
                  <li>
                    <NavLink
                      to="/dashboard"
                      className={({ isActive }) =>
                        `font-bold ${
                          isActive
                            ? "text-secondary"
                            : `${
                                navBg.includes("bg-transparent")
                                  ? "text-white"
                                  : "text-black dark:text-white"
                              }`
                        } hover:text-secondary duration-300`
                      }
                    >
                      Dashboard
                    </NavLink>
                  </li>
                )}

                {user && (
                  <li>
                    <Link to={`/dashboard/user-profile`}>
                      <img
                        src={currentUser?.photoUrl || farmerImg}
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </Link>
                  </li>
                )}

                {user && (
                  <li>
                    <NavLink
                      onClick={handleLogout}
                      className={
                        "font-bold px-3 py-2 bg-secondary text-white rounded-xl"
                      }
                    >
                      Logout
                    </NavLink>
                  </li>
                )}

                {/* Theme Toggle */}
                <li>
                  <ThemeToggle
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="block md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gradient-to-r from-secondary to-white border-2 shadow-2xl rounded-b-xl text-center">
              {navLinks.map((link) => (
                <NavLink
                  key={link.route}
                  to={link.route}
                  className="text-gray-700 block px-3 py-2 rounded-md text-base font-medium hover:bg-secondary hover:text-white"
                >
                  {link.name}
                </NavLink>
              ))}
              {/* Dashboard link for logged-in users */}
              {user && (
                <NavLink
                  to="/dashboard"
                  className="text-gray-700 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white"
                >
                  Dashboard
                </NavLink>
              )}

              {/* Logout for logged-in users */}
              {user && (
                <NavLink
                  onClick={handleLogout}
                  className="text-gray-700 block px-3 py-2 rounded-md text-base font-medium hover:bg-secondary hover:text-white"
                >
                  Logout
                </NavLink>
              )}

              {/* Theme Toggle without circle */}
              <div className="px-3 py-2">
                <ThemeToggle
                  isDarkMode={isDarkMode}
                  setIsDarkMode={setIsDarkMode}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default NavBar;
