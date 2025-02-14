"use client";

import { useState } from "react";
import axios from "axios";

export default function CreateProfileForm({ onProfileCreated }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [languages, setLanguages] = useState("");
  const [languageProficiency, setLanguageProficiency] = useState("");
  const [preferredSalaryRange, setPreferredSalaryRange] = useState("");
  const [intro, setIntro] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId"); // or parse from your JWT if needed

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-profiles`,
        {
          user_id: userId,
          first_name: firstName,
          last_name: lastName,
          gender,
          languages,
          language_proficiency: languageProficiency,
          preferred_salary_range: preferredSalaryRange,
          intro,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onProfileCreated(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded">
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <label className="block mb-1">First Name</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-gray-700"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1">Last Name</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-gray-700"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1">Gender</label>
        <select
          className="w-full p-2 rounded bg-gray-700"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="NonBinary">NonBinary</option>
          <option value="Other">Other</option>
          <option value="PreferNotToSay">PreferNotToSay</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">Languages</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-gray-700"
          value={languages}
          onChange={(e) => setLanguages(e.target.value)}
          placeholder="e.g., English, Spanish"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Language Proficiency</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-gray-700"
          value={languageProficiency}
          onChange={(e) => setLanguageProficiency(e.target.value)}
          placeholder="e.g., Fluent, Intermediate"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Preferred Salary Range</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-gray-700"
          value={preferredSalaryRange}
          onChange={(e) => setPreferredSalaryRange(e.target.value)}
          placeholder="e.g., $50,000-$70,000"
        />
      </div>

      <div>
        <label className="block mb-1">Introduction</label>
        <textarea
          className="w-full p-2 rounded bg-gray-700"
          rows={3}
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-primary py-2 rounded font-bold"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Profile"}
      </button>
    </form>
  );
}
