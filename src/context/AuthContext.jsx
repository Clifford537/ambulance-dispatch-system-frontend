// src/context/AuthContext.js
import React, { createContext, useState, useContext } from "react";

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Keep track of the logged-in user

  // Login function
  const login = (userData) => {
    setUser(userData); // Save user data
    localStorage.setItem("user", JSON.stringify(userData)); // Save to localStorage
  };

  // Logout function
  const logout = () => {
    setUser(null); // Clear user data
    localStorage.removeItem("user"); // Remove from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
