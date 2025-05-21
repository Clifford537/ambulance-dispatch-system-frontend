import React, { useState } from "react";

const AuthForm = ({ type, onSubmit }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  if (type === "register") {
    formData.name = "";
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{type === "login" ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
        {type === "register" && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 mb-2 border rounded"
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 mb-2 border rounded"
        />
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
              {type === "login" ? "Login" : "Register"}
            </button>
          </form>
            </div>
          );
        };
        
        export default AuthForm;
