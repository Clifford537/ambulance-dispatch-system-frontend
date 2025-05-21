import React from "react";
import AdminDashboard from "./dashboard/AdminDashboard";
import DispatcherDashboard from "./dashboard/DispatcherDashboard";
import UserDashboard from "./dashboard/UserDashboard";
import DriverDashboard from "./dashboard/DriverDashboard";
import { useAuth } from "@/context/AuthContext";

const DashboardLayout = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user.role) {
      case "admin":
        return <AdminDashboard />;
      case "dispatcher":
        return <DispatcherDashboard />;
      case "user":
        return <UserDashboard />;
      case "driver":
        return <DriverDashboard />;
      default:
        return <p>Unauthorized Access</p>;
    }
  };

  return <div className="p-4">{renderDashboard()}</div>;
};

export default DashboardLayout;
