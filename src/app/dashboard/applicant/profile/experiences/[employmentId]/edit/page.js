"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import {
  FaSpinner,
  FaSave,
  FaTrash,
  FaArrowLeft,
  FaBriefcase,
  FaUserTie,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function EditExperiencePage() {
  const router = useRouter();
  const { employmentId } = useParams();
  // Our formData now includes institution, position, years, and months.
  const [formData, setFormData] = useState({
    institution: "",
    position_held: "",
    years: "",
    months: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [modalData, setModalData] = useState(null); // For modal popup after update
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/previous-employments/${employmentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = res.data;
        // Parse employment_duration (expected format: "2 year 3 month")
        let years = "";
        let months = "";
        if (data.employment_duration) {
          const parts = data.employment_duration.split(" ");
          if (parts.length >= 4) {
            years = parts[0];
            months = parts[2];
          }
        }
        setFormData({
          institution: data.institution,
          position_held: data.position_held,
          years,
          months,
        });
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch experience data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [employmentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setUpdating(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      // Combine years and months into one string
      const employment_duration = `${formData.years} year ${formData.months} month`;
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/previous-employments/${employmentId}`,
        {
          institution: formData.institution,
          position_held: formData.position_held,
          employment_duration,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedExperience = res.data;
      setModalData(updatedExperience);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update experience.");
    } finally {
      setUpdating(false);
      isSubmittingRef.current = false;
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this experience record?")) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/previous-employments/${employmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Experience deleted successfully!");
      router.push("/dashboard/applicant/profile/experiences");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete experience.");
    } finally {
      setDeleting(false);
    }
  };

  const handleModalOk = () => {
    setModalData(null);
    router.push("/dashboard/applicant/profile/experiences");
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#282a36] text-white">
        <FaSpinner className="animate-spin text-6xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#282a36] text-white p-6">
      <div className="max-w-2xl mx-auto bg-[#44475a] p-8 rounded-xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <button onClick={handleBack} className="btn btn-secondary flex items-center gap-2">
            <FaArrowLeft /> Back
          </button>
          <h1 className="text-2xl font-bold text-center flex-grow">Edit Experience</h1>
        </div>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleUpdate} className="space-y-6">
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
              className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
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
              className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
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
          <div className="flex justify-between items-center">
            <button
              type="submit"
              disabled={updating}
              className="flex items-center gap-2 bg-[#bd93f9] py-3 px-6 rounded-md text-[#282a36] font-bold transition-colors hover:bg-[#caa1f9]"
            >
              {updating ? <FaSpinner className="animate-spin" /> : <FaSave className="text-lg" />}
              Update Experience
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600 py-3 px-6 rounded-md text-white font-bold transition-colors hover:bg-red-700"
            >
              {deleting ? <FaSpinner className="animate-spin" /> : <FaTrash className="text-lg" />}
              Delete
            </button>
          </div>
        </form>
      </div>

      {/* Modal Popup for Updated Info */}
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#44475a] p-8 rounded-xl shadow-2xl text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-white">Experience Updated</h2>
            <div className="flex flex-col items-center gap-2 mb-4">
              <FaCheckCircle className="text-green-500 text-6xl" />
              <p className="text-lg text-white">Experience updated successfully!</p>
            </div>
            <button
              onClick={handleModalOk}
              className="mt-4 px-6 py-2 bg-purple-400 text-black font-bold rounded-md hover:bg-purple-300 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
