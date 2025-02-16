"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { FaSpinner, FaSave, FaTrash, FaArrowLeft, FaBriefcase } from "react-icons/fa";

export default function EditPreferredJobTitlePage() {
  const router = useRouter();
  const { titleId } = useParams();
  const [jobTitle, setJobTitle] = useState("");
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/preferred-job-titles/${titleId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setJobTitle(res.data.job_title);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch job title.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [titleId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setUpdating(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/preferred-job-titles/${titleId}`,
        { job_title: jobTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update job title.");
    } finally {
      setUpdating(false);
      isSubmittingRef.current = false;
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job title?")) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/preferred-job-titles/${titleId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Job title deleted successfully!");
      router.push("/dashboard/applicant/profile/preferred-job-titles");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete job title.");
    } finally {
      setDeleting(false);
    }
  };

  const handleModalOk = () => {
    setModalData(null);
    router.push("/dashboard/applicant/profile/preferred-job-titles");
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
          <h1 className="text-2xl font-bold">Edit Preferred Job Title</h1>
        </div>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaBriefcase className="text-purple-400" /> Job Title
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
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
              Update Job Title
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
            <h2 className="text-2xl font-bold mb-4">Job Title Updated</h2>
            <p className="text-lg">
              <strong>Job Title:</strong> {modalData.job_title}
            </p>
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
