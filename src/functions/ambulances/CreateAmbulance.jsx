import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../../styles/AmbulanceForm.css"; // Importing CSS for Ambulance Form

// Fix Leaflet marker issue
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationPicker = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect([lat, lng]); // Update parent component with selected coordinates
    },
  });
  return null;
};

const AmbulanceForm = ({ onSubmit }) => {
  const [ambulance, setAmbulance] = useState({
    licensePlate: "",
    status: "available", // Default status
    hospitalName: "",
    location: { coordinates: [1.2921, 36.8219] }, // Default to Kenya's center (Nairobi)
  });

  const [error, setError] = useState("");

  // Handle input change (excluding location)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAmbulance((prev) => ({ ...prev, [name]: value }));
  };

  // Handle location selection from map
  const handleLocationSelect = (coords) => {
    setAmbulance((prev) => ({
      ...prev,
      location: { coordinates: coords },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { licensePlate, status, hospitalName, location } = ambulance;

    // Validate required fields
    if (!licensePlate || !status || !hospitalName || !location.coordinates.length) {
      setError("All fields are required.");
      return;
    }

    setError(""); // Reset error

    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized: No token found. Please log in again.");
      return;
    }

    // Prepare payload
    const payload = {
      license_plate: licensePlate,
      status,
      hospital_name: hospitalName,
      location,
    };

    try {
      const response = await fetch("http://localhost:5000/api/ambulances/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to register ambulance.");
      }

      alert("Ambulance registered successfully!");
      onSubmit(); // Notify parent component
    } catch (error) {
      setError(error.message || "Failed to register ambulance.");
    }
  };

  return (
    <div className="ambulance-form-container">
      <h2 className="ambulance-form-title">Register an Ambulance</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>License Plate:</label>
          <input
            type="text"
            name="licensePlate"
            value={ambulance.licensePlate}
            onChange={handleChange}
            required
            className="ambulance-form-input"
          />
        </div>

        <div>
          <label>Status:</label>
          <select
            name="status"
            value={ambulance.status}
            onChange={handleChange}
            required
            className="ambulance-form-input"
          >
            <option value="available">Available</option>
            <option value="on-duty">On Duty</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <div>
          <label>Hospital Name:</label>
          <input
            type="text"
            name="hospitalName"
            value={ambulance.hospitalName}
            onChange={handleChange}
            required
            className="ambulance-form-input"
          />
        </div>

        {/* Map Section for Selecting Location */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Select Location on Map</h3>
          <MapContainer
            center={[1.2921, 36.8219]} // Center the map on Kenya (Nairobi)
            zoom={7}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker onLocationSelect={handleLocationSelect} />
            <Marker position={ambulance.location.coordinates} icon={customIcon} />
          </MapContainer>
          <p><strong>Selected Coordinates:</strong> {ambulance.location.coordinates.join(", ")}</p>
        </div>

        <button type="submit" className="ambulance-form-button">
          Register Ambulance
        </button>
      </form>
    </div>
  );
};

export default AmbulanceForm;
