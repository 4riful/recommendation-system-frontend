"use client";

import { useEffect, useState } from "react";
import axios from "axios";

/* --------------------------------------------------
 * HorizontalTimeline Component using DaisyUI Steps
 * -------------------------------------------------- */
function HorizontalTimeline({ status, createdAt, updatedAt }) {
  // Determine stage classes based on current status
  const isInReview = ["in_review", "accepted", "rejected"].includes(status);
  const isOutcome = ["accepted", "rejected"].includes(status);

  const submittedStep = "step-primary"; // Always active
  const inReviewStep = isInReview ? "step-info" : "step-secondary";
  const outcomeStep =
    status === "accepted"
      ? "step-success"
      : status === "rejected"
      ? "step-error"
      : "step-secondary";

  return (
    <ul className="steps steps-horizontal w-full my-6">
      <li className={`step ${submittedStep}`}>
        <div className="flex flex-col items-center">
          <span className="flex items-center gap-1">
            {/* Paper plane icon for Submitted */}
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="#8be9fd"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2l-6 20-4-9-9-4z" />
            </svg>
            Submitted
          </span>
          <span className="text-[10px] text-gray-400">
            {new Date(createdAt).toLocaleString()}
          </span>
        </div>
      </li>
      <li className={`step ${inReviewStep}`}>
        <div className="flex flex-col items-center">
          <span className="flex items-center gap-1">
            {/* Hourglass icon for In Review */}
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="#ff79c6"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 7c0 4 8 4 8 0" />
              <path d="M8 17c0-4 8-4 8 0" />
              <rect x="3" y="2" width="18" height="20" rx="2" ry="2" />
            </svg>
            In Review
          </span>
          {isInReview && (
            <span className="text-[10px] text-gray-400">
              {new Date(updatedAt).toLocaleString()}
            </span>
          )}
        </div>
      </li>
      <li className={`step ${outcomeStep}`}>
        <div className="flex flex-col items-center">
          <span className="flex items-center gap-1">
            {status === "accepted" ? (
              <>
                {/* Check icon for Accepted */}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="#50fa7b"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 10A9 9 0 1112 3a9 9 0 019 7z" />
                </svg>
                Accepted
              </>
            ) : status === "rejected" ? (
              <>
                {/* X icon for Rejected */}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="#ff5555"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                </svg>
                Rejected
              </>
            ) : (
              "Outcome"
            )}
          </span>
          {isOutcome && (
            <span className="text-[10px] text-gray-400">
              {new Date(updatedAt).toLocaleString()}
            </span>
          )}
        </div>
      </li>
    </ul>
  );
}

/* --------------------------------------------------
 * Main Page Component
 * -------------------------------------------------- */
export default function ApplicantApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Withdraw function: Sends a DELETE request and removes the application on success.
  const handleWithdraw = async (applicationId) => {
    if (!confirm("Are you sure you want to withdraw your application?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications((prev) => prev.filter((app) => app.application_id !== applicationId));
    } catch (err) {
      console.error("Failed to withdraw application:", err);
      alert("Failed to withdraw application.");
    }
  };

  // Fetch applications on component mount.
  useEffect(() => {
    async function fetchApps() {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const applicantProfileId = localStorage.getItem("applicantProfileId");
      if (!applicantProfileId) {
        setError("No applicant profile found. Please create one first.");
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/applications/applicant/${applicantProfileId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data && data.data) {
          setApplications(data.data);
        } else {
          setError("No application data found.");
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to fetch applications.");
      } finally {
        setLoading(false);
      }
    }
    fetchApps();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#282a36]">
        <div className="flex items-center space-x-4">
          <span className="loading loading-spinner loading-lg text-[#8be9fd]" />
          <span className="text-xl font-medium text-[#f8f8f2]">Loading applications...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#282a36]">
        <p className="text-red-400 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-8xl">
        {applications.length === 0 ? (
          <p className="text-[#f8f8f2] text-lg text-center">
            You have not applied for any jobs yet.
          </p>
        ) : (
          <div className="space-y-8">
            {applications.map((app) => (
              <div
                key={app.application_id}
                className="card bg-[#44475a] shadow-xl rounded-lg p-8 relative"
              >
                {/* Withdraw Button at Bottom Right */}
                {(app.application_status === "submitted" ||
                  app.application_status === "in_review") && (
                  <div className="absolute bottom-4 right-4">
                    <button
                      onClick={() => handleWithdraw(app.application_id)}
                      className="btn btn-error btn-sm flex items-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1.1 14.4a2 2 0 01-2 1.6H8.1a2 2 0 01-2-1.6L5 6m5 0V4a1 1 0 011-1h2a1 1 0 011 1v2" />
                      </svg>
                      <span>Withdraw</span>
                    </button>
                  </div>
                )}

                {/* Job Header */}
                <h2 className="text-3xl font-bold text-[#50fa7b] mb-6 text-center">
                  {app.job_title || "Untitled Job"}
                </h2>

                {/* Timeline */}
                <HorizontalTimeline
                  status={app.application_status}
                  createdAt={app.created_at}
                  updatedAt={app.last_updated}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
