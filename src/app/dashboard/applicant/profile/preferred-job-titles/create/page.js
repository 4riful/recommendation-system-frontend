"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaSpinner, FaSave, FaBriefcase, FaArrowLeft, FaInfo } from "react-icons/fa";

export default function CreatePreferredJobTitlePage({ onJobTitleCreated = () => {} }) {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalData, setModalData] = useState(null);
  const isSubmittingRef = useRef(false);

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
        `${process.env.NEXT_PUBLIC_API_URL}/api/preferred-job-titles/`,
        { applicantProfileId, job_title: jobTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const createdJobTitle = res.data;
      setModalData(createdJobTitle);
      onJobTitleCreated(createdJobTitle);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to create preferred job title.";
      setError(errorMsg);
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  const handleModalOk = () => {
    setModalData(null);
    router.push("/dashboard/applicant/profile/preferred-job-titles");
  };

  return (
    <div className="min-h-screen bg-[#282a36] text-white p-6">
      <div className="max-w-2xl mx-auto bg-[#44475a] p-8 rounded-xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Create Preferred Job Title</h1>
        </div>
        <p className="text-center text-gray-300 mb-6 flex items-center justify-center gap-2 text-xs">
          <FaInfo className="text-lg" /> Please enter your preferred job title.
        </p>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaBriefcase className="text-purple-400" /> Job Title
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
              placeholder="e.g., Software Engineer"
              className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-purple-400 py-3 rounded-md text-black font-bold transition-colors hover:bg-purple-300"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaSave className="text-lg" />}
            Create Job Title
          </button>
        </form>
      </div>

      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#44475a] p-8 rounded-xl shadow-2xl text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Job Title Created</h2>
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
