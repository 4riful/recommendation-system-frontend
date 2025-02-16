"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  FaSpinner,
  FaFrown,
  FaHeart,
  FaBookmark,
  FaBuilding,
  FaClock,
  FaBriefcase,
} from "react-icons/fa";

export default function SavedJobs() {
  const router = useRouter();
  const [savedJobs, setSavedJobs] = useState([]);
  const [lovedJobs, setLovedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);
  const [applicantProfileId, setApplicantProfileId] = useState(null);

  // Retrieve token and applicantProfileId only on the client
  useEffect(() => {
    const localToken = localStorage.getItem("token");
    const localApplicantProfileId = localStorage.getItem("applicantProfileId");

    setToken(localToken);
    setApplicantProfileId(localApplicantProfileId);
  }, []);

  // Fetch job interactions when token and applicantProfileId are available
  useEffect(() => {
    async function fetchJobInteractions() {
      try {
        if (!token || !applicantProfileId) return;

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/job-interactions/applicant/${applicantProfileId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Assuming response structure: { message: "...", data: [...] }
        const interactions = res.data.data || [];

        const saved = interactions.filter(
          (interaction) => interaction.interaction_type === "saved"
        );
        const loved = interactions.filter(
          (interaction) => interaction.interaction_type === "liked"
        );

        setSavedJobs(saved);
        setLovedJobs(loved);
      } catch (err) {
        console.error("Error fetching job interactions:", err);
        setError("Failed to load job interactions.");
      } finally {
        setLoading(false);
      }
    }

    if (token && applicantProfileId) {
      fetchJobInteractions();
    } else {
      setLoading(false);
    }
  }, [token, applicantProfileId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#282a36] text-white">
        <FaSpinner className="animate-spin text-6xl" />
      </div>
    );
  }

  if (!applicantProfileId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#282a36] text-white">
        <FaFrown className="text-6xl text-red-500 mb-4" />
        <p className="text-xl">Applicant profile not found. Please create one.</p>
        <button
          onClick={() => router.push("/dashboard/applicant/create-profile")}
          className="mt-4 bg-blue-500 hover:bg-blue-600 transition-colors py-2 px-6 rounded"
        >
          Create Profile
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#282a36] text-white">
        <FaFrown className="text-6xl text-red-500 mb-4" />
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (savedJobs.length === 0 && lovedJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#282a36] text-white">
        <FaFrown className="text-6xl text-gray-400 mb-4" />
        <p className="text-xl">No saved or loved jobs found.</p>
      </div>
    );
  }

  const renderJobCard = (job) => (
    <div
      key={job.job_id}
      className="bg-[#44475a] p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center gap-2 mb-3">
          <FaBriefcase className="text-2xl text-blue-300" />
          <h3 className="text-xl font-bold">{job.job_title}</h3>
        </div>
        <p className="text-sm text-gray-200 mb-4">
          {job.description || "No description available."}
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <FaBuilding className="text-.5xl text-[#50fa7b]" />
            <span className="text-sm text-gray-300">{job.department}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaClock className="text-.5xl text-[#50fa7b]" />
            <span className="text-sm text-gray-300 capitalize">
              {job.job_type.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={() =>
          router.push(`/dashboard/applicant/jobs/${job.job_id}/apply`)
        }
        className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-4 rounded hover:from-blue-600 hover:to-indigo-600 transition-colors"
      >
        Apply
      </button>
    </div>
  );

  return (
    <div className="min-h-screen  text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center">
          Saved & Loved Jobs
        </h1>

        {savedJobs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
              <FaBookmark className="text-2xl text-[#50fa7b]" /> Saved Jobs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedJobs.map((interaction) =>
                renderJobCard(interaction.JobListings)
              )}
            </div>
          </section>
        )}

        {lovedJobs.length > 0 && (
          <section>
            <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
              <FaHeart className="text-2xl text-[#50fa7b]" /> Loved Jobs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {lovedJobs.map((interaction) =>
                renderJobCard(interaction.JobListings)
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
