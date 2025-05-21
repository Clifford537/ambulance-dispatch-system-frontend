import React, { useState, useContext } from "react";
// import { UserContext } from "../context/UserContext";
import "../styles/UserProfile.css";

const EditProfile = ({ onCancel }) => {
  const { user, updateUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    altPhone: user.altPhone || "",
    dateOfBirth: user.dateOfBirth || "",
    location: user.location || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally send an API request to update the user.
    console.log("Updated profile:", formData);
    updateUser(formData);
    onCancel(); // Close edit mode after update
  };

  return (
    <form className="edit-profile-form" onSubmit={handleSubmit}>
      <h2>Edit Profile</h2>
      <label>Name:</label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} required />

      <label>Email:</label>
      <input type="email" name="email" value={formData.email} onChange={handleChange} required />

      <label>Primary Phone:</label>
      <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />

      <label>Alternative Phone:</label>
      <input type="text" name="altPhone" value={formData.altPhone} onChange={handleChange} />

      <label>Date of Birth:</label>
      <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />

      <label>Location:</label>
      <input type="text" name="location" value={formData.location} onChange={handleChange} />

      <div className="edit-buttons">
        <button type="submit" className="save-button">Save</button>
        <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default EditProfile;
