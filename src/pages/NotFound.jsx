import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
      <p className="text-lg mt-2">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md">Go Home</Link>
    </div>
  );
};

export default NotFound;
