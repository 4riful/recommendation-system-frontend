"use client";

import React, { useState, useEffect } from "react";
import { FaSave, FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaMapMarkerAlt } from "react-icons/fa";
import { useRouter, useParams } from "next/navigation";

export default function EditPreferredLocation() {
  const router = useRouter();
  const { locationId } = useParams();

  const [formData, setFormData] = useState({ location: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!locationId) return;
    const fetchLocation = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/preferred-locations/${locationId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch preferred location");
        }
        const data = await res.json();
        setFormData({ location: data.location || "" });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLocation();
  }, [locationId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/preferred-locations/${locationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to update preferred location");
      }
      setSuccessMessage("Preferred location updated successfully!");
      setTimeout(() => {
        router.push("/dashboard/applicant/profile/preferred-locations");
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-sm text-gray-400 mt-20">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#283046] text-[#f8f8f2] p-6">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <button
            onClick={() =>
              router.push("/dashboard/applicant/profile/preferred-locations")
            }
            className="flex items-center gap-2 text-sm text-[#50fa7b] hover:text-[#00d177] transition-all duration-200"
          >
            <FaArrowLeft className="text-lg" />
            Back to Preferred Locations
          </button>
        </div>
        <h1 className="text-2xl font-semibold text-center mb-6 text-[#f1fa8c]">
          Edit Preferred Location
        </h1>
        {error && (
          <div className="flex items-center justify-center gap-2 text-sm text-red-400 bg-[#ff6e6e] p-3 rounded-md mb-4">
            <FaExclamationTriangle className="text-lg" />
            {error}
          </div>
        )}
        {successMessage && (
          <div className="flex items-center justify-center gap-2 text-sm text-green-400 bg-[#50fa7b] p-3 rounded-md mb-4">
            <FaCheckCircle className="text-lg" />
            {successMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-[#44475a] p-6 rounded-md shadow-md space-y-6">
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-[#50fa7b] text-xl" />
            <label htmlFor="location" className="text-sm font-medium flex-grow">
              Preferred Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-[#f8f8f2] border border-[#44475a] focus:outline-none focus:ring-2 focus:ring-[#50fa7b] transition-all duration-200"
              placeholder="Enter location"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#50fa7b] text-[#282a36] py-2 rounded-full text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#00d177] transition-all duration-200"
          >
            {loading ? "Saving..." : <><FaSave className="text-lg" /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
}
