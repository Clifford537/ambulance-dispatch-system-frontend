import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css"; // Import CSS file
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
  
      const data = await response.json();
      console.log(data); // Check the response body

      if (response.ok) {
 // Show success message from server
  
        // Store token and user information in localStorage
        localStorage.setItem("token", data.token); // Store token for authentication
        localStorage.setItem("user", JSON.stringify(data.user)); // Store user info
        
        // Check the user role
        const role = data.user.role;
        console.log("User role:", role); // Log the role to ensure it's correct
        
        // Redirect user based on role
        switch (role) {
          case "admin":
            navigate("/admin");
            break;
          case "dispatcher":
            navigate("/dispatcher");
            break;
          case "driver":
            navigate("/driver");
            break;
          default:
            navigate("/userdash");
        }
      } else {
        alert(`Error: ${data.message}`); // Show error message
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong! Please try again.");
    }
  };


  return (
    <>
    <NavBar/>
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        {/* Email Input */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="login-input"
          value={user.email}
          onChange={handleChange}
          required
        />

        {/* Password Input */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="login-input"
          value={user.password}
          onChange={handleChange}
          required
        />

        {/* Login Button */}
        <button type="submit" className="login-button">
          Login
        </button>
      </form>

      <div >
        {/* Forgot Password Link */}
      <button  className="login-button" ><Link to="/auth/forgot-password">Forgot Password?</Link> </button>   
    <button  className="login-button" ><Link to="/auth/register">Don't have an account? Register</Link></button>   
    
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Login;
