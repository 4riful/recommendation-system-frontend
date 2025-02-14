"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

export default function SettingsPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Fetch user details on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User not found in local storage.");
      return;
    }
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setEmail(res.data.email);
        setUsername(res.data.username);
        setPhoneNumber(res.data.phone_number);
      })
      .catch(() => setError("Failed to load user settings."));
  }, []);

  // Update username and phone number
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`,
        { username, phone_number: phoneNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Settings updated successfully.");
    } catch (err) {
      setError("Failed to update settings. Please try again.");
    }
  };

  // Redirect to forgot-password page to change password
  const handleChangePassword = () => {
    router.push(`/forgot-password?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-h-screen bg-neutral text-white flex items-center justify-center p-6">
      <div className="card bg-gray-800 shadow-xl w-full max-w-lg">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2">
            <UserIcon className="w-6 h-6" />
            Account Settings
          </h2>

          {error && <div className="alert alert-error mt-2">{error}</div>}
          {success && <div className="alert alert-success mt-2">{success}</div>}

          <form onSubmit={handleUpdate} className="space-y-4 mt-4">
            {/* Username */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  <UserIcon className="w-4 h-4 inline mr-2" />
                  Username
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered bg-gray-700 text-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  <PhoneIcon className="w-4 h-4 inline mr-2" />
                  Phone Number
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered bg-gray-700 text-white"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            {/* Email (read-only) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  <EnvelopeIcon className="w-4 h-4 inline mr-2" />
                  Email
                </span>
              </label>
              <input
                type="email"
                className="input input-bordered bg-gray-700 text-white cursor-not-allowed"
                value={email}
                disabled
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
            </div>

            <div className="flex items-center gap-4">
              <button type="submit" className="btn btn-primary flex-1">
                Update Info
              </button>
              <button
                type="button"
                onClick={handleChangePassword}
                className="btn btn-secondary flex-1"
              >
                <LockClosedIcon className="w-5 h-5 mr-2" />
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
