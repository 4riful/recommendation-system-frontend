"use client";

import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaEdit, FaUniversity, FaGraduationCap, FaPlusCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function AcademicQualificationsPage() {
  const router = useRouter();
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQualifications = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/academic-qualifications/applicant/${localStorage.getItem("applicantProfileId")}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch qualifications");
        }

        const data = await res.json();
        setQualifications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQualifications();
  }, []);

  const handleDelete = async (qualificationId) => {
    const confirmed = confirm("Are you sure you want to delete this qualification?");
    if (confirmed) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/academic-qualifications/${qualificationId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to delete qualification");
        }

        setQualifications(qualifications.filter((item) => item.qualification_id !== qualificationId));
        alert("Qualification deleted successfully!");
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) {
    return <div className="text-center text-sm text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen  p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Academic Qualifications</h1>
        <button
          onClick={() => router.push("/dashboard/applicant/profile/academic-qualifications/create")}
          className="bg-[#50fa7b] text-[#282a36] py-2 px-4 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-[#00d177] transition-all duration-300"
        >
          <FaPlusCircle className="text-lg" /> Add New
        </button>
      </div>

      <div className="space-y-6">
        {qualifications.map((qualification) => (
          <div
            key={qualification.qualification_id}
            className="bg-[#44475a] p-6 rounded-lg flex justify-between items-start shadow-lg transition-transform transform hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-[#f1fa8c] flex items-center gap-2">
                <FaGraduationCap /> {qualification.degree} - {qualification.degree_type}
              </h3>
              <p className="text-sm text-gray-300 flex items-center gap-2">
                <FaUniversity className="text-blue-400" /> University: {qualification.university}
              </p>
              <p className="text-sm text-gray-300">Department: {qualification.department}</p>
              <p className="text-sm text-gray-300">CGPA: {qualification.cgpa}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => router.push(`/dashboard/applicant/profile/academic-qualifications/${qualification.qualification_id}/edit`)}
                className="flex items-center text-blue-400 hover:text-blue-500 transition-all duration-200"
              >
                <FaEdit className="mr-2" /> Edit
              </button>
              <button
                onClick={() => handleDelete(qualification.qualification_id)}
                className="flex items-center text-red-400 hover:text-red-500 transition-all duration-200"
              >
                <FaTrashAlt className="mr-2" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
