import React from "react";
import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/Mainlayout.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Services from "../pages/Services.jsx";
import Booking from "../pages/Booking.jsx";
import Payment from "../pages/Payment.jsx";
import MyBooking from "../pages/Mybooking.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import AdminServices from "../pages/AdminServices.jsx";
import AdminUsers from "../pages/AdminUsers.jsx";
import AdminServiceForm from "../pages/AdminServiceForm.jsx";
import AdminServiceUpdate from "../pages/AdminServiceUpdate.jsx";
import AdminBookings from "../pages/AdminBookings.jsx";
import Profile from "../pages/Profile.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
         index: true, element: <Home /> 

      },
      { 
        path: "services", element: <Services /> 
    },
      {
        path: "booking/:serviceId", element: <Booking /> 
    },
      {
        path: "/payment/:bookingId",element: <Payment />,
      },
      {
        path: "my-booking", element: <MyBooking />
      },
      { path: "/admin/dashboard", element: <AdminDashboard /> },
      { path: "/admin/services", element: <AdminServices /> },
      { path: "/admin/services/create", element: <AdminServiceForm /> },
      { path: "/admin/services/edit/:serviceId", element: <AdminServiceUpdate /> },
      { path: "/admin/bookings", element: <AdminBookings /> },
      { path: "/admin/users", element: <AdminUsers /> },
      { path: "profile", element: <Profile /> }

    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;
