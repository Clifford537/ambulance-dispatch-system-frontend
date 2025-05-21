import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove user and token from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Optionally, redirect to the login page
    navigate("/login");
  }, [navigate]);

  return (
    <div>
      <h1>Logging out...</h1>
    </div>
  );
};

export default Logout;
