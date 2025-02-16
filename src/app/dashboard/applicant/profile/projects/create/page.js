"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FaSave,
  FaSpinner,
  FaFileAlt,
  FaCalendarAlt,
  FaAlignLeft,
  FaArrowLeft,
} from "react-icons/fa";

export default function CreateProjectInfoPage({ onProjectCreated = () => {} }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    project_title: "",
    project_start_date: "",
    project_end_date: "",
    project_description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalData, setModalData] = useState(null);
  const isSubmittingRef = useRef(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/project-infos`,
        {
          applicantProfileId,
          project_title: formData.project_title,
          project_start_date: formData.project_start_date,
          project_end_date: formData.project_end_date,
          project_description: formData.project_description,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const projectInfo = res.data;
      setModalData(projectInfo);
      onProjectCreated(projectInfo);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to create project info.";
      setError(errorMsg);
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  const handleModalOk = () => {
    setModalData(null);
    router.push("/dashboard/applicant/profile/projects");
  };

  return (
    <div className="min-h-screen bg-[#282a36] text-white p-6">
      <div className="max-w-2xl mx-auto bg-[#44475a] p-8 rounded-xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Create Project Info</h1>
        </div>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaFileAlt className="text-purple-400" /> Project Title
            </label>
            <input
              type="text"
              name="project_title"
              value={formData.project_title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaCalendarAlt className="text-purple-400" /> Start Date
            </label>
            <input
              type="date"
              name="project_start_date"
              value={formData.project_start_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaCalendarAlt className="text-purple-400" /> End Date
            </label>
            <input
              type="date"
              name="project_end_date"
              value={formData.project_end_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaAlignLeft className="text-purple-400" /> Project Description
            </label>
            <textarea
              name="project_description"
              value={formData.project_description}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-purple-400 py-3 rounded-md text-black font-bold transition-colors hover:bg-purple-300"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaSave className="text-lg" />}
            Create Project Info
          </button>
        </form>
      </div>

      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#44475a] p-8 rounded-xl shadow-2xl text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Project Info Created</h2>
            <div className="mb-4">
              <p className="text-lg">
                <strong>Title:</strong> {modalData.project_title}
              </p>
              <p className="text-sm">
                <strong>Start Date:</strong>{" "}
                {new Date(modalData.project_start_date).toLocaleDateString()}
              </p>
              <p className="text-sm">
                <strong>End Date:</strong>{" "}
                {new Date(modalData.project_end_date).toLocaleDateString()}
              </p>
              <p className="text-sm">
                <strong>Description:</strong> {modalData.project_description}
              </p>
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
