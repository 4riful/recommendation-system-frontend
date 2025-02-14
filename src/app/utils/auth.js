"use client";

import { jwtDecode } from "jwt-decode";    // Correct import for jwtDecode

// Store token in localStorage
export const setToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

// Retrieve token from localStorage
export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Decode token to get user role
export const getUserRole = () => {
  const token = getToken();
  if (token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.role; // Assuming the token contains a `role` field
    } catch (err) {
      console.error("Failed to decode token:", err);
    }
  }
  return null;
};

// Clear token and other data from localStorage (logout functionality)
export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("applicantProfileId");
    localStorage.removeItem("recruiterProfileId");
  }
};
