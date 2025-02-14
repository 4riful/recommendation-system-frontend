"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaRedoAlt, FaBrain, FaBriefcase, FaMapMarkerAlt, FaDollarSign } from "react-icons/fa";

export default function JobRecommendations() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch jobs function
  const fetchJobs = () => {
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/getall`)
      .then((res) => {
        if (res.data.success) {
          setJobs(res.data.data.slice(0, 4));
        } else {
          setError("Failed to fetch job recommendations.");
        }
      })
      .catch(() => {
        setError("An error occurred while fetching job recommendations.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Initial fetch
  useEffect(() => {
    fetchJobs();
  }, []);

  // Refresh handler
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      fetchJobs();
      setRefreshing(false);
    }, 800); // Small delay to allow for blinking effect
  };

  /***********************************************
   * Conditional Rendering for Loading and Errors
   ***********************************************/
  if (loading) {
    return (
      <div className="flex items-center justify-center h-36">
        <div className="flex flex-col items-center animate-pulse">
          <FaBrain className="text-[#8be9fd] text-6xl animate-glow" />
          <p className="mt-4 text-gray-400 text-sm">Generating recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 text-center mt-6">{error}</div>;
  }

  /***********************************************
   * Render Component
   ***********************************************/
  return (
    <div className="w-full">
      {/* Title Section */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="flex items-center text-xl font-bold text-white">
          <FaBrain className="mr-2 text-[#8be9fd] animate-glow" />
          AI-Powered Job Recommendations
        </h3>

        {/* Refresh Icon */}
        <button
          className={`p-2 rounded-full ${refreshing ? "animate-spin" : ""} hover:bg-gray-700`}
          onClick={handleRefresh}
          aria-label="Refresh"
        >
          <FaRedoAlt className="text-white text-lg" />
        </button>
      </div>

      {/* Job List in Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.length === 0 ? (
          <p className="text-gray-400 text-center col-span-full">No jobs available.</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.job_id}
              className={`border border-gray-700 bg-[#44475a] p-6 rounded-lg shadow-lg transition-transform ${
                refreshing ? "animate-pulse" : "hover:scale-105"
              }`}
            >
              {/* Job Title */}
              <h4 className="text-lg font-bold text-[#f8f8f2] flex items-center">
                <FaBriefcase className="mr-2 text-[#ffb86c]" />
                {job.job_title}
              </h4>

              {/* Job Description */}
              <p className="text-sm text-gray-400 mt-2 line-clamp-3">
                {job.description || "No description provided."}
              </p>

              {/* Job Info */}
              <div className="mt-4 space-y-2">
                <p className="flex items-center text-sm text-gray-300">
                  <FaMapMarkerAlt className="mr-2 text-[#8be9fd]" />
                  {job.city || "Location not specified"}
                </p>
                <p className="flex items-center text-sm text-gray-300">
                  <FaDollarSign className="mr-2 text-[#8be9fd]" />
                  {job.salary || "Salary not specified"}
                </p>
              </div>

              {/* View Details Button */}
              <div className="mt-6 flex justify-end">
                <a
                  href={`/dashboard/applicant/jobs/${job.job_id}`}
                  className="flex items-center gap-2 text-sm font-semibold text-[#282a36] bg-[#50fa7b] hover:bg-[#43e08f] px-4 py-2 rounded-lg shadow-lg transition"
                >
                  View Details
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
