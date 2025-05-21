import React from "react";
import "../styles/UserProfile.css";

const UserProfileCard = ({ user }) => {
  if (!user) return <p>No user data available.</p>;

  return (
    <div className="profile-card">
      <h2>{user.name}</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Primary Phone:</strong> {user.phone}</p>
      {user.altPhone && <p><strong>Alternative Phone:</strong> {user.altPhone}</p>}
      <p><strong>Date of Birth:</strong> {user.dateOfBirth}</p>
      <p><strong>Location:</strong> {user.location}</p>
    </div>
  );
};

export default UserProfileCard;
