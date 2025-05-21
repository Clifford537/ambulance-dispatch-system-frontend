import React from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <>
      <style>
        {`
          /* AdminDashboard styles */
          .admin-dashboard-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background-color: #f4f4f9;
            min-height: 100vh;
          }

          .dashboard-title {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 20px;
            color: #333;
          }

          .button-container {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .dashboard-button {
            background-color: #007bff;
            color: white;
            padding: 12px 25px;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
            width: 200px;
            text-align: center;
          }

          .dashboard-button:hover {
            background-color: #0056b3;
          }

          .dashboard-button:focus {
            outline: none;
          }

          .link-text {
            text-decoration: none;
            color: white;
          }

          .link-text:hover {
            text-decoration: underline;
          }
        `}
      </style>

      <div className="admin-dashboard-container">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <div className="button-container">
          <button className="dashboard-button">
            <Link to="/manageambulance" className="link-text">Manage Ambulance</Link>
          </button>
          <button className="dashboard-button">
            <Link to="/managedrivers" className="link-text">Manage Drivers</Link>
          </button>
          <button className="dashboard-button">
            <Link to="/manageusers" className="link-text">Manage Users</Link>
          </button>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
