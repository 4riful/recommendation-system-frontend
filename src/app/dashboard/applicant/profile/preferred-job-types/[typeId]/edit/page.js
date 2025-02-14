"use client";

import React, { useState, useEffect } from "react";
import { 
  FaSave, 
  FaArrowLeft, 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaBriefcase 
} from "react-icons/fa";
import { useRouter, useParams } from "next/navigation";

export default function EditPreferredJobType() {
  const router = useRouter();
  const { typeId } = useParams(); // Make sure your folder is named [typeId]

  const [jobType, setJobType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!typeId) {
      setError("No preferred job type ID provided");
      setLoading(false);
      return;
    }

    const fetchJobType = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/preferred-job-types/${typeId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch preferred job type");
        }
        const data = await res.json();
        setJobType(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobType();
  }, [typeId, token]);

  const handleChange = (e) => {
    setJobType({
      ...jobType,
      preferred_job_type: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/preferred-job-types/${typeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            preferred_job_type: jobType.preferred_job_type,
          }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to update preferred job type");
      }
      setSuccessMessage("Preferred job type updated successfully!");
      setTimeout(() => {
        router.push("/dashboard/applicant/profile/preferred-job-types");
      }, 2000);
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
      {/* Back Button */}
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
        Edit Preferred Job Type
      </h1>

      {error && (
        <div className="flex items-center justify-center gap-2 text-red-500 bg-[#ff6e6e] p-3 rounded-md mb-4 text-center text-sm">
          <FaExclamationCircle className="text-lg" />
          {error}
        </div>
      )}

      {successMessage && (
        <div className="flex items-center justify-center gap-2 text-green-500 bg-[#50fa7b] p-3 rounded-md mb-4 text-center text-sm">
          <FaCheckCircle className="text-lg" />
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-[#44475a] p-6 rounded-lg shadow-md space-y-6">
        <div className="flex flex-col">
          <label htmlFor="preferred_job_type" className="block text-sm font-medium mb-2">
            Preferred Job Type
          </label>
          <select
            id="preferred_job_type"
            name="preferred_job_type"
            value={jobType?.preferred_job_type || ""}
            onChange={handleChange}
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
          {loading ? "Saving..." : <><FaSave className="text-lg" /> Save Changes</>}
        </button>
      </form>
    </div>
  );
}
