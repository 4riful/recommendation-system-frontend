"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CloudinaryUploadWidget } from "../../../../../../components/CloudinaryUploadWidget";
import { 
  FaEdit, 
  FaSpinner, 
  FaUser, 
  FaUserTie, 
  FaVenusMars, 
  FaGlobe, 
  FaDollarSign, 
  FaInfoCircle 
} from "react-icons/fa";

export default function EditApplicantProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    profile_picture_path: "",
    first_name: "",
    last_name: "",
    gender: "",
    languages: "",
    language_proficiency: "",
    preferred_salary_range: "",
    intro: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Get token and applicant profile ID from localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const applicantProfileId =
    typeof window !== "undefined" ? localStorage.getItem("applicantProfileId") : null;

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    if (!applicantProfileId) {
      router.push("/dashboard/applicant/profile");
      return;
    }
    // Fetch current profile details
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-profiles/${applicantProfileId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, applicantProfileId, router]);

  // Handle profile update submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-profiles/${applicantProfileId}`,
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push("/dashboard/applicant/profile");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  // Handle profile deletion
  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete your profile? This action cannot be undone."
    );
    if (!confirmDelete) return;
    setDeleting(true);
    setError("");
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-profiles/${applicantProfileId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("applicantProfileId");
      router.push("/register");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete profile.");
    } finally {
      setDeleting(false);
    }
  };

  // Handle profile picture upload using Cloudinary
  const handleProfilePictureUpload = async (cloudinaryUrl) => {
    try {
      setUploading(true);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-profiles/${applicantProfileId}`,
        { profile_picture_path: cloudinaryUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile((prev) => ({
        ...prev,
        profile_picture_path: res.data.profile_picture_path,
      }));
      alert("Profile picture updated successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update profile picture");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-900 rounded-xl shadow-2xl text-white">
      <h1 className="text-3xl font-bold text-center mb-2">Update Your Profile</h1>
      <p className="text-center text-gray-300 mb-8">
        Make a lasting impression on employers by keeping your profile updated!
      </p>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <form onSubmit={handleUpdate} className="space-y-8">
        {/* Top Section: Profile Picture & Name */}
        <div className="flex flex-col md:flex-row items-center gap-6 bg-gray-800 p-6 rounded-lg shadow-md">
          {/* Profile Picture with Cloudinary Upload */}
          <div className="relative w-40 h-40 group">
            <img
              src={profile.profile_picture_path || "/placeholder-avatar.png"}
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
          {/* Name Fields */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                <FaUser className="text-lg text-blue-400" /> First Name
              </label>
              <input
                type="text"
                value={profile.first_name || ""}
                onChange={(e) =>
                  setProfile({ ...profile, first_name: e.target.value })
                }
                className="w-full px-4 py-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                <FaUserTie className="text-lg text-blue-400" /> Last Name
              </label>
              <input
                type="text"
                value={profile.last_name || ""}
                onChange={(e) =>
                  setProfile({ ...profile, last_name: e.target.value })
                }
                className="w-full px-4 py-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>
        </div>

        {/* Grid Section: Other Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gender (Dropdown) */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <FaVenusMars className="text-lg text-blue-400" /> Gender
            </label>
            <select
              value={profile.gender || ""}
              onChange={(e) =>
                setProfile({ ...profile, gender: e.target.value })
              }
              className="w-full px-4 py-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="NonBinary">NonBinary</option>
              <option value="Other">Other</option>
              <option value="PreferNotToSay">Prefer Not To Say</option>
            </select>
          </div>
          {/* Languages */}
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaGlobe className="text-lg text-blue-400" /> Languages
            </label>
            <input
              type="text"
              value={profile.languages || ""}
              onChange={(e) =>
                setProfile({ ...profile, languages: e.target.value })
              }
              className="w-full px-4 py-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          {/* Language Proficiency */}
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaGlobe className="text-lg text-blue-400" /> Proficiency
            </label>
            <input
              type="text"
              value={profile.language_proficiency || ""}
              onChange={(e) =>
                setProfile({ ...profile, language_proficiency: e.target.value })
              }
              className="w-full px-4 py-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          {/* Preferred Salary Range */}
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaDollarSign className="text-lg text-blue-400" /> Salary Range
            </label>
            <input
              type="text"
              value={profile.preferred_salary_range || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  preferred_salary_range: e.target.value,
                })
              }
              className="w-full px-4 py-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {/* Introduction */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaInfoCircle className="text-lg text-blue-400" /> Introduction
            </label>
            <textarea
              value={profile.intro || ""}
              onChange={(e) => setProfile({ ...profile, intro: e.target.value })}
              className="w-full px-4 py-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="4"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 py-2 px-6 rounded-md text-white font-bold transition-colors"
            disabled={updating}
          >
            {updating ? "Updating..." : "Update Profile"}
          </button>
          <button
            type="button"
            className="bg-red-600 hover:bg-red-700 py-2 px-6 rounded-md text-white font-bold transition-colors"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
