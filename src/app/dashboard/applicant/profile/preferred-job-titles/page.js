"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaSpinner, FaPlus, FaEdit, FaTrash, FaBriefcase, FaFrown } from "react-icons/fa";

export default function PreferredJobTitlesListPage() {
  const router = useRouter();
  const [jobTitles, setJobTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token") || null;
  const applicantProfileId = localStorage.getItem("applicantProfileId") || null;

  const fetchJobTitles = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/preferred-job-titles/applicant/${applicantProfileId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobTitles(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("No preferred job titles found.");
      } else {
        setError("Failed to fetch preferred job titles.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!applicantProfileId) {
      router.push("/dashboard/applicant/profile/create");
    } else {
      fetchJobTitles();
    }
  }, [applicantProfileId, router]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this job title?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/preferred-job-titles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobTitles((prev) => prev.filter((job) => job.id !== id));
    } catch (err) {
      alert("Failed to delete job title.");
    }
  };

  return (
    <div className="min-h-screen bg-[#282a36] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Preferred Job Titles</h1>
          <button
            onClick={() => router.push("/dashboard/applicant/profile/preferred-job-titles/create")}
            className="btn btn-primary flex items-center gap-2"
          >
            <FaPlus /> Add New
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center">
            <FaSpinner className="animate-spin text-6xl" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center">
            <FaFrown className="text-6xl text-red-500 mb-4" />
            <p className="text-center text-xl text-red-500">{error}</p>
          </div>
        ) : jobTitles.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <FaFrown className="text-6xl text-gray-400 mb-4" />
            <p className="text-center text-xl">No preferred job titles found. Please add one.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {jobTitles.map((job) => (
              <div key={job.id} className="bg-[#44475a] p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <FaBriefcase className="text-purple-400" /> {job.job_title}
                </h2>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => router.push(`/dashboard/applicant/profile/preferred-job-titles/${job.id}/edit`)}
                    className="btn btn-sm btn-primary flex items-center gap-1"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="btn btn-sm btn-error flex items-center gap-1"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
