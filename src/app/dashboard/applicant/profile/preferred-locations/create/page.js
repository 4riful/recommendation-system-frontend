"use client";

import React, { useState } from "react";
import { FaSave, FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function CreatePreferredLocation() {
  const router = useRouter();
  const applicantProfileId =
    typeof window !== "undefined" ? localStorage.getItem("applicantProfileId") : "";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const [formData, setFormData] = useState({
    location: "",
    applicantProfileId: applicantProfileId,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/preferred-locations/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error("Failed to create preferred location");
      }
      setSuccessMessage("Preferred location created successfully!");
      setTimeout(() => {
        router.push("/dashboard/applicant/profile/preferred-locations");
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#283046] text-[#f8f8f2] p-6">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push("/dashboard/applicant/profile/preferred-locations")}
            className="flex items-center gap-2 text-sm text-[#50fa7b] hover:text-[#00d177] transition-all duration-200"
          >
            <FaArrowLeft className="text-lg" />
            Back to Preferred Locations
          </button>
        </div>
        <h1 className="text-2xl font-semibold text-center mb-6 text-[#f1fa8c]">
          Add Preferred Location
        </h1>
        {error && (
          <div className="text-center text-sm text-red-400 mb-4">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="text-center text-sm text-green-400 mb-4">
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
              placeholder="e.g., New York"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#50fa7b] text-[#282a36] py-2 rounded-full text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#00d177] transition-all duration-200"
          >
            {loading ? "Saving..." : <><FaSave className="text-lg" /> Save Location</>}
          </button>
        </form>
      </div>
    </div>
  );
}
