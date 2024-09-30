import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home/Home";
import Services from "../pages/Services/Services";
import ContactUs from "../pages/ContactUs/ContactUs";
import AboutUs from "../pages/AboutUs/AboutUs";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import FarmerHome from "../pages/Dashboard/Farmer/FarmerHome";
import AdminHome from "../pages/Dashboard/Admin/AdminHome";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import UpdateUser from "../pages/Dashboard/Admin/UpdateUser";
import PlantManagement from "../pages/Dashboard/Admin/PlantManagement";
import CostCalculator from "../pages/CostCalculator/CostCalculator";
import MyCrops from "../pages/Dashboard/Farmer/MyCrops/MyCrops";
import FertilizerManagementDashboard from "../pages/Dashboard/Admin/FertilizerManagementDashboard";
import Location from "../pages/Dashboard/Farmer/LocationManagement/Location";
import Diseases from "../pages/Dashboard/Admin/PlantManagement/Diseases";
import UserDiseases from "../pages/Dashboard/Farmer/Plant/Diseases";
import Crops from "../pages/Dashboard/Farmer/LocationManagement/Crop";
import Profile from "../pages/Dashboard/Profile/Profile";
import UserPlant from "../pages/Dashboard/Farmer/Plant/Plant";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/contact",
        element: <ContactUs />,
      },
      {
        path: "/aboutUs",
        element: <AboutUs />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/costCalculator",
        element: <CostCalculator />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "user-profile",
        element: <Profile />,
      },

      // farmer routes
      {
        path: "farmer-home",
        element: <FarmerHome />,
      },
      {
        path: "my-crops",
        element: <MyCrops />,
      },
      {
        path: "location",
        element: <Location />,
      },
      {
        path: "location/crops/:locationId", // Route for crops
        element: <Crops />,
        loader: ({ params }) =>
          fetch(`http://localhost:3000/locations/${params.locationId}/crops`),
      },
      {
        path: "user-plant",
        element: <UserPlant />,
      },
      {
        path: "user-plant/diseases/:plantId", // Route for plant diseases
        element: <UserDiseases />,
        loader: ({ params }) =>
          fetch(`http://localhost:3000/plants/${params.plantId}/diseases`),
      },

      // admin routes
      {
        path: "admin-home",
        element: <AdminHome />,
      },
      {
        path: "manage-users",
        element: <ManageUsers />,
      },
      {
        path: "update-user/:id",
        element: <UpdateUser />,
        loader: ({ params }) =>
          fetch(`http://localhost:3000/users/${params.id}`),
      },

      // plant management
      {
        path: "manage-plant",
        element: <PlantManagement />,
      },
      {
        path: "manage-plant/diseases/:plantId", // Route for plant diseases
        element: <Diseases />,
        loader: ({ params }) =>
          fetch(`http://localhost:3000/plants/${params.plantId}/diseases`),
      },
      //fertilizer management
      {
        path: "manage-fertilizers",
        element: <FertilizerManagementDashboard />,
      },
    ],
  },
]);
