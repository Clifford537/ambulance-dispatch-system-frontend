import React, { useState } from "react"; // Importing React and useState hook for managing component state
import AuthService from "./AuthServices"; // Importing AuthService for handling authentication-related tasks
import { useNavigate } from "react-router-dom"; // Importing useNavigate for navigation after password reset
import "../styles/ForgotPassword.css"; // Importing CSS styles for the Forgot Password component

const ForgotPassword = () => {
  const [email, setEmail] = useState(""); // State to hold the email input

  const handleForgotPassword = async (e) => {
    e.preventDefault(); // Preventing default form submission behavior
    try {
      await AuthService.resetPassword(email); // Calling the resetPassword method from AuthService
      alert("Password reset link sent!"); // Alerting the user that the reset link has been sent
    } catch (error) {
      console.error("Error sending reset link:", error.message); // Logging any errors that occur
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Updating email state on input change
          required
          className="w-full p-2 mb-2 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-red-500 text-white rounded">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword; // Exporting the ForgotPassword component for use in other parts of the application
