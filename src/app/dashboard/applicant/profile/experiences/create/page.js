"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FaSave,
  FaSpinner,
  FaBriefcase,
  FaUserTie,
  FaCalendarAlt,
  FaArrowLeft,
} from "react-icons/fa";

export default function CreateExperiencePage({ onExperienceCreated = () => {} }) {
  const router = useRouter();
  // We now split the duration into two fields: years and months.
  const [formData, setFormData] = useState({
    institution: "",
    position_held: "",
    years: "",
    months: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isSubmittingRef = useRef(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const applicantProfileId = localStorage.getItem("applicantProfileId");
      if (!applicantProfileId) {
        router.push("/dashboard/applicant/profile/create");
        return;
      }
      // Combine years and months into a string: e.g. "2 year 3 month"
      const employment_duration = `${formData.years} year ${formData.months} month`;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/previous-employments`,
        {
          applicantProfileId,
          institution: formData.institution,
          position_held: formData.position_held,
          employment_duration,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const experience = res.data;
      onExperienceCreated(experience);
      // Redirect after a brief delay for smooth UX
      setTimeout(() => {
        router.push("/dashboard/applicant/profile/experiences");
      }, 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to create experience record.";
      setError(errorMsg);
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-[#282a36] text-white p-6">
      <div className="max-w-2xl mx-auto bg-[#44475a] p-8 rounded-xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Add Experience</h1>
        </div>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaBriefcase className="text-purple-400" /> Institution
            </label>
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaUserTie className="text-purple-400" /> Position Held
            </label>
            <input
              type="text"
              name="position_held"
              value={formData.position_held}
              onChange={handleChange}
              required
              placeholder="e.g., Software Engineer"
              className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                <FaCalendarAlt className="text-purple-400" /> Years
              </label>
              <input
                type="number"
                name="years"
                value={formData.years}
                onChange={handleChange}
                required
                min="0"
                placeholder="e.g., 2"
                className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                <FaCalendarAlt className="text-purple-400" /> Months
              </label>
              <input
                type="number"
                name="months"
                value={formData.months}
                onChange={handleChange}
                required
                min="0"
                max="11"
                placeholder="e.g., 3"
                className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-purple-400 py-3 rounded-md text-black font-bold transition-colors hover:bg-purple-300"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaSave className="text-lg" />}
            Add Experience
          </button>
        </form>
      </div>
    </div>
  );
}
