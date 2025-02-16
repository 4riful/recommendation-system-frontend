"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FaSpinner,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBriefcase,
  FaCalendarAlt,
  FaFrown,
} from "react-icons/fa";

export default function ExperiencesListPage() {
  const router = useRouter();
  const [employments, setEmployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token") || null;
  const applicantProfileId = localStorage.getItem("applicantProfileId") || null;

  const fetchEmployments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/previous-employments/applicant/${applicantProfileId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmployments(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("No experience records found.");
      } else {
        setError("Failed to fetch experience records.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!applicantProfileId) {
      router.push("/dashboard/applicant/profile/create");
    } else {
      fetchEmployments();
    }
  }, [applicantProfileId, router]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this experience record?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/previous-employments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployments((prev) => prev.filter((exp) => exp.employment_id !== id));
    } catch (err) {
      alert("Failed to delete experience record.");
    }
  };

  return (
    <div className="min-h-screen bg-[#282a36] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Experience</h1>
          <button
            onClick={() => router.push("/dashboard/applicant/profile/experiences/create")}
            className="btn btn-primary flex items-center gap-2"
          >
            <FaPlus /> Add New Experience
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
        ) : employments.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <FaFrown className="text-6xl text-gray-400 mb-4" />
            <p className="text-center text-xl">No experience records found. Please add one.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {employments.map((exp) => (
              <div key={exp.employment_id} className="bg-[#44475a] p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <FaBriefcase className="text-purple-400" /> {exp.position_held}
                </h2>
                <p className="text-sm mb-1">
                  <strong>Institution:</strong> {exp.institution}
                </p>
                <p className="text-sm mb-1 flex items-center gap-1">
                  <FaCalendarAlt className="text-purple-400" />
                  <strong>Duration:</strong> {exp.employment_duration}
                </p>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() =>
                      router.push(`/dashboard/applicant/profile/experiences/${exp.employment_id}/edit`)
                    }
                    className="btn btn-sm btn-primary flex items-center gap-1"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp.employment_id)}
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
