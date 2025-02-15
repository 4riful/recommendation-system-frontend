"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSave, FaMapMarkerAlt } from "react-icons/fa";

export default function CreateAddressPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    city: "",
    state: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const applicantProfileId =
    typeof window !== "undefined" ? localStorage.getItem("applicantProfileId") : null;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applicant-address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          applicantProfileId, // Include applicantProfileId in the payload
        }),
      });

      if (!res.ok) {
        if (res.status === 409) {
          throw new Error("An address already exists for this profile.");
        }
        throw new Error("Failed to create address");
      }

      setSuccessMessage("Address created successfully!");
      setTimeout(() => {
        router.push("/dashboard/applicant/profile/address");
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  text-[#f8f8f2] p-6">
      <h1 className="text-2xl font-semibold text-center mb-6 text-[#f1fa8c]">
        Add Your Address
      </h1>

      {error && (
        <div className="text-center text-sm text-red-400 mb-4">{error}</div>
      )}

      {successMessage && (
        <div className="text-center text-sm text-green-400 mb-4">{successMessage}</div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-[#44475a] p-6 rounded-md shadow-md space-y-6"
      >
        <div className="mb-4">
          <label
            htmlFor="city"
            className="block text-sm font-medium text-[#f8f8f2] mb-1 flex items-center gap-2"
          >
            <FaMapMarkerAlt className="text-[#50fa7b]" />
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-[#f8f8f2] border border-[#6272a4] focus:outline-none focus:ring-2 focus:ring-[#50fa7b] transition-all duration-200"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="state"
            className="block text-sm font-medium text-[#f8f8f2] mb-1 flex items-center gap-2"
          >
            <FaMapMarkerAlt className="text-[#50fa7b]" />
            State / Division
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-[#f8f8f2] border border-[#6272a4] focus:outline-none focus:ring-2 focus:ring-[#50fa7b] transition-all duration-200"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="country"
            className="block text-sm font-medium text-[#f8f8f2] mb-1 flex items-center gap-2"
          >
            <FaMapMarkerAlt className="text-[#50fa7b]" />
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-[#f8f8f2] border border-[#6272a4] focus:outline-none focus:ring-2 focus:ring-[#50fa7b] transition-all duration-200"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-[#50fa7b] text-[#282a36] py-2 px-4 rounded-full text-sm font-semibold inline-flex items-center gap-2 hover:bg-[#00d177] transition-all duration-200"
        >
          {loading ? (
            "Saving..."
          ) : (
            <>
              <FaSave className="text-lg" /> Save Address
            </>
          )}
        </button>
      </form>
    </div>
  );
}
