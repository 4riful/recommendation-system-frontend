"use client";

import React, { useState, useEffect } from "react";
import {
  FaSave,
  FaArrowLeft,
  FaCity,
  FaBuilding,
  FaGlobeAmericas,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";
import { useRouter, useParams } from "next/navigation";

export default function EditAddressPage() {
  const router = useRouter();
  const { addressId } = useParams();

  const [formData, setFormData] = useState({
    city: "",
    state: "",
    country: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!addressId) return;
    const fetchAddress = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-address/${addressId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch address");
        }
        const data = await res.json();
        setFormData({
          city: data.city || "",
          state: data.state || "",
          country: data.country || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [addressId, token]);

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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-address/${addressId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to update address");
      }
      setSuccessMessage("Address updated successfully!");
      setTimeout(() => {
        router.push("/dashboard/applicant/profile/address");
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-sm text-gray-300 mt-20">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#283046] text-[#f8f8f2] p-6">
      <div className="max-w-md mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() =>
              router.push("/dashboard/applicant/profile/address")
            }
            className="flex items-center gap-2 text-sm text-[#50fa7b] hover:text-[#00d177] transition-all duration-200"
          >
            <FaArrowLeft className="text-lg" />
            Back to Address
          </button>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-center mb-6 text-[#f1fa8c]">
          Edit Address
        </h1>

        {/* Error Message */}
        {error && (
          <div className="flex items-center justify-center gap-2 text-sm text-red-400 bg-[#ff6e6e] p-3 rounded-md mb-4">
            <FaExclamationTriangle className="text-lg" />
            {error}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="flex items-center justify-center gap-2 text-sm text-green-400 bg-[#50fa7b] p-3 rounded-md mb-4">
            <FaCheckCircle className="text-lg" />
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#44475a] p-6 rounded-md shadow-md space-y-6"
        >
          {/* City Field */}
          <div className="grid grid-cols-12 items-center gap-3">
            <div className="col-span-2 flex justify-center">
              <FaCity className="text-[#50fa7b] text-xl" />
            </div>
            <div className="col-span-10">
              <label htmlFor="city" className="text-sm font-medium block mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-[#f8f8f2] border border-[#44475a] focus:outline-none focus:ring-2 focus:ring-[#50fa7b] transition-all duration-200"
              />
            </div>
          </div>

          {/* State/Division Field */}
          <div className="grid grid-cols-12 items-center gap-3">
            <div className="col-span-2 flex justify-center">
              <FaBuilding className="text-[#50fa7b] text-xl" />
            </div>
            <div className="col-span-10">
              <label htmlFor="state" className="text-sm font-medium block mb-1">
                State/Division
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-[#f8f8f2] border border-[#44475a] focus:outline-none focus:ring-2 focus:ring-[#50fa7b] transition-all duration-200"
              />
            </div>
          </div>

          {/* Country Field */}
          <div className="grid grid-cols-12 items-center gap-3">
            <div className="col-span-2 flex justify-center">
              <FaGlobeAmericas className="text-[#50fa7b] text-xl" />
            </div>
            <div className="col-span-10">
              <label
                htmlFor="country"
                className="text-sm font-medium block mb-1"
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-[#f8f8f2] border border-[#44475a] focus:outline-none focus:ring-2 focus:ring-[#50fa7b] transition-all duration-200"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#50fa7b] text-[#282a36] py-2 rounded-full text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#00d177] transition-all duration-200"
          >
            {loading ? "Saving..." : <><FaSave className="text-lg" /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
}
