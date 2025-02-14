"use client";

import React, { useState, useEffect } from "react";
import {
  FaSave,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationCircle,
  FaGraduationCap,
  FaUniversity,
  FaBuilding,
  FaCalendarAlt,
  FaChartLine,
} from "react-icons/fa";
import { useRouter, useParams } from "next/navigation";

export default function EditQualification() {
  const router = useRouter();
  const { qualificationId } = useParams();

  const [qualification, setQualification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!qualificationId) return;

    const fetchQualification = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/academic-qualifications/${qualificationId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch qualification");
        }

        const data = await res.json();
        setQualification(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQualification();
  }, [qualificationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQualification((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Format the dates to YYYY-MM-DD
    const formattedStartDate = new Date(qualification.start_date)
      .toISOString()
      .split("T")[0];
    const formattedEndDate = new Date(qualification.end_date)
      .toISOString()
      .split("T")[0];

    const payload = {
      degree_type: qualification.degree_type,
      degree: qualification.degree,
      university: qualification.university,
      department: qualification.department,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      cgpa: qualification.cgpa,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/academic-qualifications/${qualificationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update academic qualification");
      }

      setSuccessMessage("Qualification updated successfully!");
      setTimeout(() => {
        router.push("/dashboard/applicant/profile/academic-qualifications");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !qualification) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Navigation Button */}
        <div className="mb-6">
          <button
            onClick={() =>
              router.push("/dashboard/applicant/profile/academic-qualifications")
            }
            className="flex items-center gap-2 text-sm text-[#50fa7b] hover:text-[#00d177] transition-colors duration-200"
          >
            <FaArrowLeft className="text-lg" />
            Back to Qualifications
          </button>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-8 text-[#f1fa8c]">
          Edit Academic Qualification
        </h1>

        {/* Alerts */}
        {error && (
          <div className="flex items-center gap-2 bg-red-600 text-white p-3 rounded-md mb-4">
            <FaExclamationCircle className="text-xl" />
            <span>{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="flex items-center gap-2 bg-green-600 text-white p-3 rounded-md mb-4">
            <FaCheckCircle className="text-xl" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-[#44475a] p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Degree Type */}
            <div>
              <label
                htmlFor="degree_type"
                className="flex items-center gap-2 text-sm font-medium mb-1"
              >
                <FaGraduationCap className="text-base" />
                Degree Type
              </label>
              <select
                id="degree_type"
                name="degree_type"
                value={qualification?.degree_type || ""}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-[#6272a4] text-[#f8f8f2] border border-[#44475a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#50fa7b] transition-colors duration-200"
              >
                <option value="">Select Degree Type</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Master">Master</option>
                <option value="PhD">PhD</option>
              </select>
            </div>

            {/* Degree */}
            <div>
              <label
                htmlFor="degree"
                className="flex items-center gap-2 text-sm font-medium mb-1"
              >
                <FaGraduationCap className="text-base" />
                Degree
              </label>
              <input
                type="text"
                id="degree"
                name="degree"
                value={qualification?.degree || ""}
                onChange={handleChange}
                required
                placeholder="Degree Name"
                className="w-full px-4 py-2 bg-[#6272a4] text-[#f8f8f2] border border-[#44475a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#50fa7b] transition-colors duration-200"
              />
            </div>

            {/* University */}
            <div>
              <label
                htmlFor="university"
                className="flex items-center gap-2 text-sm font-medium mb-1"
              >
                <FaUniversity className="text-base" />
                University
              </label>
              <input
                type="text"
                id="university"
                name="university"
                value={qualification?.university || ""}
                onChange={handleChange}
                required
                placeholder="University Name"
                className="w-full px-4 py-2 bg-[#6272a4] text-[#f8f8f2] border border-[#44475a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#50fa7b] transition-colors duration-200"
              />
            </div>

            {/* Department */}
            <div>
              <label
                htmlFor="department"
                className="flex items-center gap-2 text-sm font-medium mb-1"
              >
                <FaBuilding className="text-base" />
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={qualification?.department || ""}
                onChange={handleChange}
                required
                placeholder="Department"
                className="w-full px-4 py-2 bg-[#6272a4] text-[#f8f8f2] border border-[#44475a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#50fa7b] transition-colors duration-200"
              />
            </div>

            {/* Start Date */}
            <div>
              <label
                htmlFor="start_date"
                className="flex items-center gap-2 text-sm font-medium mb-1"
              >
                <FaCalendarAlt className="text-base" />
                Start Date
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={qualification?.start_date?.split("T")[0] || ""}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-[#6272a4] text-[#f8f8f2] border border-[#44475a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#50fa7b] transition-colors duration-200"
              />
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor="end_date"
                className="flex items-center gap-2 text-sm font-medium mb-1"
              >
                <FaCalendarAlt className="text-base" />
                End Date
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={qualification?.end_date?.split("T")[0] || ""}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-[#6272a4] text-[#f8f8f2] border border-[#44475a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#50fa7b] transition-colors duration-200"
              />
            </div>

            {/* CGPA */}
            <div>
              <label
                htmlFor="cgpa"
                className="flex items-center gap-2 text-sm font-medium mb-1"
              >
                <FaChartLine className="text-base" />
                CGPA
              </label>
              <input
                type="number"
                step="0.1"
                id="cgpa"
                name="cgpa"
                value={qualification?.cgpa || ""}
                onChange={handleChange}
                required
                placeholder="CGPA"
                className="w-full px-4 py-2 bg-[#6272a4] text-[#f8f8f2] border border-[#44475a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#50fa7b] transition-colors duration-200"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-[#50fa7b] text-[#282a36] py-2 px-6 rounded-full font-semibold hover:bg-[#00d177] transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <FaSave className="text-lg" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
