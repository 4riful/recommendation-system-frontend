"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Pre-fill the email from query params (if present)
  const initialEmail = searchParams.get("email") || "";
  
  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/reset-password`, {
        email,
        token,
        newPassword,
      });
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid token or email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral text-white flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Reset Your Password</h1>

        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleReset}>
          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded text-white focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>
          
          {/* Token Field */}
          <div className="mb-4">
            <label className="block text-sm mb-2">Reset Token</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded text-white focus:outline-none"
              placeholder="Enter the token from your email"
              required
            />
          </div>

          {/* New Password Field */}
          <div className="mb-4">
            <label className="block text-sm mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded text-white focus:outline-none"
              placeholder="Enter your new password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary py-2 rounded text-white font-bold hover:bg-primary/80 transition-colors"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
