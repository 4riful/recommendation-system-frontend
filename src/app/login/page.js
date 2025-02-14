"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`,
        { email, password }
      );

      const { user, token } = response.data;
      
      // Store token, role, and userId in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userId", user.user_id);

      // For applicants, store applicantProfileId if available
      if (user.role === "applicant" && user.applicantProfileId) {
        localStorage.setItem("applicantProfileId", user.applicantProfileId);
      } else {
        localStorage.removeItem("applicantProfileId");
      }

      // For recruiters, store recruiterProfileId if available
      if (user.role === "recruiter" && user.recruiterProfileId) {
        localStorage.setItem("recruiterProfileId", user.recruiterProfileId);
      } else {
        localStorage.removeItem("recruiterProfileId");
      }

      // Redirect based on role
      switch (user.role) {
        case "applicant":
          router.push("/dashboard/applicant");
          break;
        case "recruiter":
          router.push("/dashboard/recruiter");
          break;
        case "superadmin":
          router.push("/dashboard/superadmin");
          break;
        default:
          setError("Invalid user role. Please contact support.");
          break;
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral text-white flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-3 top-2.5 text-white"
              aria-label="Toggle password visibility"
            >
              {passwordVisible ? "🙈" : "👁️"}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-primary py-2 rounded text-white font-bold hover:bg-primary/80 transition-colors"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <div className="text-center mt-4 flex justify-between">
          <a href="/forgot-password" className="text-sm text-accent hover:underline">
            Forgot Password?
          </a>
          <a href="/register" className="text-sm text-primary hover:underline">
            Create an Account
          </a>
        </div>
      </div>
    </div>
  );
}
