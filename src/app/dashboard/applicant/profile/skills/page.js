"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  FaSpinner,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCode,
  FaFrown,
} from "react-icons/fa";

export default function SkillsListPage() {
  const router = useRouter();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Retrieve token and profile id from localStorage
  const token = localStorage.getItem("token") || null;
  const applicantProfileId = localStorage.getItem("applicantProfileId") || null;

  const fetchSkills = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-skills/applicant/${applicantProfileId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Check for different response structures:
      let skillsArray = [];
      if (res.data) {
        if (Array.isArray(res.data)) {
          skillsArray = res.data;
        } else if (Array.isArray(res.data.data)) {
          skillsArray = res.data.data;
        } else if (res.data.message && Array.isArray(res.data.message)) {
          // Just in case the response is wrapped differently
          skillsArray = res.data.message;
        }
      }
      setSkills(skillsArray);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("No skill records found.");
      } else {
        setError("Failed to fetch skill records.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!applicantProfileId) {
      router.push("/dashboard/applicant/profile/create");
    } else {
      fetchSkills();
    }
  }, [applicantProfileId, router]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-skills/${applicantProfileId}/skill/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSkills((prev) =>
        prev.filter((s) =>
          s.Skill ? s.Skill.skill_id !== id : s.id !== id
        )
      );
    } catch (err) {
      alert("Failed to delete skill.");
    }
  };

  return (
    <div className="min-h-screen bg-[#282a36] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Skills</h1>
          <button
            onClick={() => router.push("/dashboard/applicant/profile/skills/create")}
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
        ) : skills.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <FaFrown className="text-6xl text-gray-400 mb-4" />
            <p className="text-center text-xl">No skills found. Please add one.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {skills.map((s) => {
              const skillName = s.Skill ? s.Skill.name : s.name;
              const skillId = s.Skill ? s.Skill.skill_id : s.id;
              return (
                <div key={skillId} className="bg-[#44475a] p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <FaCode className="text-purple-400" /> {skillName}
                  </h2>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/applicant/profile/skills/${skillId}/edit`)
                      }
                      className="btn btn-sm btn-primary flex items-center gap-1"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(skillId)}
                      className="btn btn-sm btn-error flex items-center gap-1"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
