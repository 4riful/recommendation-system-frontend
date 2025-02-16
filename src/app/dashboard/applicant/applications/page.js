"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { FaFrown } from "react-icons/fa";

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
    <>
      {/* Custom CSS overrides using only Dracula colors */}
      <style jsx>{`
        /* Submitted: step-primary using cyan and purple */
        .step-primary[data-content]:before {
          background: linear-gradient(135deg, #8be9fd, #bd93f9);
          border: .5px solid #bd93f9;
        }
        /* In Review: step-info using pink and purple */
        .step-info[data-content]:before {
          background: linear-gradient(135deg, #ff79c6, #bd93f9);
          border: .5px solid #bd93f9;
        }
        /* Accepted: step-success using green and cyan */
        .step-success[data-content]:before {
          background: linear-gradient(135deg, #50fa7b, #8be9fd);
          border: .5px solid #bd93f9;
        }
        /* Rejected: step-error using red and pink */
        .step-error[data-content]:before {
          background: linear-gradient(135deg, #ff5555, #ff79c6);
          border: .5px solid #bd93f9;
        }
        /* Inactive: step-secondary using dark gray background */
        .step-secondary[data-content]:before {
          background: #44475a;
          border: .5px solid #bd93f9;
        }
      `}</style>

      <ul className="steps steps-horizontal w-full my-6 justify-center">
        {/* Step 1: Submitted */}
        <li className={`step ${submittedStep}`} data-content="1">
          <div className="flex flex-col items-center mt-4">
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

        {/* Step 2: In Review */}
        <li className={`step ${inReviewStep}`} data-content="2">
          <div className="flex flex-col items-center mt-4">
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

        {/* Step 3: Accepted/Rejected/Outcome */}
        <li className={`step ${outcomeStep}`} data-content="3">
          <div className="flex flex-col items-center mt-4">
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
    </>
  );
}

/* --------------------------------------------------
 * Main Page Component: ApplicantApplicationsPage
 * -------------------------------------------------- */
export default function ApplicantApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Define fetchApps as a useCallback so we can call it on demand.
  const fetchApps = useCallback(async () => {
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

      // If API returns an array of applications
      if (data && Array.isArray(data.data) && data.data.length > 0) {
        setApplications(data.data);
      } else {
        // Gracefully handle empty applications
        setApplications([]);
        setError("You have not applied for any jobs yet.");
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
      if (err.response?.status === 404) {
        // Graceful error message for 404
        setApplications([]);
        setError("No applications found. You haven't applied for any jobs yet.");
      } else {
        setError("Failed to fetch applications.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch applications on component mount.
  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#282a36]">
        <div className="flex flex-col items-center space-y-4">
          <span className="loading loading-spinner loading-lg text-[#8be9fd]" />
          <span className="text-xl font-medium text-[#f8f8f2]">
            Loading applications...
          </span>
        </div>
      </div>
    );
  }

  // If error exists (including 404) and no applications
  if (error && applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#282a36]">
        <FaFrown className="text-6xl text-red-500 mb-4" />
        <p className="text-xl text-[#f8f8f2] text-center">{error}</p>
        <button
          onClick={fetchApps}
          className="mt-4 btn btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#282a36] py-8 px-4">
      <div className="max-w-8xl mx-auto">
        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <FaFrown className="text-6xl text-red-500 mb-4" />
            <p className="text-[#f8f8f2] text-lg text-center">
              You have not applied for any jobs yet.
            </p>
            <button onClick={fetchApps} className="mt-4 btn btn-primary">
              Refresh
            </button>
          </div>
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
