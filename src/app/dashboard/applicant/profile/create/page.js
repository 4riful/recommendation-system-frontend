"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CloudinaryUploadWidget } from "../../../../../components/CloudinaryUploadWidget";
import {
  FaUser,
  FaUserTie,
  FaVenusMars,
  FaGlobe,
  FaDollarSign,
  FaInfoCircle,
  FaEdit,
  FaSpinner,
} from "react-icons/fa";

// Default static placeholder if no name is provided
const DEFAULT_PLACEHOLDER =
  "https://ui-avatars.com/api/?name=Avatar&background=6272a4&color=f8f8f2";

export default function CreateProfileForm({ onProfileCreated = () => {} }) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [languages, setLanguages] = useState("");
  const [languageProficiency, setLanguageProficiency] = useState("");
  const [preferredSalaryRange, setPreferredSalaryRange] = useState("");
  const [intro, setIntro] = useState("");
  const [profilePicturePath, setProfilePicturePath] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Ref to prevent duplicate submissions
  const isSubmittingRef = useRef(false);

  // Compute dynamic avatar URL based on first & last name
  // If a profile picture has been uploaded, use that.
  const dynamicAvatarUrl =
    profilePicturePath ||
    (firstName || lastName
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
          firstName + " " + lastName
        )}&background=6272a4&color=f8f8f2`
      : DEFAULT_PLACEHOLDER);

  // Handle Cloudinary upload
  const handleProfilePictureUpload = async (cloudinaryUrl) => {
    console.log("Cloudinary upload success. URL:", cloudinaryUrl);
    try {
      setUploading(true);
      setProfilePicturePath(cloudinaryUrl);
      alert("Profile picture selected successfully!");
    } catch (err) {
      console.error("Cloudinary error:", err);
      alert("Failed to select profile picture. Please try again.");
    } finally {
      setUploading(false);
      console.log("Cloudinary upload process finished.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingRef.current) {
      console.log("Duplicate submission prevented.");
      return;
    }
    isSubmittingRef.current = true;
    console.log("Submitting profile creation...");

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      console.log("Retrieved token and userId:", { token, userId });

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-profiles`,
        {
          user_id: userId,
          // Use dynamic avatar URL if no image has been uploaded.
          profile_picture_path: dynamicAvatarUrl,
          first_name: firstName,
          last_name: lastName,
          gender,
          languages,
          language_proficiency: languageProficiency,
          preferred_salary_range: preferredSalaryRange,
          intro,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newProfile = res.data;
      console.log("Profile creation response:", newProfile);

      if (newProfile.applicantProfileId) {
        localStorage.setItem("applicantProfileId", newProfile.applicantProfileId);
        console.log("Stored applicantProfileId:", newProfile.applicantProfileId);
      }

      onProfileCreated(newProfile);
      // Delay redirection by 1 second for better UX
      setTimeout(() => {
        router.push("/dashboard/applicant/profile");
      }, 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to create profile.";
      console.error("Error creating profile:", errorMsg);

      if (errorMsg.includes("already has an applicant profile")) {
        alert("You already have a profile. Redirecting you to your profile page.");
        router.push("/dashboard/applicant/profile");
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
      console.log("Submission finished.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-gray-800 p-8 rounded-xl shadow-xl"
    >
      {error && <div className="text-red-500 text-center">{error}</div>}

      <h2 className="text-2xl font-bold text-center mb-4 text-white">
        Create Your Profile
      </h2>
      <p className="text-center text-gray-300 mb-6">
        Let employers get to know you. Fill in the details below and make a lasting impression!
      </p>

      {/* Profile Picture Upload */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-40 h-40 group">
          <img
            src={dynamicAvatarUrl}
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover border-4 border-blue-400"
          />
          <CloudinaryUploadWidget
            preset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
            onUploadSuccess={handleProfilePictureUpload}
          >
            <button
              type="button"
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 opacity-0 group-hover:opacity-100 transition duration-300 rounded-full"
              disabled={uploading}
            >
              {uploading ? (
                <FaSpinner className="animate-spin text-white text-xl" />
              ) : (
                <FaEdit className="text-white text-xl" />
              )}
            </button>
          </CloudinaryUploadWidget>
        </div>
      </div>

      {/* First & Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-2 text-white">
            <FaUser className="text-blue-400" /> First Name
          </label>
          <input
            type="text"
            className="w-full p-3 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="e.g., John"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            Enter your first name as it appears on your resume.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-2 text-white">
            <FaUserTie className="text-blue-400" /> Last Name
          </label>
          <input
            type="text"
            className="w-full p-3 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="e.g., Doe"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            Enter your last name as it appears on your resume.
          </p>
        </div>
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium mb-1 flex items-center gap-2 text-white">
          <FaVenusMars className="text-blue-400" /> Gender
        </label>
        <select
          className="w-full p-3 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="NonBinary">NonBinary</option>
          <option value="Other">Other</option>
          <option value="PreferNotToSay">Prefer Not To Say</option>
        </select>
        <p className="text-xs text-gray-400 mt-1">
          Select your gender identity.
        </p>
      </div>

      {/* Languages */}
      <div>
        <label className="block text-sm font-medium mb-1 flex items-center gap-2 text-white">
          <FaGlobe className="text-blue-400" /> Languages
        </label>
        <input
          type="text"
          className="w-full p-3 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={languages}
          onChange={(e) => setLanguages(e.target.value)}
          placeholder="e.g., English, Spanish"
          required
        />
        <p className="text-xs text-gray-400 mt-1">
          List the languages you speak, separated by commas.
        </p>
      </div>

      {/* Language Proficiency */}
      <div>
        <label className="block text-sm font-medium mb-1 flex items-center gap-2 text-white">
          <FaGlobe className="text-blue-400" /> Language Proficiency
        </label>
        <input
          type="text"
          className="w-full p-3 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={languageProficiency}
          onChange={(e) => setLanguageProficiency(e.target.value)}
          placeholder="e.g., Fluent, Intermediate"
          required
        />
        <p className="text-xs text-gray-400 mt-1">
          Indicate your proficiency level in each language.
        </p>
      </div>

      {/* Preferred Salary Range */}
      <div>
        <label className="block text-sm font-medium mb-1 flex items-center gap-2 text-white">
          <FaDollarSign className="text-blue-400" /> Preferred Salary Range
        </label>
        <input
          type="text"
          className="w-full p-3 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={preferredSalaryRange}
          onChange={(e) => setPreferredSalaryRange(e.target.value)}
          placeholder="e.g., $50,000-$70,000"
        />
        <p className="text-xs text-gray-400 mt-1">
          (Optional) Enter your expected salary range.
        </p>
      </div>

      {/* Introduction */}
      <div>
        <label className="block text-sm font-medium mb-1 flex items-center gap-2 text-white">
          <FaInfoCircle className="text-blue-400" /> Introduction
        </label>
        <textarea
          className="w-full p-3 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          placeholder="Tell us about yourself, your experience, and your passion..."
        />
        <p className="text-xs text-gray-400 mt-1">
          Provide a brief introduction highlighting your strengths and experiences.
        </p>
      </div>

      {/* Submit Button with Spinner */}
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-primary py-3 rounded-md text-white font-bold transition-colors hover:bg-primary/80"
        disabled={loading}
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" /> Creating...
          </>
        ) : (
          "Create Profile"
        )}
      </button>
    </form>
  );
}
