import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import "./DriverDashboard.css"; // import the CSS file

const DriverDashboard = () => {
  const [user, setUser] = useState(null);
  const [driverData, setDriverData] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [incidentLocations, setIncidentLocations] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/login");
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchDriverDetails(parsedUser._id || parsedUser.id, token);
    }
  }, [navigate]);

  const fetchDriverDetails = async (userId, token) => {
    try {
      const res = await fetch("http://localhost:5000/api/drivers/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(`Error: ${data.message}`);
        return;
      }

      const drivers = await res.json();
      const driver = drivers.find((d) => d.user_id._id === userId);
      if (driver) {
        setDriverData(driver);
        fetchIncidents(driver.assigned_ambulance, token);
      }
    } catch (err) {
      console.error("Failed to fetch driver data:", err);
      alert("Error fetching driver data.");
    }
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lon}&lon=${lat}&format=json`
      );
      if (!res.ok) throw new Error("Geocoding failed");
      const data = await res.json();
      return data.display_name || "Unknown Location";
    } catch (err) {
      console.error("Geocoding error:", err);
      return "Unknown Location";
    }
  };

  const fetchIncidents = async (ambulanceId, token) => {
    try {
      const res = await fetch("http://localhost:5000/api/incidents/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(`Error: ${data.message}`);
        return;
      }

      const { incidents: allIncidents = [] } = await res.json();
      const filtered = allIncidents.filter(
        (incident) => incident.ambulance?._id === ambulanceId
      );

      const locationMap = {};
      for (const incident of filtered) {
        const [lon, lat] = incident.location.coordinates;
        const address = await reverseGeocode(lat, lon);
        locationMap[incident._id] = address;
      }

      setIncidentLocations(locationMap);
      setIncidents(filtered);
    } catch (err) {
      console.error("Failed to fetch incidents:", err);
      alert("Error fetching incidents.");
    }
  };

  const updateIncidentStatus = async (incidentId, status) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/incidents/${incidentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(`Failed to update: ${data.message}`);
        return;
      }

      const updatedIncident = await res.json();
      setIncidents((prev) =>
        prev.map((incident) =>
          incident._id === updatedIncident._id ? updatedIncident : incident
        )
      );
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Could not update status.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <NavBar />
      <div className="p-6 max-w-4xl mx-auto mt-8 bg-white border rounded shadow">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Assigned Incidents</h3>
          {incidents.length === 0 ? (
            <p>We are Loading Incidents Hang on ...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="driverdsh_table">
                <thead className="driverdsh_table_head">
                  <tr>
                    <th className="driverdsh_th">Reported By</th>
                    <th className="driverdsh_th">Phone</th>
                    <th className="driverdsh_th">Ambulance</th>
                    <th className="driverdsh_th">Priority</th>
                    <th className="driverdsh_th">Status</th>
                    <th className="driverdsh_th">Location</th>
                    <th className="driverdsh_th">Reported Time</th>
                    <th className="driverdsh_th">Actions</th>
                  </tr>
                </thead>
                <tbody className="driverdsh_table_body">
                  {incidents.map((incident) => (
                    <tr key={incident._id} className="driverdsh_row">
                      <td className="driverdsh_td">{incident.user?.name || "Unknown"}</td>
                      <td className="driverdsh_td">{incident.phone}</td>
                      <td className="driverdsh_td">
                        {incident.ambulance?.license_plate} — {incident.ambulance?.hospital_name}
                      </td>
                      <td className="driverdsh_td">{incident.priority}</td>
                      <td className="driverdsh_td">{incident.status}</td>
                      <td className="driverdsh_td">
                        {incidentLocations[incident._id] || "Loading location..."}
                      </td>
                      <td className="driverdsh_td">
                        {new Date(incident.reported_time).toLocaleString()}
                      </td>

                      <td className="driverdsh_td">
                            <button
                              onClick={() => updateIncidentStatus(incident._id, "En Route to Scene")}
                              className="status-btn"
                            >
                              En Route to Scene
                            </button>
                            <button
                              onClick={() => updateIncidentStatus(incident._id, "On Scene")}
                              className="status-btn"
                            >
                              On Scene
                            </button>
                            <button
                              onClick={() => updateIncidentStatus(incident._id, "Transporting to Facility")}
                              className="status-btn"
                            >
                              Transporting to Facility
                            </button>
                            <button
                              onClick={() => updateIncidentStatus(incident._id, "Completed - Returned to Base")}
                              className="status-btn"
                            >
                              Returned to Base
                            </button>
                          </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <br /> <br />
      <Footer />
    </>
  );
};

export default DriverDashboard;
