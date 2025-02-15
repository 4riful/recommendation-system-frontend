"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

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

      // Role-based redirect logic
      if (user.role === "applicant") {
        if (user.applicantProfileId) {
          localStorage.setItem("applicantProfileId", user.applicantProfileId);
          router.push("/dashboard/applicant");
        } else {
          localStorage.removeItem("applicantProfileId");
          router.push("/dashboard/applicant/profile/create");
        }
      } else if (user.role === "recruiter") {
        if (user.recruiterProfileId) {
          localStorage.setItem("recruiterProfileId", user.recruiterProfileId);
        } else {
          localStorage.removeItem("recruiterProfileId");
        }
        router.push("/dashboard/recruiter");
      } else if (user.role === "superadmin") {
        router.push("/dashboard/superadmin");
      } else {
        setError("Invalid user role. Please contact support.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        w-full
        bg-gradient-to-br
        from-[#282a36]
        to-[#44475a]
        flex
        items-center
        justify-center
        px-4
      "
    >
      {/* Glassmorphism Card */}
      <div
        className="
          w-full
          max-w-md
          bg-[#44475a]/60
          backdrop-blur-md
          rounded-xl
          p-8
          shadow-lg
        "
      >
        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-[#f8f8f2] mb-6">
          Welcome Back!
        </h1>

        {/* Error Message */}
        {error && (
          <p className="text-center text-[#ff5555] mb-4">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-[#f8f8f2] font-medium mb-1">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute top-1/2 left-3 -translate-y-1/2 text-[#50fa7b]" /> {/* Dracula Green */}
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="
                  w-full
                  pl-10
                  pr-4
                  py-2
                  rounded-md
                  bg-[#282a36]/40
                  text-[#f8f8f2]
                  placeholder-[#6272a4]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#bd93f9]
                "
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[#f8f8f2] font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute top-1/2 left-3 -translate-y-1/2 text-[#50fa7b]" /> {/* Dracula Green */}
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="
                  w-full
                  pl-10
                  pr-10
                  py-2
                  rounded-md
                  bg-[#282a36]/40
                  text-[#f8f8f2]
                  placeholder-[#6272a4]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#bd93f9]
                "
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-[#f8f8f2]"
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              py-2
              rounded-md
              bg-[#bd93f9]
              text-[#282a36]
              font-bold
              hover:bg-[#caa1f9]
              transition-colors
            "
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Footer Links */}
        <div className="flex justify-between text-sm text-[#f8f8f2] mt-5">
          <a href="/forgot-password" className="hover:underline">
            Forgot Password?
          </a>
          <a href="/register" className="hover:underline">
            Create an Account
          </a>
        </div>
      </div>
    </div>
  );
}
