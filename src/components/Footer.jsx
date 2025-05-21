import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Ambulance Dispatch</h3>
          <p>Emergency medical services at your fingertips</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <Link to="/" className="footer-link">Home</Link>
          <Link to="/incident-report" className="footer-link">Report Incident</Link>
          <Link to="/dashboard" className="footer-link">Dashboard</Link>
        </div>
        <div className="footer-section">
          <h4>Legal</h4>
          <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
          <Link to="/terms" className="footer-link">Terms of Service</Link>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} Ambulance Dispatch System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
