"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FaSave,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfo,
  FaFileAlt,
  FaLink,
  FaCalendarAlt,
  FaChartBar,
  FaNewspaper,
  FaUserFriends,
  FaAlignLeft,
  FaRegCalendarAlt,
} from "react-icons/fa";

export default function CreateResearchInfoPage({ onResearchCreated = () => {} }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    paper_title: "",
    doi: "",
    publication_date: "",
    citation_count: "",
    journal_name: "",
    authors: "",
    abstract: "",
    conference_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalData, setModalData] = useState(null); // Stores the response details for modal display
  const isSubmittingRef = useRef(false);

  // Handler for input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingRef.current) {
      console.log("Duplicate submission prevented.");
      return;
    }
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/research-based-infos`,
        {
          applicantProfileId,
          paper_title: formData.paper_title,
          doi: formData.doi,
          publication_date: formData.publication_date,
          citation_count: Number(formData.citation_count),
          journal_name: formData.journal_name,
          authors: formData.authors,
          abstract: formData.abstract,
          conference_name: formData.conference_name,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const researchInfo = res.data;
      console.log("Research info creation response:", researchInfo);
      setModalData(researchInfo);
      onResearchCreated(researchInfo);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to create research info.";
      console.error("Error creating research info:", errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  // Handler for modal OK button: dismiss modal and redirect
  const handleModalOk = () => {
    setModalData(null);
    router.push("/dashboard/applicant/profile/research-based-info");
  };

  return (
    <div className="min-h-screen bg-[#282a36] text-white p-6">
      <div className="max-w-2xl mx-auto bg-[#44475a] p-8 rounded-xl shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-4">Create Research Information</h1>
        <p className="text-center text-gray-300 mb-6 flex items-center justify-center gap-2 text-xs ">
          <FaInfo className="text-lg" /> Please ensure all fields are valid. Your data will be cross‑checked with the CrossRef Data API.
        </p>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaFileAlt className="text-purple-400" /> Paper Title
            </label>
            <input
              type="text"
              name="paper_title"
              value={formData.paper_title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-600 bg-[#6272a4] text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaLink className="text-purple-400" /> DOI
            </label>
            <input
              type="text"
              name="doi"
              value={formData.doi}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-600 bg-[#6272a4] text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaCalendarAlt className="text-purple-400" /> Publication Date
            </label>
            <input
              type="date"
              name="publication_date"
              value={formData.publication_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-600 bg-[#6272a4] text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaChartBar className="text-purple-400" /> Citation Count
            </label>
            <input
              type="number"
              name="citation_count"
              value={formData.citation_count}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-600 bg-[#6272a4] text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaNewspaper className="text-purple-400" /> Journal Name
            </label>
            <input
              type="text"
              name="journal_name"
              value={formData.journal_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-600 bg-[#6272a4] text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaUserFriends className="text-purple-400" /> Authors
            </label>
            <input
              type="text"
              name="authors"
              value={formData.authors}
              onChange={handleChange}
              required
              placeholder="Comma-separated names"
              className="w-full px-4 py-2 rounded-md border border-gray-600 bg-[#6272a4] text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaAlignLeft className="text-purple-400" /> Abstract
            </label>
            <textarea
              name="abstract"
              value={formData.abstract}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-600 bg-[#6272a4] text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaRegCalendarAlt className="text-purple-400" /> Conference Name (optional)
            </label>
            <input
              type="text"
              name="conference_name"
              value={formData.conference_name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-600 bg-[#6272a4] text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-purple-400 py-3 rounded-md text-black font-bold transition-colors hover:bg-purple-300"
          >
            {loading ? <FaSpinner className="animate-spin" /> : "Create Research Info"}
          </button>
        </form>
      </div>

      {/* Modal Popup for Verification Details */}
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#44475a] p-8 rounded-xl shadow-2xl text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-white">Research Info Created</h2>
            <div className="flex flex-col items-center gap-2 mb-4">
              {modalData.review_status === "VERIFIED" ? (
                <FaCheckCircle className="text-green-500 text-6xl" />
              ) : (
                <FaExclamationTriangle className="text-yellow-500 text-6xl" />
              )}
              <p className="text-lg text-white">
                Status: <span className="font-bold">{modalData.review_status}</span>
              </p>
              <p className="text-sm text-gray-300">
                Similarity Score:{" "}
                <span className="font-bold">
                  {modalData.similarityScore != null
                    ? Number(modalData.similarityScore).toFixed(2)
                    : "N/A"}
                </span>
              </p>
              {modalData.details && (
                <div className="text-xs text-gray-300 mt-2">
                  <p>Title Score: {Number(modalData.details.titleScore).toFixed(2)}</p>
                  <p>Authors Avg: {Number(modalData.details.authorsAvgScore).toFixed(2)}</p>
                  <p>Authors Min: {Number(modalData.details.authorsMinScore).toFixed(2)}</p>
                  <p>Combined Score: {Number(modalData.details.combinedScore).toFixed(2)}</p>
                </div>
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
