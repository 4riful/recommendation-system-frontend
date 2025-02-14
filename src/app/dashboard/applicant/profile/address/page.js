"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaEdit, FaTrashAlt, FaMapMarkerAlt, FaSpinner } from "react-icons/fa";

export default function AddressPage() {
  const router = useRouter();
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const applicantProfileId = typeof window !== "undefined" ? localStorage.getItem("applicantProfileId") : null;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!applicantProfileId) {
      router.push("/dashboard/applicant");
      return;
    }

    const fetchAddress = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-address/applicant/${applicantProfileId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          // If 404, assume no address exists.
          if (res.status === 404) {
            setAddress(null);
          } else {
            throw new Error("Failed to fetch address");
          }
        } else {
          const data = await res.json();
          // If the API returns an array, take the first item (since one address per applicant)
          if (Array.isArray(data)) {
            setAddress(data.length > 0 ? data[0] : null);
          } else {
            setAddress(data);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [applicantProfileId, token, router]);

  const handleDelete = async () => {
    if (!address) return;
    if (!confirm("Are you sure you want to delete your address?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-address/${address.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to delete address");
      }
      alert("Address deleted successfully!");
      setAddress(null);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-300">
        <FaSpinner className="animate-spin text-3xl" />
        <p className="ml-4">Loading Address...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#283046] text-[#f8f8f2] p-6">
      <h1 className="text-2xl font-semibold text-center mb-8 text-[#f1fa8c]">My Address</h1>
      {error && (
        <div className="text-center text-red-400 mb-4 text-sm">{error}</div>
      )}
      {!address ? (
        <div className="max-w-md mx-auto text-center space-y-4">
          <p className="text-sm text-gray-300">
            You haven't added an address yet.
          </p>
          <button
            onClick={() =>
              router.push("/dashboard/applicant/profile/address/create")
            }
            className="inline-flex items-center gap-2 bg-[#50fa7b] text-[#282a36] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#00d177] transition-all duration-200"
          >
            <FaPlus className="text-lg" /> Add Address
          </button>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-[#44475a] p-6 rounded-md shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <FaMapMarkerAlt className="text-[#50fa7b] text-lg" />
            <h2 className="text-xl font-semibold">Your Address</h2>
          </div>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-bold">City:</span> {address.city}
            </p>
            <p>
              <span className="font-bold">State/Division:</span> {address.state}
            </p>
            <p>
              <span className="font-bold">Country:</span> {address.country}
            </p>
          </div>
          <div className="flex gap-4 mt-6">
            <button
              onClick={() =>
                router.push(`/dashboard/applicant/profile/address/${address.id}/edit`)
              }
              className="inline-flex items-center gap-1 text-[#50fa7b] hover:text-[#8be9fd] text-sm font-semibold transition-colors duration-200"
            >
              <FaEdit className="text-lg" /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-1 text-[#ff5555] hover:text-[#ff79c6] text-sm font-semibold transition-colors duration-200"
            >
              <FaTrashAlt className="text-lg" /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
