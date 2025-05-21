import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar"

const HomePage = () => {
  return (
    <div style={styles.container}>
      
      <NavBar/>
      <main style={styles.mainContent}>
        <div style={styles.header}>
          <h1 style={styles.heading}>Welcome to Ambulance Dispatch System</h1>
          <p style={styles.tagline}>
            Quick, reliable, and efficient ambulance dispatch service
          </p>
          <div style={styles.buttonContainer}>
            <Link to="/userdash">
              <button style={styles.mainButton}>Report an Incident</button>
            </Link>
            <Link to="/auth/register">
              <button style={styles.mainButton}>Create an account</button>
            </Link>
          </div>
        </div>

        <section style={styles.informationSection}>
          <h2 style={styles.sectionHeading}>How It Works</h2>
          <p style={styles.sectionContent}>
            Our platform connects patients with emergency services efficiently.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f4f9",
    color: "#333",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column"
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  heading: {
    fontSize: "3rem",
    color: "#007bff",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  tagline: {
    fontSize: "1.2rem",
    color: "#555",
    marginBottom: "20px",
  },
  buttonContainer: {
    display: "flex",
    gap: "20px",
    justifyContent: "center"
  },
  mainButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  informationSection: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "800px",
    width: "100%",
    textAlign: "center",
    marginTop: "2rem",
  },
  sectionHeading: {
    fontSize: "2rem",
    color: "#007bff",
    marginBottom: "20px",
  },
  sectionContent: {
    fontSize: "1.1rem",
    color: "#555",
    lineHeight: "1.6",
  }
};

export default HomePage;
