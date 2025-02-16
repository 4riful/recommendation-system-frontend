"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import {
  FaSpinner,
  FaSave,
  FaTrash,
  FaCheckCircle,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaUserFriends,
  FaArrowLeft,
} from "react-icons/fa";

export default function EditReferencePage() {
  const router = useRouter();
  const { referenceId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    phonenumber: "",
    email: "",
    relationship: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [modalData, setModalData] = useState(null); // For modal popup after update
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/references/${referenceId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = res.data;
        setFormData({
          name: data.name,
          phonenumber: data.phonenumber,
          email: data.email,
          relationship: data.relationship,
        });
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch reference data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [referenceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/references/${referenceId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedReference = res.data;
      setModalData(updatedReference);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update reference.");
    } finally {
      setUpdating(false);
      isSubmittingRef.current = false;
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this reference?")) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/references/${referenceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Reference deleted successfully!");
      router.push("/dashboard/applicant/profile/references");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete reference.");
    } finally {
      setDeleting(false);
    }
  };

  const handleModalOk = () => {
    setModalData(null);
    router.push("/dashboard/applicant/profile/references");
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
          <button onClick={handleBack} className="btn btn-secondary flex items-center gap-2">
            <FaArrowLeft /> Back
          </button>
          <h1 className="text-2xl font-bold text-center flex-grow">Edit Reference</h1>
        </div>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaUser className="text-purple-400" /> Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaPhone className="text-purple-400" /> Phone Number
            </label>
            <input
              type="text"
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaEnvelope className="text-purple-400" /> Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaUserFriends className="text-purple-400" /> Relationship
            </label>
            <input
              type="text"
              name="relationship"
              value={formData.relationship}
              onChange={handleChange}
              required
              placeholder="e.g., Mentor"
              className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              disabled={updating}
              className="flex items-center gap-2 bg-[#bd93f9] py-3 px-6 rounded-md text-[#282a36] font-bold transition-colors hover:bg-[#caa1f9]"
            >
              {updating ? <FaSpinner className="animate-spin" /> : <FaSave className="text-lg" />}
              Update Reference
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600 py-3 px-6 rounded-md text-white font-bold transition-colors hover:bg-red-700"
            >
              {deleting ? <FaSpinner className="animate-spin" /> : <FaTrash className="text-lg" />}
              Delete
            </button>
          </div>
        </form>
      </div>

      {/* Modal Popup for Updated Info */}
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#44475a] p-8 rounded-xl shadow-2xl text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-white">Reference Updated</h2>
            <div className="flex flex-col items-center gap-2 mb-4">
              <FaCheckCircle className="text-green-500 text-6xl" />
              <p className="text-lg text-white">Reference updated successfully!</p>
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
