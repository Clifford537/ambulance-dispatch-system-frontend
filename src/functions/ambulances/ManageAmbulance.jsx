import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "../../styles/ManageAmbulance.css"; 
import NavBar from "../../components/NavBar"
import Footer from "../../components/Footer"

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const ManageAmbulance = () => {
  const navigate = useNavigate();
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editAmbulance, setEditAmbulance] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth/login");

    const fetchAmbulances = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/ambulances/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch ambulances");
        const data = await res.json();
        setAmbulances(data.ambulances);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAmbulances();
  }, [navigate]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this ambulance?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/api/ambulances/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert("Ambulance deleted successfully");
        setAmbulances((prev) => prev.filter((amb) => amb._id !== id));
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditAmbulance((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/ambulances/${editAmbulance._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(editAmbulance),
    });

    const data = await res.json();

    if (res.ok) {
      setAmbulances((prev) =>
        prev.map((amb) => (amb._id === editAmbulance._id ? editAmbulance : amb))
      );
      setEditAmbulance(null);
      alert("Ambulance updated successfully");
    } else {
      console.log("Error response from backend:", data);
      alert(data.message || "Update failed");
    }
  } catch (err) {
    console.error("Update error:", err);
  }
};


  if (loading) return <p>Loading ambulances...</p>;
  if (error) return <p className="manage_text-error">{error}</p>;

  return (
    <>

    <div className="manage_container">
      <div className="manage_header">
        <h1 className="manage_title"> Manage Ambulances</h1>
        <p>Click on the map pointer to edit or delete an ambulance</p>
        <div className="manage_btn-group">
          <button className="manage_btn manage_btn-primary" onClick={() => navigate("/ambulance-form")}>
            + Add Ambulance
          </button>
        </div>
      </div>

      <div className="manage_map-container">
        <MapContainer center={[1.2921, 36.8219]} zoom={7} style={{ height: "600px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {ambulances.map((ambulance) => (
            <Marker
              key={ambulance._id}
              position={[ambulance.location.coordinates[1], ambulance.location.coordinates[0]]}
              icon={customIcon}
            >
              <Popup>
                <p><strong>License Plate:</strong> {ambulance.license_plate}</p>
                <p><strong>Status:</strong> {ambulance.status}</p>
                <p><strong>Hospital:</strong> {ambulance.hospital_name}</p>
                <div className="manage_popup-actions">
                  <button
                    className="manage_btn manage_btn-sm"
                    onClick={() => setEditAmbulance(ambulance)}
                  >
                    Edit
                  </button>
                  <button
                    className="manage_btn manage_btn-sm manage_btn-danger"
                    onClick={() => handleDelete(ambulance._id)}
                  > 
                    Delete
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
       
      {editAmbulance && (
  <div className="manage_modal-overlay">
    <div className="manage_modal">
      <h2 className="manage_modal-header">Edit Ambulance</h2>
      <div className="manage_modal-body">
        <label>
          License Plate:
          <input
            name="license_plate"
            value={editAmbulance.license_plate || ""}
            onChange={handleEditChange}
          />
        </label>
        <label>
          Status:
          <input
            name="status"
            value={editAmbulance.status || ""}
            onChange={handleEditChange}
          />
        </label>
        <label>
          Hospital Name:
          <input
            name="hospital_name"
            value={editAmbulance.hospital_name || ""}
            onChange={handleEditChange}
          />
        </label>
      </div>
      <div className="manage_modal-footer">
        <button className="manage_btn manage_btn-primary" onClick={handleEditSubmit}>
          Save
        </button>
        <button className="manage_btn" onClick={() => setEditAmbulance(null)}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


    </div>

    </>
  );
};

export default ManageAmbulance;
