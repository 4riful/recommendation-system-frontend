"use client";

import { useState } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // We need both userId and email in query params for full functionality
  const userId = searchParams.get("userId");
  const email = searchParams.get("email");

  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // For Resend Email feedback
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");

  /**
   * Handle the email verification submission
   */
  const handleVerification = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/verify-email`, {
        userId,
        verificationCode,
      });
      setMessage("Email verified successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid verification code.");
    }
  };

  /**
   * Handle resend verification email
   */
  const handleResendVerification = async () => {
    // Clear old messages
    setResendMessage("");
    setResendError("");

    try {
      // /api/users/resend-verification expects { userId }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/resend-verification`, {
        userId,
      });
      setResendMessage(response.data.message || "Verification email resent successfully.");
    } catch (err) {
      setResendError(err.response?.data?.message || "Could not resend verification email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral text-white">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Verify Email</h1>

        <p className="text-sm text-gray-400 text-center mb-4">
          Please enter the verification code sent to{" "}
          <span className="text-accent">{email}</span>.
        </p>

        {/* Success / Error messages for verification */}
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleVerification}>
          <div className="mb-4">
            <label className="block text-sm mb-2">Verification Code</label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded text-white focus:outline-none"
              placeholder="Enter the code"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mb-4 bg-primary rounded text-white font-bold hover:bg-primary/80 transition"
          >
            Verify Email
          </button>
        </form>

        {/* Resend verification section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400 mb-2">Didn’t receive the code?</p>
          <button
            onClick={handleResendVerification}
            className="btn btn-accent btn-sm font-semibold hover:scale-105 transition-transform"
            disabled={!userId} // Ensure we have a userId
          >
            Resend Verification
          </button>
        </div>

        {/* Messages for resend attempt */}
        {resendMessage && <p className="text-green-400 text-center mt-4">{resendMessage}</p>}
        {resendError && <p className="text-red-400 text-center mt-4">{resendError}</p>}
      </div>
    </div>
  );
}
