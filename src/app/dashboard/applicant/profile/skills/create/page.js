"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FaSave,
  FaSpinner,
  FaCode,
  FaInfo,
} from "react-icons/fa";

export default function CreateSkillPage({ onSkillCreated = () => {} }) {
  const router = useRouter();
  const [skillName, setSkillName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // For skill suggestions:
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const isSubmittingRef = useRef(false);

  // Debounce and fetch skill suggestions when skillName has at least 2 characters
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-skills/suggestions`,
          {
            params: { query: skillName },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Check if the response contains a data array; if not, clear suggestions.
        const suggestionsData =
          response.data && Array.isArray(response.data.data)
            ? response.data.data
            : [];
        setSuggestions(suggestionsData);
        setShowSuggestions(suggestionsData.length > 0);
      } catch (err) {
        console.error("Suggestion error:", err);
        // If an error occurs, clear suggestions without showing an error to the user.
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    // Only fetch suggestions if the input is at least 2 characters long.
    if (skillName.trim().length >= 2) {
      const debounceTimeout = setTimeout(() => {
        fetchSuggestions();
      }, 300);
      return () => clearTimeout(debounceTimeout);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [skillName]);

  const handleSuggestionClick = (suggestion) => {
    setSkillName(suggestion.name);
    setShowSuggestions(false);
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-skills/`,
        { applicantProfileId, skillName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const createdSkill = res.data;
      onSkillCreated(createdSkill);
      // You can replace the alert with a custom modal if desired.
      alert("Skill created successfully!");
      router.push("/dashboard/applicant/profile/skills");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to create skill.";
      setError(errorMsg);
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-[#282a36] text-white p-6">
      <div className="max-w-2xl mx-auto bg-[#44475a] p-8 rounded-xl shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6">Create Skill</h1>
        <p className="text-center text-gray-300 mb-6 flex items-center justify-center gap-2 text-xs">
          <FaInfo className="text-lg" /> Enter the skill you want to add.
        </p>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div className="relative">
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaCode className="text-purple-400" /> Skill Name
            </label>
            <input
              type="text"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
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
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-purple-400 py-3 rounded-md text-black font-bold transition-colors hover:bg-purple-300"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaSave className="text-lg" />}
            Create Skill
          </button>
        </form>
      </div>
    </div>
  );
}
