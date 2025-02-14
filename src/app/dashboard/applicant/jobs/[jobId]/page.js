"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaHeart, FaBookmark, FaPaperPlane, FaGraduationCap } from "react-icons/fa";
import { MdLocationPin, MdWork, MdAttachMoney, MdCheckCircle } from "react-icons/md";
import { HiOutlineCalendarDays } from "react-icons/hi2";

export default function JobDetailPage() {
  const { jobId } = useParams();
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [interactionLoading, setInteractionLoading] = useState(false);
  const [interactionError, setInteractionError] = useState("");

  const applicantProfileId =
    typeof window !== "undefined" && localStorage.getItem("applicantProfileId");
  const token = typeof window !== "undefined" && localStorage.getItem("token");

  /***********************************************
   * 1. Fetch Job Details on Mount
   ***********************************************/
  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) {
          setJob(res.data.data);
        } else {
          setError("Failed to load job details.");
        }
      } catch (err) {
        setError("An error occurred while fetching job details.");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId, token]);

  /***********************************************
   * 2. User Interactions: Like or Save
   ***********************************************/
  const handleInteraction = async (interactionType) => {
    if (!applicantProfileId) {
      setInteractionError(
        "No applicant profile ID found. Please create a profile first."
      );
      return;
    }

    setInteractionLoading(true);
    setInteractionError("");

    try {
      const payload = {
        applicantProfileId,
        job_id: jobId,
        interaction_type: interactionType,
        interaction_context: `User performed ${interactionType} on job detail page.`,
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/job-interactions`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.data.data) {
        setInteractionError("Failed to record interaction.");
      }
    } catch (err) {
      setInteractionError("An error occurred while recording interaction.");
    } finally {
      setInteractionLoading(false);
    }
  };

  /***********************************************
   * 3. Redirect to the Apply Page
   ***********************************************/
  const goToApplyPage = () => {
    if (!applicantProfileId) {
      setInteractionError(
        "No applicant profile ID found. Please create a profile first."
      );
      return;
    }
    router.push(`/dashboard/applicant/jobs/${jobId}/apply`);
  };

  /***********************************************
   * 4. Render Loading/Error
   ***********************************************/
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <AiOutlineLoading3Quarters className="animate-spin text-dracula-purple text-4xl" />
      </div>
    );
  }

  if (error) {
    return <div className="text-dracula-orange text-center">{error}</div>;
  }

  if (!job) {
    return (
      <div className="text-dracula-comment text-center">
        No job details found.
      </div>
    );
  }

  /***********************************************
   * 5. Render Job Details
   ***********************************************/
  return (
    <div className="p-8 space-y-8 bg-dracula-bg text-dracula-foreground rounded-lg shadow-lg">
      {/* Job Title + Department */}
      <div className="flex flex-col items-start space-y-2">
        <h1 className="text-4xl font-extrabold">{job.job_title}</h1>
        <p className="text-dracula-comment">
          Department:{" "}
          <span className="text-dracula-foreground font-semibold">
            {job.department || "N/A"}
          </span>
        </p>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-dracula-selection p-6 rounded-lg shadow-inner">
        <InfoRow
          icon={<MdAttachMoney className="text-dracula-purple text-3xl" />}
          label="Salary"
          value={job.salary || "Not specified"}
        />
        <InfoRow
          icon={<MdWork className="text-dracula-purple text-3xl" />}
          label="Job Type"
          value={job.job_type || "N/A"}
        />
        <InfoRow
          icon={<MdLocationPin className="text-dracula-purple text-3xl" />}
          label="Location"
          value={`${job.city || "N/A"}, ${job.state || ""}, ${job.country || ""}`}
        />
        <InfoRow
          icon={<MdCheckCircle className="text-dracula-purple text-3xl" />}
          label="Status"
          value={job.job_status}
        />
        <InfoRow
          icon={<HiOutlineCalendarDays className="text-dracula-purple text-3xl" />}
          label="Deadline"
          value={
            job.application_deadline
              ? new Date(job.application_deadline).toLocaleDateString()
              : "No deadline"
          }
        />
        <InfoRow
          icon={<FaGraduationCap className="text-dracula-purple text-3xl" />}
          label="Qualifications"
          value={job.qualifications_required || "Not specified"}
        />
      </div>

      {/* Description */}
      <div className="bg-dracula-selection p-6 rounded-lg shadow-inner">
        <h2 className="text-2xl font-bold text-dracula-purple">Job Description</h2>
        <p className="text-dracula-foreground mt-4 whitespace-pre-wrap">
          {job.description || "No description available."}
        </p>
      </div>

      {/* Interaction / Actions */}
      <div className="flex flex-wrap items-center gap-4">
        <ActionButton
          label="Like"
          icon={<FaHeart className="text-dracula-yellow" />}
          onClick={() => handleInteraction("liked")}
          disabled={interactionLoading}
        />
        <ActionButton
          label="Save"
          icon={<FaBookmark className="text-dracula-red" />}
          onClick={() => handleInteraction("saved")}
          disabled={interactionLoading}
        />
        <ActionButton
          label="Apply"
          icon={<FaPaperPlane className="text-dracula-green" />}
          onClick={goToApplyPage}
          disabled={interactionLoading}
        />
      </div>

      {interactionError && (
        <p className="text-dracula-orange mt-4 text-center font-semibold">
          {interactionError}
        </p>
      )}
    </div>
  );
}

/***********************************************
 * InfoRow (for each detail row)
 ***********************************************/
function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center space-x-4">
      {icon}
      <div>
        <span className="font-semibold text-dracula-purple">{label}</span>
        <div className="text-dracula-foreground">{value}</div>
      </div>
    </div>
  );
}

/***********************************************
 * ActionButton (like, save, apply)
 ***********************************************/
function ActionButton({ label, icon, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 px-6 py-3 rounded-lg bg-dracula-purple text-dracula-bg font-bold
                 hover:bg-dracula-purple hover:text-dracula-foreground transition-colors 
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="text-dracula-purple">{icon}</span>
      {label}
    </button>
  );
}

