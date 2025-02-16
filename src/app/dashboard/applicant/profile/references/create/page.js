"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaSave, FaSpinner, FaUser, FaPhone, FaEnvelope, FaUserFriends } from "react-icons/fa";

export default function CreateReferencePage({ onReferenceCreated = () => {} }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phonenumber: "",
    email: "",
    relationship: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isSubmittingRef = useRef(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/references/`,
        {
          applicantProfileId,
          name: formData.name,
          phonenumber: formData.phonenumber,
          email: formData.email,
          relationship: formData.relationship,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const reference = res.data;
      onReferenceCreated(reference);
      // Redirect after a short delay for smooth UX
      setTimeout(() => {
        router.push("/dashboard/applicant/profile/references");
      }, 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to create reference.";
      setError(errorMsg);
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-[#282a36] text-white p-6">
      <div className="max-w-2xl mx-auto bg-[#44475a] p-8 rounded-xl shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6">Create Reference</h1>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
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
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-purple-400 py-3 rounded-md text-black font-bold transition-colors hover:bg-purple-300"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaSave className="text-lg" />}
            Create Reference
          </button>
        </form>
      </div>
    </div>
  );
}
