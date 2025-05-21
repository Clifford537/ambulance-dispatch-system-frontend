import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/NavBar.css";
import { FaUserCircle } from "react-icons/fa";

const NavBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/auth/login");
  };

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Ambulance Dispatch
        </Link>

        <nav className="navbar-menu">
          {!isAuthenticated ? (
            <>
              <Link to="/" className="navbar-link">Home</Link>
              <Link to="/auth/register" className="navbar-link">Register</Link>
              <Link to="/auth/login" className="navbar-link">Login</Link>
            </>
          ) : (
            <>
              <div className="relative">
              <button
                      onClick={handleLogout}
                      className="logout-button"
                    >
                      Logout
                    </button>
               
                <button
                  className="navbar-icon-button"
                  onClick={toggleProfile}
                  aria-label="Profile"
                >
                  <FaUserCircle size={24} />
                </button>
                {showProfile && (
                  <div className="profile-dropdown">
                    <p><strong>Name:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Role:</strong> {user?.role}</p>
                    <button
                      onClick={handleLogout}
                      className="logout-button"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
