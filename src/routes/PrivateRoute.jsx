import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user")); // Get the user info from localStorage

  // If no user is found, redirect to login
  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  // If the user is not authorized, redirect to unauthorized page
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />; // If user is authorized, allow access to the nested route
};

export default PrivateRoute;
