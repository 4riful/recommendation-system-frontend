"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import JobRecommendations from "../components/JobRecommendations";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  FaSearch,
  FaGlobe,
  FaBrain,
  FaBriefcase,
  FaClock,
  FaMoneyBillWave,
  FaArrowRight,
} from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState("search"); // "search", "browse", "recommend"
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    keyword: "",
    city: "",
    department: "",
    salary: "",
    job_type: "",
    job_status: "open",
  });

  /**
   * Reset the job list whenever switching to the Search tab
   */
  const goToSearchTab = () => {
    setActiveTab("search");
    setJobs([]); // Clear previous results
    setError("");
  };

  /**
   * Browse tab will always fetch all jobs from getall
   */
  const goToBrowseTab = async () => {
    setActiveTab("browse");
    await fetchJobs(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/getall`);
  };

  /**
   * AI tab simply sets the tab, no fetch
   */
  const goToRecommendationsTab = () => {
    setActiveTab("recommend");
  };

  /**
   * Common fetch helper
   */
  const fetchJobs = async (url) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(url);
      if (response.data.success) {
        setJobs(response.data.data);
      } else {
        setError("Failed to fetch job listings.");
      }
    } catch (err) {
      setError("An error occurred while fetching job listings.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Search form submission
   */
  const handleSearch = async (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key]) queryParams.append(key, filters[key]);
    });

    if (!queryParams.toString()) {
      setJobs([]);
      setError("");
      return;
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/filter?${queryParams}`;
    await fetchJobs(url);
  };

  /**
   * Update filter state
   */
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <AiOutlineLoading3Quarters className="animate-spin text-primary text-6xl" />
      </div>
    );
  }
  if (error) {
    return <div className="text-red-500 text-center text-xl py-8">{error}</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      {/* Tabs */}
      <div className="flex justify-center gap-6 border-b border-gray-700 pb-3">
        <TabButton
          label="Search"
          icon={<FaSearch />}
          active={activeTab === "search"}
          onClick={goToSearchTab}
        />
        <TabButton
          label="Browse"
          icon={<FaGlobe />}
          active={activeTab === "browse"}
          onClick={goToBrowseTab}
        />
        <TabButton
          label="AI Recs"
          icon={<FaBrain />}
          active={activeTab === "recommend"}
          onClick={goToRecommendationsTab}
        />
      </div>

      {/* Tab content */}
      {activeTab === "search" && (
        <SearchTab
          filters={filters}
          jobs={jobs}
          handleSearch={handleSearch}
          handleFilterChange={handleFilterChange}
        />
      )}
      {activeTab === "browse" && <BrowseTab jobs={jobs} />}
      {activeTab === "recommend" && <RecommendationsTab />}
    </div>
  );
}

/***********************************************
 * Tab Button
 ***********************************************/
function TabButton({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 pb-1 text-xl font-semibold transition-colors duration-200 ${
        active
          ? "border-b-2 border-primary text-white"
          : "text-gray-400 hover:text-white"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/***********************************************
 * Search Tab
 ***********************************************/
function SearchTab({ filters, jobs, handleSearch, handleFilterChange }) {
  return (
    <div>
      <h1 className="text-3xl text-white font-bold mb-2">Search Jobs</h1>
      <p className="text-gray-400 mb-4 text-base">
        Search by keyword or use advanced filters.
      </p>

      {/* Search bar */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row items-center gap-4 bg-gray-800 p-4 sm:p-6 rounded-lg shadow"
      >
        <input
          type="text"
          name="keyword"
          placeholder="Keyword..."
          className="input input-bordered bg-gray-700 text-white w-full md:w-3/4 py-2 px-3 text-base rounded"
          value={filters.keyword}
          onChange={handleFilterChange}
        />
        <button type="submit" className="btn btn-primary px-6 py-2 text-base font-medium">
          Search
        </button>
      </form>

      {/* Advanced Filters */}
      <details className="mt-4 bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
        <summary className="text-white cursor-pointer text-lg font-semibold">
          Advanced Filters
        </summary>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <input
            type="text"
            name="city"
            placeholder="City"
            className="input input-bordered bg-gray-700 text-white py-2 px-3 rounded"
            value={filters.city}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            className="input input-bordered bg-gray-700 text-white py-2 px-3 rounded"
            value={filters.department}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="salary"
            placeholder="Salary (e.g., 50000-70000)"
            className="input input-bordered bg-gray-700 text-white py-2 px-3 rounded"
            value={filters.salary}
            onChange={handleFilterChange}
          />
          <select
            name="job_type"
            className="select bg-gray-700 text-white py-2 px-3 rounded"
            value={filters.job_type}
            onChange={handleFilterChange}
          >
            <option value="">Job Type</option>
            <option value="full_time">Full-time</option>
            <option value="part_time">Part-time</option>
            <option value="contract">Contract</option>
          </select>
          <select
            name="job_status"
            className="select bg-gray-700 text-white py-2 px-3 rounded"
            value={filters.job_status}
            onChange={handleFilterChange}
          >
            <option value="">Any Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </details>

      {/* Search Results */}
      <div className="mt-6">
        <JobList jobs={jobs} />
      </div>
    </div>
  );
}

/***********************************************
 * Browse Tab
 ***********************************************/
function BrowseTab({ jobs }) {
  return (
    <div>
      <h1 className="text-3xl text-white font-bold mb-2">Browse Jobs</h1>
      <p className="text-gray-400 mb-4 text-base">
        Browse all available positions.
      </p>
      <JobList jobs={jobs} />
    </div>
  );
}

/***********************************************
 * Recommendations Tab
 ***********************************************/
function RecommendationsTab() {
  return (
    <div>
      <h1 className="text-3xl text-white font-bold mb-2 flex items-center gap-2">
      </h1>
     
      <JobRecommendations />
    </div>
  );
}

/***********************************************
 * JobList
 ***********************************************/
function JobList({ jobs }) {
  if (!jobs || jobs.length === 0) {
    return (
      <p className="text-gray-400 mt-6 text-center text-base">
        No jobs found. Try different filters or a new search.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {jobs.map((job) => (
        <li
          key={job.job_id}
          className="bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-700 transition-colors duration-200 border border-gray-700"
        >
          <h3 className="text-xl font-bold text-white mb-1">
            {job.job_title}
          </h3>
          <p className="text-sm text-gray-300 mb-2 line-clamp-3">
            {job.description || "No description available."}
          </p>
          {/* Optional extra details */}
          {(job.department || job.job_type || job.salary) && (
            <div className="flex flex-wrap gap-3 mb-2">
              {job.department && (
                <div className="flex items-center text-gray-400 text-xs">
                  <FaBriefcase className="mr-1" />
                  <span>{job.department}</span>
                </div>
              )}
              {job.job_type && (
                <div className="flex items-center text-gray-400 text-xs">
                  <FaClock className="mr-1" />
                  <span>{job.job_type}</span>
                </div>
              )}
              {job.salary && (
                <div className="flex items-center text-gray-400 text-xs">
                  <FaMoneyBillWave className="mr-1" />
                  <span>{job.salary}</span>
                </div>
              )}
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-400 text-sm">
              <HiLocationMarker className="mr-1" />
              <span>
                {job.city || "N/A"}
                {job.state ? `, ${job.state}` : ""}
              </span>
            </div>
            <a
              href={`/dashboard/applicant/jobs/${job.job_id}`}
              className="flex items-center text-primary font-semibold text-sm hover:underline"
            >
              <span>Details</span>
              <FaArrowRight className="ml-1" />
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
