import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/DriverForm.css";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

const DriverForm = () => {
  const [users, setUsers] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [formData, setFormData] = useState({
    user_id: "",
    license_number: "",
    assigned_ambulance: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth/login");

    const fetchUsersAndAmbulances = async () => {
      try {
        const [userRes, ambulanceRes] = await Promise.all([
          fetch("http://localhost:5000/api/users/", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:5000/api/ambulances/", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (!userRes.ok || !ambulanceRes.ok) {
          throw new Error("Failed to fetch users or ambulances");
        }

        const userData = await userRes.json();
        const ambulanceData = await ambulanceRes.json();

        setUsers(userData.filter((u) => u.role === "user"));
        setAmbulances(ambulanceData.ambulances || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsersAndAmbulances();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/drivers/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Driver created successfully");
        navigate("/admin");
      } else {
        alert(data.message || "Error creating driver");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <>
      <NavBar />
      <div className="driverform_container">
        <h1 className="driverform_title">Create Driver</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit} className="driverform_form">
          <label>
            Select User:
            <select name="user_id" value={formData.user_id} onChange={handleChange} required>
              <option value="">-- Choose a user --</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </label>

          <label>
            License Number:
            <input
              type="text"
              name="license_number"
              value={formData.license_number}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Assigned Ambulance:
            <select
              name="assigned_ambulance"
              value={formData.assigned_ambulance}
              onChange={handleChange}
            >
              <option value="">-- None --</option>
              {ambulances.map((ambulance) => (
                <option key={ambulance._id} value={ambulance._id}>
                  {ambulance.license_plate} ({ambulance.status})
                </option>
              ))}
            </select>
          </label>

          <button type="submit" className="driverform_btn">
            Create Driver
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default DriverForm;
