import React, { useState } from "react";
import AuthService from "./AuthServices";

const ResetPassword = () => {
  const [email, setEmail] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await AuthService.resetPassword(email);
      alert("Password reset link sent to your email.");
    } catch (error) {
      console.error("Reset failed:", error.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={handleReset}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-2 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-yellow-500 text-white rounded">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
