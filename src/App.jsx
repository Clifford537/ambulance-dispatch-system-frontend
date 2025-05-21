import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import Homepage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ForgotPassword from "./auth/ForgotPassword";
import VerifyEmail from "./auth/VerifyEmail";
import ResetPassword from "./auth/ResetPassword";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import DispatcherDashboard from "./pages/dashboard/DispatcherDashboard";
import DriverDashboard from "./pages/dashboard/DriverDashboard";

import AmbulanceForm from "./functions/ambulances/CreateAmbulance";
import ManageAmbulance from "./functions/ambulances/ManageAmbulance";
import ManageDrivers from "./functions/driver/DriverManage";
import DriverForm from "./functions/driver/DriverCreate";
import UserDashboard from "./pages/dashboard/UserDashboard";

import ManageUsers from "./functions/users/ManageUsers";





const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
            
          <Route path="/" element={<Homepage />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protect everything else */}
          <Route element={<PrivateRoute />}>
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="manageusers"  element={<ManageUsers/>} />
    
          

            {/* Role-Based Protected Routes */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/ambulance-form" element={<AmbulanceForm />} />
              <Route path="/manageambulance"  element={<ManageAmbulance/>} />
              <Route path="/createdriver"   element={<DriverForm/>} />
              <Route path="/managedrivers"  element={<ManageDrivers/>}/>
            </Route>

            <Route element={<PrivateRoute allowedRoles={["dispatcher"]} />}>
              <Route path="/dispatcher" element={<DispatcherDashboard />} />
            </Route>

            <Route element={<PrivateRoute allowedRoles={["driver"]} />}>
              <Route path="/driver" element={<DriverDashboard />} />
            </Route>

            <Route element={<PrivateRoute allowedRoles={["user"]} />}>
              <Route path="/userdash" element={<UserDashboard />} />
            </Route>
          </Route>

          {/* Unauthorized & Not Found Routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
