"use client";

import React, { useState, useEffect } from "react";
import { FaTrashAlt, FaEdit, FaPlus, FaBriefcase } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function PreferredJobTypesPage() {
  const router = useRouter();
  const [jobTypes, setJobTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const applicantProfileId =
    typeof window !== "undefined" ? localStorage.getItem("applicantProfileId") : null;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!applicantProfileId) {
      router.push("/dashboard/applicant");
      return;
    }
    const fetchJobTypes = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/preferred-job-types/applicant/${applicantProfileId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch preferred job types");
        }
        const data = await res.json();
        setJobTypes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobTypes();
  }, [applicantProfileId, token, router]);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this preferred job type?")) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/preferred-job-types/${id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          throw new Error("Failed to delete preferred job type");
        }
        setJobTypes(jobTypes.filter((jobType) => jobType.id !== id));
        alert("Preferred job type deleted successfully!");
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center text-sm text-gray-400 mt-20">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#283046] text-[#f8f8f2] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[#f1fa8c]">Preferred Job Types</h1>
          <button
            onClick={() =>
              router.push("/dashboard/applicant/profile/preferred-job-types/create")
            }
            className="flex items-center gap-2 bg-[#50fa7b] text-[#282a36] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#00d177] transition-all duration-200"
          >
            <FaPlus className="text-lg" />
            Add Job Type
          </button>
        </div>
        {error && (
          <div className="text-center text-sm text-red-400 mb-4">
            {error}
          </div>
        )}
        {jobTypes.length === 0 ? (
          <div className="text-center text-sm text-gray-300">
            No preferred job types added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {jobTypes.map((jobType) => (
              <div
                key={jobType.id}
                className="flex justify-between items-center bg-[#44475a] p-4 rounded-md shadow-md"
              >
                <div className="flex items-center gap-3">
                  <FaBriefcase className="text-xl text-[#50fa7b]" />
                  <p className="font-semibold text-sm">
                    {jobType.preferred_job_type.replace("_", " ").toUpperCase()}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      router.push(
                        `/dashboard/applicant/profile/preferred-job-types/${jobType.id}/edit`
                      )
                    }
                    className="flex items-center gap-1 text-[#50fa7b] hover:text-[#8be9fd] transition-all duration-200 text-xs font-semibold"
                  >
                    <FaEdit className="text-lg" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(jobType.id)}
                    className="flex items-center gap-1 text-[#ff5555] hover:text-[#ff79c6] transition-all duration-200 text-xs font-semibold"
                  >
                    <FaTrashAlt className="text-lg" />
                    Delete
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
