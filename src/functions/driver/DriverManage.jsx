import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/ManageDrivers.css"; // Create this if needed
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

const ManageDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [editDriver, setEditDriver] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth/login");

    const fetchDrivers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/drivers/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch drivers");

        const data = await res.json();
        setDrivers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchAmbulances = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/ambulances/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch ambulances");

        const data = await res.json();
        setAmbulances(data.ambulances);  // Ensure this is an array of ambulance objects
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDrivers();
    fetchAmbulances();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/drivers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setDrivers((prev) => prev.filter((driver) => driver._id !== id));
        alert("Driver deleted successfully");
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditDriver((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/drivers/${editDriver._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          license_number: editDriver.license_number,
          assigned_ambulance: editDriver.assigned_ambulance || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setDrivers((prev) =>
          prev.map((d) => (d._id === editDriver._id ? { ...d, ...editDriver } : d))
        );
        setEditDriver(null);
        alert("Driver updated successfully");
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  // Function to get the ambulance license plate by ID from the fetched ambulances
  const getAmbulanceLicensePlate = (ambulanceId) => {
    if (!ambulances || !Array.isArray(ambulances)) return "Unknown";
    const ambulance = ambulances.find((a) => a._id === ambulanceId);
    return ambulance ? ambulance.license_plate : "Unknown";  // Using 'license_plate' from the ambulance data
  };

  return (
    <>
      <NavBar />
      <div className="managedriver_container">
        <h1 className="managedriver_title">Manage Drivers</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button
          className="managedriver_btn managedriver_btn-primary"
          onClick={() => navigate("/createdriver")}
        >
          + Add Driver
        </button>

        <table className="managedriver_table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>License Number</th>
              <th>Assigned Ambulance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver._id}>
                <td>{driver.user_id?.name}</td>
                <td>{driver.user_id?.email}</td>
                <td>{driver.user_id?.phone_number_1}</td>
                <td>{driver.license_number}</td>
                <td>{getAmbulanceLicensePlate(driver.assigned_ambulance)}</td>  {/* Display ambulance license plate */}
                <td>
                  <button
                    className="managedriver_btn managedriver_btn-sm"
                    onClick={() => setEditDriver(driver)}
                  >
                    Edit
                  </button>
                  <button
                    className="managedriver_btn managedriver_btn-sm managedriver_btn-danger"
                    onClick={() => handleDelete(driver._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal for Editing */}
        {editDriver && (
          <div className="managedriver_modal-overlay">
            <div className="managedriver_modal">
              <h2>Edit Driver</h2>
              <label>
                License Number:
                <input
                  name="license_number"
                  value={editDriver.license_number}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Assigned Ambulance ID:
                <input
                  name="assigned_ambulance"
                  value={editDriver.assigned_ambulance || ""}
                  onChange={handleEditChange}
                />
              </label>
              <div className="managedriver_modal-footer">
                <button className="managedriver_btn managedriver_btn-primary" onClick={handleEditSubmit}>
                  Save
                </button>
                <button className="managedriver_btn" onClick={() => setEditDriver(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ManageDrivers;
