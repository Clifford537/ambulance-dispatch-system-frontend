import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AuthService from "./AuthServices";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying email...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setMessage("Invalid verification link.");
      return;
    }

    // Call backend to verify the email
    AuthService.verifyEmail(token)
      .then(() => {
        setMessage("Email verified successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      })
      .catch((error) => {
        setMessage(error.message || "Verification failed. Try again.");
      });
  }, [searchParams, navigate]);

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;
