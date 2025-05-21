import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [medics, setMedics] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch users, drivers, medics, ambulances, and incidents from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/auth/login");
          return;
        }

        // Fetch users
        const usersResponse = await fetch("http://localhost:5000/api/users/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const usersData = await usersResponse.json();
        setUsers(usersData);

        // Fetch drivers
        const driversResponse = await fetch("http://localhost:5000/api/drivers", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const driversData = await driversResponse.json();
        setDrivers(driversData);

        // Fetch medics
        const medicsResponse = await fetch("http://localhost:5000/api/medics", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const medicsData = await medicsResponse.json();
        setMedics(medicsData);

        // Fetch ambulances
        const ambulancesResponse = await fetch("http://localhost:5000/api/ambulances", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const ambulancesData = await ambulancesResponse.json();
        setAmbulances(ambulancesData.ambulances);

        // Fetch incidents
        const incidentsResponse = await fetch("http://localhost:5000/api/incidents/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const incidentsData = await incidentsResponse.json();
        setIncidents(incidentsData); // Set incidents data

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("user"); 
    navigate("/auth/login"); 
  };

  return (
    <div style={styles.container}>
      <h1>Admin Dashboard</h1>

      {/* Display Loading Indicator */}
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          {/* Display Users Table */}
          <h2>Users</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number 1</th>
                <th>Phone Number 2</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone_number_1}</td>
                  <td>{user.phone_number_2}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Display Drivers Table */}
          <h2>Drivers</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Driver Name</th>
                <th>Driver Email</th>
                <th>License Number</th>
                <th>Assigned Ambulance</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver._id}>
                  <td>{driver.user.name}</td>
                  <td>{driver.user.email}</td>
                  <td>{driver.license_number}</td>
                  <td>{driver.assigned_ambulance}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Display Medics Table */}
          <h2>Medics</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Medic Name</th>
                <th>Medic Email</th>
                <th>Phone Number</th>
                <th>Specialty</th>
                <th>Assigned Ambulance</th>
              </tr>
            </thead>
            <tbody>
              {medics.map((medic) => (
                <tr key={medic._id}>
                  <td>{medic.user.name}</td>
                  <td>{medic.user.email}</td>
                  <td>{medic.phone}</td>
                  <td>{medic.specialty}</td>
                  <td>{medic.assigned_ambulance ? medic.assigned_ambulance : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Display Ambulances Table */}
          <h2>Ambulances</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>License Plate</th>
                <th>Status</th>
                <th>Hospital Name</th>
                <th>Location (Latitude, Longitude)</th>
              </tr>
            </thead>
            <tbody>
              {ambulances.map((ambulance) => (
                <tr key={ambulance._id}>
                  <td>{ambulance.license_plate}</td>
                  <td>{ambulance.status}</td>
                  <td>{ambulance.hospital_name}</td>
                  <td>{ambulance.location.coordinates[1]}, {ambulance.location.coordinates[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Display Incidents Table */}
          <h2>Incidents</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Incident Type</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Reported Time</th>
                <th>User Name</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr key={incident._id}>
                  <td>{incident.incident_type}</td>
                  <td>{incident.priority}</td>
                  <td>{incident.status}</td>
                  <td>{new Date(incident.reported_time).toLocaleString()}</td>
                  <td>{incident.user.name}</td>
                  <td>{incident.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Logout Button */}
          <button onClick={handleLogout} style={styles.logoutButton}>Logout</button> <br />
          <button style={styles.logoutButton} onClick={() => navigate("/ambulance-form")}>Create Ambulance</button>
          
        </>
      )}
    </div>
  );
};

// Styles
const styles = {
  container: {
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "2rem",
  },
  tableCell: {
    padding: "10px",
    border: "1px solid #ddd",
  },
  tableHeader: {
    padding: "10px",
    border: "1px solid #ddd",
    backgroundColor: "#f4f4f4",
  },
  logoutButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "2rem",
    fontSize: "1rem",
    transition: "background-color 0.3s",
  },
};

export default AdminDashboard;
