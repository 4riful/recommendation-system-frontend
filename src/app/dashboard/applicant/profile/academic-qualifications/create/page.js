"use client";

import React, { useState } from "react";
import {
  FaSave,
  FaGraduationCap,
  FaUniversity,
  FaArrowLeft,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function CreateQualification() {
  const router = useRouter();

  // Simulating retrieval of applicantProfileId (replace with actual logic if needed)
  const applicantProfileId = localStorage.getItem("applicantProfileId");

  const [formData, setFormData] = useState({
    applicantProfileId: applicantProfileId || "",
    degree_type: "",
    degree: "",
    university: "",
    department: "",
    start_date: "",
    end_date: "",
    cgpa: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate CGPA input
    const cgpaAsFloat = parseFloat(formData.cgpa);
    if (isNaN(cgpaAsFloat)) {
      setError("Please enter a valid CGPA.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/academic-qualifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ...formData, cgpa: cgpaAsFloat }),
      });

      if (!res.ok) {
        throw new Error("Failed to create academic qualification");
      }

      setSuccessMessage("Qualification added successfully!");
      setTimeout(() => {
        router.push("/dashboard/applicant/profile/academic-qualifications");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="container mx-auto max-w-3xl">
        {/* Back Navigation */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="text-[#50fa7b] p-2 rounded-full hover:bg-[#3d7a5b] transition"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <h1 className="text-3xl font-bold ml-4 flex items-center gap-2">
            <FaGraduationCap /> Create Academic Qualification
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-md mb-4 flex items-center gap-2">
            <FaTimes className="text-xl" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-600 text-white p-4 rounded-md mb-4 flex items-center gap-2">
            <FaCheckCircle className="text-xl" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
          {/* Degree Type */}
          <div>
            <label htmlFor="degree_type" className="block text-sm font-semibold mb-2">
              Degree Type <FaGraduationCap className="inline text-[#50fa7b]" />
            </label>
            <select
              id="degree_type"
              name="degree_type"
              value={formData.degree_type}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-300 focus:ring-2 focus:ring-[#50fa7b] transition"
            >
              <option value="">Select Degree Type</option>
              <option value="Bachelor">Bachelor</option>
              <option value="Master">Master</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          {/* Degree */}
          <div>
            <label htmlFor="degree" className="block text-sm font-semibold mb-2">
              Degree
            </label>
            <input
              type="text"
              id="degree"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              required
              placeholder="Degree Name"
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-300 focus:ring-2 focus:ring-[#50fa7b] transition"
            />
          </div>

          {/* University */}
          <div>
            <label htmlFor="university" className="block text-sm font-semibold mb-2">
              University <FaUniversity className="inline text-[#50fa7b]" />
            </label>
            <input
              type="text"
              id="university"
              name="university"
              value={formData.university}
              onChange={handleChange}
              required
              placeholder="University Name"
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-300 focus:ring-2 focus:ring-[#50fa7b] transition"
            />
          </div>

          {/* Department */}
          <div>
            <label htmlFor="department" className="block text-sm font-semibold mb-2">
              Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              placeholder="Department"
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-300 focus:ring-2 focus:ring-[#50fa7b] transition"
            />
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="start_date" className="block text-sm font-semibold mb-2">
              Start Date
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-300 focus:ring-2 focus:ring-[#50fa7b] transition"
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="end_date" className="block text-sm font-semibold mb-2">
              End Date
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-300 focus:ring-2 focus:ring-[#50fa7b] transition"
            />
          </div>

          {/* CGPA */}
          <div>
            <label htmlFor="cgpa" className="block text-sm font-semibold mb-2">
              CGPA
            </label>
            <input
              type="number"
              step="0.1"
              id="cgpa"
              name="cgpa"
              value={formData.cgpa}
              onChange={handleChange}
              required
              placeholder="CGPA"
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-300 focus:ring-2 focus:ring-[#50fa7b] transition"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-[#50fa7b] text-gray-900 py-2 px-6 rounded-full font-semibold flex items-center gap-2 hover:bg-[#00d177] transition"
              disabled={loading}
            >
              {loading ? "Saving..." : <><FaSave className="text-lg" /> Save Qualification</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
