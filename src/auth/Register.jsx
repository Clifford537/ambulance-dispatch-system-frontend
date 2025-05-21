import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css"; // Import CSS file
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

const Register = () => {
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    phone_number_1: "",
    phone_number_2: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        navigate("/auth/login"); // Redirect to login
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong! Please try again.");
    }
  };
  
  return (
    <>
    <NavBar/>
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="register-input"
          value={user.name}
          onChange={handleChange}
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="register-input"
          value={user.email}
          onChange={handleChange}
          required
        />

        {/* Primary Phone Number */}
        <input
          type="text"
          name="phone_number_1"
          placeholder="Primary Phone Number"
          className="register-input"
          value={user.phone_number_1}
          onChange={handleChange}
          required
        />

        {/* Alternative Phone Number */}
        <input
          type="text"
          name="phone_number_2"
          placeholder="Alternative Phone Number"
          className="register-input"
          value={user.phone_number_2}
          onChange={handleChange}
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="register-input"
          value={user.password}
          onChange={handleChange}
          required
        />

        {/* Register Button */}
        <button type="submit" className="register-button">
          Register
        </button>
      </form>

      <a href="/auth/login" className="register-link">
        Already have an account? Login
      </a>
    </div>
    <Footer/>
    </>
  );
};

export default Register;
