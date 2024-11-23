import React from "react";
import { Navigate } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "../../node_modules/bootstrap-icons/font/bootstrap-icons.css";

// ProtectedRoute component checks if the user is authenticated
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If no token exists, redirect to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, render the child component (protected route)
  return children;
};

export default ProtectedRoute;
