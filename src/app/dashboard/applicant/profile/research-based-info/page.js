"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  FaSpinner,
  FaPlus,
  FaEdit,
  FaTrash,
  FaFileAlt,
  FaLink,
  FaNewspaper,
  FaCalendarAlt,
  FaChartBar,
  FaUserFriends,
  FaFrown,
} from "react-icons/fa";

export default function ResearchInfoListPage() {
  const router = useRouter();
  const [researchInfos, setResearchInfos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const applicantProfileId = typeof window !== "undefined" ? localStorage.getItem("applicantProfileId") : null;

  const fetchResearchInfos = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/research-based-infos/applicant/${applicantProfileId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResearchInfos(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("No research information records found.");
      } else {
        setError("Failed to fetch research information records.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!applicantProfileId) {
      router.push("/dashboard/applicant/profile/create");
    } else {
      fetchResearchInfos();
    }
  }, [applicantProfileId]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/research-based-infos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResearchInfos((prev) => prev.filter((info) => info.paper_id !== id));
    } catch (err) {
      alert("Failed to delete record.");
    }
  };

  return (
    <div className="min-h-screen bg-[#282a36] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Research Information</h1>
          <button
            onClick={() =>
              router.push("/dashboard/applicant/profile/research-based-info/create")
            }
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
        ) : researchInfos.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <FaFrown className="text-6xl text-gray-400 mb-4" />
            <p className="text-center text-xl">No research records found. Please add one.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {researchInfos.map((info) => (
              <div key={info.paper_id} className="bg-[#44475a] p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <FaFileAlt className="text-purple-400" /> {info.paper_title}
                </h2>
                <p className="text-sm mb-1 flex items-center gap-1">
                  <FaLink className="text-purple-400" />
                  <strong>DOI:</strong> {info.doi}
                </p>
                <p className="text-sm mb-1 flex items-center gap-1">
                  <FaNewspaper className="text-purple-400" />
                  <strong>Journal:</strong> {info.journal_name}
                </p>
                <p className="text-sm mb-1 flex items-center gap-1">
                  <FaCalendarAlt className="text-purple-400" />
                  <strong>Published:</strong>{" "}
                  {new Date(info.publication_date).toLocaleDateString()}
                </p>
                <p className="text-sm mb-1 flex items-center gap-1">
                  <FaChartBar className="text-purple-400" />
                  <strong>Citations:</strong> {info.citation_count}
                </p>
                <p className="text-sm mb-3 flex items-center gap-1">
                  <FaUserFriends className="text-purple-400" />
                  <strong>Authors:</strong> {info.authors}
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() =>
                      router.push(
                        `/dashboard/applicant/profile/research-based-info/${info.paper_id}/edit`
                      )
                    }
                    className="btn btn-sm btn-primary flex items-center gap-1"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(info.paper_id)}
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
