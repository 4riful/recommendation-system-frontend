"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  FaSpinner,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaHandsHelping,
  FaFrown,
} from "react-icons/fa";

export default function ReferenceListPage() {
  const router = useRouter();
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Retrieve token and applicantProfileId from localStorage
  const token = localStorage.getItem("token") || null;
  const applicantProfileId = localStorage.getItem("applicantProfileId") || null;

  const fetchReferences = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/references/applicant/${applicantProfileId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReferences(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("No reference records found.");
      } else {
        setError("Failed to fetch reference records.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!applicantProfileId) {
      router.push("/dashboard/applicant/profile/create");
    } else {
      fetchReferences();
    }
  }, [applicantProfileId, router]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this reference?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/references/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReferences((prev) => prev.filter((ref) => ref.reference_id !== id));
    } catch (err) {
      alert("Failed to delete reference.");
    }
  };

  return (
    <div className="min-h-screen bg-[#282a36] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">References</h1>
          <button
            onClick={() => router.push("/dashboard/applicant/profile/references/create")}
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
        ) : references.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <FaFrown className="text-6xl text-gray-400 mb-4" />
            <p className="text-center text-xl">No references found. Please add one.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {references.map((ref) => (
              <div
                key={ref.reference_id}
                className="bg-[#44475a] p-6 rounded-xl shadow-md"
              >
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <FaUser className="text-purple-400" /> {ref.name}
                </h2>
                <p className="text-sm mb-1 flex items-center gap-1">
                  <FaEnvelope className="text-purple-400" /> <strong>Email:</strong> {ref.email}
                </p>
                <p className="text-sm mb-1 flex items-center gap-1">
                  <FaPhone className="text-purple-400" /> <strong>Phone:</strong> {ref.phonenumber}
                </p>
                <p className="text-sm mb-3 flex items-center gap-1">
                  <FaHandsHelping className="text-purple-400" /> <strong>Relationship:</strong> {ref.relationship}
                </p>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() =>
                      router.push(`/dashboard/applicant/profile/references/${ref.reference_id}/edit`)
                    }
                    className="btn btn-sm btn-primary flex items-center gap-1"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ref.reference_id)}
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
