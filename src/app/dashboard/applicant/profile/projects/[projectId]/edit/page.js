"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import {
  FaSpinner,
  FaSave,
  FaTrash,
  FaArrowLeft,
  FaFileAlt,
  FaCalendarAlt,
  FaAlignLeft,
  FaEdit,
} from "react-icons/fa";

export default function EditProjectInfoPage() {
  const router = useRouter();
  const { projectId } = useParams();
  const [formData, setFormData] = useState({
    project_title: "",
    project_start_date: "",
    project_end_date: "",
    project_description: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [modalData, setModalData] = useState(null);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/project-infos/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = res.data;
        // Extract only the date portion from ISO strings
        setFormData({
          project_title: data.project_title,
          project_start_date: data.project_start_date.split("T")[0],
          project_end_date: data.project_end_date.split("T")[0],
          project_description: data.project_description,
        });
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch project info.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [projectId]);

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
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/project-infos/${projectId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedProject = res.data;
      setModalData(updatedProject);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update project info.");
    } finally {
      setUpdating(false);
      isSubmittingRef.current = false;
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project info?")) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/project-infos/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Project info deleted successfully!");
      router.push("/dashboard/applicant/profile/projects");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete project info.");
    } finally {
      setDeleting(false);
    }
  };

  const handleModalOk = () => {
    setModalData(null);
    router.push("/dashboard/applicant/profile/projects");
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
          <h1 className="text-2xl font-bold text-center flex-grow">Edit Project Info</h1>
        </div>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleUpdate} className="space-y-6">
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
          <div className="flex justify-between items-center">
            <button
              type="submit"
              disabled={updating}
              className="flex items-center gap-2 bg-[#bd93f9] py-3 px-6 rounded-md text-[#282a36] font-bold transition-colors hover:bg-[#caa1f9]"
            >
              {updating ? <FaSpinner className="animate-spin" /> : <FaSave className="text-lg" />}
              Update Project Info
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

      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#44475a] p-8 rounded-xl shadow-2xl text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-white">Project Info Updated</h2>
            <div className="flex flex-col items-center gap-2 mb-4">
              {modalData && (
                <>
                  <p className="text-lg text-white">
                    <strong>Title:</strong> {modalData.project_title}
                  </p>
                  <p className="text-sm text-gray-300">
                    <strong>Start:</strong>{" "}
                    {new Date(modalData.project_start_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-300">
                    <strong>End:</strong>{" "}
                    {new Date(modalData.project_end_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-300">
                    <strong>Description:</strong> {modalData.project_description}
                  </p>
                </>
              )}
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
