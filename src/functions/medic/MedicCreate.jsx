import React, { useState } from "react";
import "../styles/MedicForm.css";

const MedicForm = ({ onSubmit }) => {
  const [medic, setMedic] = useState({
    specialty: "",
    assignedAmbulance: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setMedic({ ...medic, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!medic.specialty) {
      setError("Specialty field is required");
      return;
    }

    setError("");

    try {
      const response = await fetch("/api/medics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(medic),
      });

      if (!response.ok) throw new Error("Failed to register medic");

      const data = await response.json();
      alert("Medic registered successfully!");
      onSubmit(data);
    } catch (error) {
      console.error("Error registering medic:", error);
      setError("Failed to register medic.");
    }
  };

  return (
    <div className="medic-form-container">
      <h2 className="medic-form-title">Register a Medic</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Specialty:</label>
          <input
            type="text"
            name="specialty"
            value={medic.specialty}
            onChange={handleChange}
            required
            className="medic-form-input"
          />
        </div>

        <div>
          <label>Assigned Ambulance (ID):</label>
          <input
            type="number"
            name="assignedAmbulance"
            value={medic.assignedAmbulance}
            onChange={handleChange}
            className="medic-form-input"
          />
        </div>

        <button type="submit" className="medic-form-button">
          Register Medic
        </button>
      </form>
    </div>
  );
};

export default MedicForm;
