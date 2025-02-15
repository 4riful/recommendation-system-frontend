"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import {
  FaSpinner,
  FaSave,
  FaTrashAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaFileAlt,
  FaLink,
  FaCalendarAlt,
  FaChartBar,
  FaNewspaper,
  FaUserFriends,
  FaAlignLeft,
  FaRegCalendarAlt,
  FaInfo,
  FaArrowLeft,
} from "react-icons/fa";

export default function EditResearchInfoPage() {
  const router = useRouter();
  const { researchId } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [modalData, setModalData] = useState(null); // For modal popup after update
  const isSubmittingRef = useRef(false);

  // Helper: Format date to YYYY-MM-DD
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Fetch current research info on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/research-based-infos/${researchId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = res.data;
        setFormData({
          paper_title: data.paper_title,
          doi: data.doi,
          publication_date: formatDateForInput(data.publication_date),
          citation_count: data.citation_count.toString(),
          journal_name: data.journal_name,
          authors: data.authors,
          abstract: data.abstract,
          conference_name: data.conference_name || "",
        });
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch research info.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [researchId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/research-based-infos/${researchId}`,
        {
          ...formData,
          citation_count: Number(formData.citation_count),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedInfo = res.data;
      console.log("Research info update response:", updatedInfo);
      setModalData(updatedInfo);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update research info.");
    } finally {
      setUpdating(false);
      isSubmittingRef.current = false;
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this research info record?")) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/research-based-infos/${researchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Research information deleted successfully!");
      router.push("/dashboard/applicant/profile/research-based-info");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete research info.");
    } finally {
      setDeleting(false);
    }
  };

  const handleModalOk = () => {
    setModalData(null);
    router.push("/dashboard/applicant/profile/research-based-info");
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
          <button onClick={handleBack} className="flex items-center gap-2 btn btn-secondary">
            <FaArrowLeft /> Back
          </button>
          <h1 className="text-2xl font-bold text-center flex-grow">Edit Research Information</h1>
        </div>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleUpdate} className="space-y-6">
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
              className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
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
              className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
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
              className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
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
              className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
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
              className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
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
              className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
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
              className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
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
              className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              disabled={updating}
              className="flex items-center gap-2 bg-[#bd93f9] py-3 px-6 rounded-md text-[#282a36] font-bold transition-colors hover:bg-[#caa1f9]"
            >
              {updating ? <FaSpinner className="animate-spin" /> : <FaSave className="text-lg" />}
              Update Research Info
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600 py-3 px-6 rounded-md text-white font-bold transition-colors hover:bg-red-700"
            >
              {deleting ? <FaSpinner className="animate-spin" /> : <FaTrashAlt className="text-lg" />}
              Delete
            </button>
          </div>
        </form>
      </div>

      {/* Modal Popup for Verification Details */}
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#44475a] p-8 rounded-xl shadow-2xl text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-white">Research Info Updated</h2>
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
