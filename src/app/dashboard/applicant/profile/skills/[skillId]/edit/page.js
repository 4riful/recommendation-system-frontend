"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import {
  FaSave,
  FaSpinner,
  FaTrash,
  FaCode,
  FaArrowLeft,
  FaInfo,
} from "react-icons/fa";

export default function EditSkillPage({ onSkillUpdated = () => {} }) {
  const router = useRouter();
  const { skillId } = useParams(); // This should be the unique ID for the applicant-skill association
  const [skillName, setSkillName] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  // For skill suggestions:
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Flag to indicate if user has actively changed the input
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const isSubmittingRef = useRef(false);

  // Fetch the current skill info on mount by fetching all skills for the applicant
  useEffect(() => {
    async function fetchSkill() {
      try {
        const token = localStorage.getItem("token");
        const applicantProfileId = localStorage.getItem("applicantProfileId");
        if (!applicantProfileId) {
          router.push("/dashboard/applicant/profile/create");
          return;
        }
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-skills/applicant/${applicantProfileId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Ensure we always work with an array (check multiple possible response structures)
        const skillsArray = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];
        const skillObj = skillsArray.find(
          (item) =>
            (item.Skill ? item.Skill.skill_id === skillId : item.id === skillId)
        );
        if (skillObj) {
          const name = skillObj.Skill ? skillObj.Skill.name : skillObj.name;
          setSkillName(name);
        } else {
          setError("Skill not found.");
        }
      } catch (err) {
        console.error("Error fetching skill:", err);
        setError("Failed to load skill data.");
      } finally {
        setLoading(false);
      }
    }
    if (skillId) {
      fetchSkill();
    }
  }, [skillId, router]);

  // Debounced suggestion fetch when at least 2 characters are typed and user has edited the input
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-skills/suggestions`,
          {
            params: { query: skillName },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (data && Array.isArray(data.data) && data.data.length > 0) {
          setSuggestions(data.data);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (err) {
        console.error("Suggestion error:", err);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    if (hasUserEdited && skillName.trim().length >= 2) {
      const debounceTimeout = setTimeout(() => {
        fetchSuggestions();
      }, 300);
      return () => clearTimeout(debounceTimeout);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [skillName, hasUserEdited]);

  const handleSuggestionClick = (suggestion) => {
    setSkillName(suggestion.name);
    setShowSuggestions(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setUpdating(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const applicantProfileId = localStorage.getItem("applicantProfileId");
      if (!applicantProfileId) {
        router.push("/dashboard/applicant/profile/create");
        return;
      }
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-skills/${applicantProfileId}/skill/${skillId}`,
        { newSkillName: skillName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedSkill = res.data;
      onSkillUpdated(updatedSkill);
      alert("Skill updated successfully!");
      router.push("/dashboard/applicant/profile/skills");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to update skill.";
      setError(errorMsg);
    } finally {
      setUpdating(false);
      isSubmittingRef.current = false;
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const applicantProfileId = localStorage.getItem("applicantProfileId");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-skills/${applicantProfileId}/skill/${skillId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Skill deleted successfully!");
      router.push("/dashboard/applicant/profile/skills");
    } catch (err) {
      alert("Failed to delete skill.");
    } finally {
      setDeleting(false);
    }
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
          <button
            onClick={() => router.back()}
            className="btn btn-secondary flex items-center gap-2"
          >
            <FaArrowLeft /> Back
          </button>
          <h1 className="text-2xl font-bold">Edit Skill</h1>
        </div>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleUpdate} className="space-y-6 relative">
          <div className="relative">
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaCode className="text-purple-400" /> Skill Name
            </label>
            <input
              type="text"
              value={skillName}
              onChange={(e) => {
                setSkillName(e.target.value);
                setHasUserEdited(true);
              }}
              required
              placeholder="e.g., Python"
              className="w-full px-4 py-2 rounded-md bg-[#6272a4] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-[#44475a] border border-gray-700 rounded-md mt-1 max-h-40 overflow-y-auto">
                {suggestions.map((sugg) => (
                  <li
                    key={sugg.skill_id}
                    onClick={() => handleSuggestionClick(sugg)}
                    className="px-4 py-2 hover:bg-[#6272a4] cursor-pointer"
                  >
                    {sugg.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              disabled={updating}
              className="flex items-center gap-2 bg-purple-400 py-3 px-6 rounded-md text-black font-bold transition-colors hover:bg-purple-300"
            >
              {updating ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaSave className="text-lg" />
              )}
              Update Skill
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600 py-3 px-6 rounded-md text-white font-bold transition-colors hover:bg-red-700"
            >
              {deleting ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaTrash className="text-lg" />
              )}
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
