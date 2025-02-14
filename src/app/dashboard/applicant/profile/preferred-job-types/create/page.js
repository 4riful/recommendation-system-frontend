"use client";

import React, { useState } from "react";
import { FaSave, FaArrowLeft, FaBriefcase } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function CreatePreferredJobType() {
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const applicantProfileId =
    typeof window !== "undefined" ? localStorage.getItem("applicantProfileId") : null;

  const [preferredJobType, setPreferredJobType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/preferred-job-types/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          applicantProfileId,
          preferred_job_type: preferredJobType,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create preferred job type");
      }
      setSuccessMessage("Preferred job type created successfully!");
      setTimeout(() => {
        router.push("/dashboard/applicant/profile/preferred-job-types");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#283046] text-[#f8f8f2] p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push("/dashboard/applicant/profile/preferred-job-types")}
          className="flex items-center gap-2 text-sm text-[#50fa7b] hover:text-[#00d177] transition-all duration-200"
        >
          <FaArrowLeft className="text-lg" />
          Back to Preferred Job Types
        </button>
      </div>
      <h1 className="text-2xl font-semibold text-center mb-6 text-[#f1fa8c]">
        Create Preferred Job Type
      </h1>
      {error && (
        <div className="text-center text-sm text-red-500 mb-4">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="text-center text-sm text-green-500 mb-4">
          {successMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-[#44475a] p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label htmlFor="preferred_job_type" className="block text-sm font-medium mb-2">
            Preferred Job Type
          </label>
          <select
            id="preferred_job_type"
            name="preferred_job_type"
            value={preferredJobType}
            onChange={(e) => setPreferredJobType(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-[#f8f8f2] border border-[#44475a] focus:outline-none focus:ring-2 focus:ring-[#50fa7b] transition-all duration-200"
          >
            <option value="">Select Job Type</option>
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#50fa7b] text-[#282a36] py-2 rounded-full text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#00d177] transition-all duration-200"
        >
          {loading ? "Saving..." : <><FaSave className="text-lg" /> Save Preferred Job Type</>}
        </button>
      </form>
    </div>
  );
}
