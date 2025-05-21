import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../../styles/incidents_styles.css";
import NavBar from "../../components/NavBar";

const UserDashboard = () => {
  const [incidents, setIncidents] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ incident_type: "", priority: 1 });
  const [showTable, setShowTable] = useState(true); // Track table visibility
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchIncidents();
    fetchAmbulances();
  }, []);

  const fetchIncidents = async () => {
    const res = await fetch("http://localhost:5000/api/incidents/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      setIncidents(data.incidents || []);
    } else {
      setIncidents([]);
    }
  };

  const fetchAmbulances = async () => {
    const res = await fetch("http://localhost:5000/api/ambulances", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAmbulances(data.ambulances || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAmbulance) return;

    const [lng, lat] = selectedAmbulance.location.coordinates;

    const payload = {
      incident_type: formData.incident_type,
      priority: formData.priority,
      ambulanceId: selectedAmbulance._id,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
    };

    const res = await fetch("http://localhost:5000/api/incidents/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setShowModal(false);
      setFormData({ incident_type: "", priority: 1 });
      fetchIncidents();
    }
  };

  // Default Leaflet marker
  const defaultIcon = new L.Icon.Default();

  return (
    <>
    <NavBar/>
    <div className="incidents_container">
      <h2 className="incidents_title"> Incidents</h2>

      {/* Toggle Button for Table */}
      <button
        className="toggle_button"
        onClick={() => setShowTable(!showTable)}
      >
        {showTable ? "Hide Incidents Table" : "Show Incidents Table"}
      </button>

      {/* Incidents Table */}
      {showTable && (
        <div className="incidents_table_wrapper">
          <table className="incidents_table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Phone</th>
                <th>Ambulance</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((inc) => (
                <tr key={inc._id}>
                  <td>{inc.incident_type}</td>
                  <td>{inc.status}</td>
                  <td>{inc.priority}</td>
                  <td>{inc.phone}</td>
                  <td>{inc.ambulance ? inc.ambulance.license_plate : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="incidents_map_title">Map View</h2>
      <MapContainer
  center={[1.2921, 36.8219]}
  zoom={7}
  className="incidents_map"
>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  {ambulances.map((amb) => (
    <Marker
      key={amb._id}
      position={[amb.location.coordinates[1], amb.location.coordinates[0]]}
      icon={defaultIcon}
    >
      <Popup>
        <div>
          <p><strong>Plate:</strong> {amb.license_plate}</p>
          <p><strong>Status:</strong> {amb.status}</p>
          <p><strong>Hospital:</strong> {amb.hospital_name}</p>
          <button
            className="incidents_form_button incidents_form_button--submit"
            onClick={() => {
              setSelectedAmbulance(amb);
              setShowModal(true);
            }}
          >
            Create Incident
          </button>
        </div>
      </Popup>
    </Marker>
  ))}
</MapContainer>


      {/* Modal for Incident Form */}
      {showModal && selectedAmbulance && (
        <div className="incidents_modal_overlay">
          <div className="incidents_modal_content">
            <h3>Create Incident for {selectedAmbulance.license_plate}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Incident Type"
                className="incidents_form_input"
                value={formData.incident_type}
                onChange={(e) => setFormData({ ...formData, incident_type: e.target.value })}
                required
              />
              <select
                className="incidents_form_select"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
              >
                <option value={1}>Low</option>
                <option value={2}>Medium</option>
                <option value={3}>High</option>
              </select>
              <div className="incidents_form_buttons">
                <button type="submit" className="incidents_form_button incidents_form_button--submit">
                  Submit
                </button>
                <button
                  type="button"
                  className="incidents_form_button incidents_form_button--cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default UserDashboard;
