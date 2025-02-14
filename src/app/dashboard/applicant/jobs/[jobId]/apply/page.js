"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  AiOutlineLoading3Quarters,
  AiOutlineCloudUpload,
  AiFillCheckCircle,
  AiFillExclamationCircle,
  AiOutlineApartment,
  AiOutlineHome,
} from "react-icons/ai";
import { FiFileText, FiMapPin } from "react-icons/fi";

export default function JobApplyPage() {
  const router = useRouter();
  const { jobId } = useParams();

  // States for the job and the form
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // CV file states
  const [cvFile, setCvFile] = useState(null);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvUrl, setCvUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  // For feedback on submission
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState(false);

  // Environment variables
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const applicantProfileId =
    typeof window !== "undefined" && localStorage.getItem("applicantProfileId");
  const token =
    typeof window !== "undefined" && localStorage.getItem("token");

  // Validate environment variables
  useEffect(() => {
    if (!cloudName || !uploadPreset) {
      setError("Cloudinary configuration is missing in environment variables.");
    }
  }, [cloudName, uploadPreset]);

  /***********************************************
   * 1. Fetch Job Details
   ***********************************************/
  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(`${apiUrl}/api/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setJob(res.data.data);
        } else {
          setError("Failed to load job data.");
        }
      } catch (err) {
        setError("An error occurred while fetching job data.");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId, token, apiUrl]);

  /***********************************************
   * 2. Handle File Upload to Cloudinary
   ***********************************************/
  const handleCvUpload = async () => {
    if (!cvFile) {
      setApplyError("Please select a CV file to upload.");
      return;
    }

    setCvUploading(true);
    setApplyError("");
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", cvFile);
      formData.append("upload_preset", uploadPreset);

      // Real-time progress
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentage);
          },
        }
      );

      if (res.data.secure_url) {
        setCvUrl(res.data.secure_url);
      } else {
        setApplyError("Failed to upload CV to Cloudinary.");
      }
    } catch (err) {
      setApplyError("An error occurred during CV upload.");
    } finally {
      setCvUploading(false);
    }
  };

  /***********************************************
   * 3. Submit Application
   ***********************************************/
  const handleApply = async (e) => {
    e.preventDefault();
    setApplyError("");
    setApplySuccess(false);

    if (!applicantProfileId) {
      setApplyError("No applicant profile ID found. Please create a profile first.");
      return;
    }

    if (!cvUrl) {
      setApplyError("Please upload a CV before submitting.");
      return;
    }

    setApplying(true);
    try {
      const payload = {
        job_id: jobId,
        applicantProfileId,
        cv_path: cvUrl,
      };

      const res = await axios.post(`${apiUrl}/api/applications`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setApplySuccess(true);
        setTimeout(() => {
          router.push("/dashboard/applicant/applications");
        }, 1500);
      } else {
        setApplyError("Failed to create application.");
      }
    } catch (err) {
      if (err.response) {
        setApplyError(
          err.response.data.message || "An error occurred during application submission."
        );
      } else {
        setApplyError("An error occurred during application submission.");
      }
    } finally {
      setApplying(false);
    }
  };

  /***********************************************
   * 4. Loading or Error States
   ***********************************************/
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-white">
        <AiOutlineLoading3Quarters className="animate-spin text-primary text-6xl" />
        <p className="mt-4 text-lg">Loading Job Details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error max-w-lg mx-auto mt-8 flex items-center gap-2">
        <AiFillExclamationCircle className="text-xl" />
        <span>{error}</span>
      </div>
    );
  }

  /***********************************************
   * 5. Render Page
   ***********************************************/
  return (
    <div className="min-h-screen bg-gray-900 text-green py-8 px-6 md:px-16">
      <h1 className="text-3xl font-bold text-center mb-8">Apply for Job</h1>

      {job && (
        <div className="mb-8 mx-auto max-w-4xl p-6 bg-gray-800 rounded-2xl shadow-md space-y-4">
          <h2 className="text-2xl font-semibold">{job.job_title}</h2>
          <p className="text-sm text-gray-300">{job.description || "No description available."}</p>
          <div className="flex items-center gap-4 mt-4 text-gray-400">
            <AiOutlineApartment className="text-xl" />
            <span>Department: {job.department || "N/A"}</span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-gray-400">
            <FiMapPin className="text-xl" />
            <span>
              Location: {job.city || "N/A"}
              {job.state ? `, ${job.state}` : ""}{job.country ? `, ${job.country}` : ""}
            </span>
          </div>
        </div>
      )}

      <form
        onSubmit={handleApply}
        className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-2xl shadow-md"
      >
        <div className="space-y-4">
          <div>
            <label className="block font-semibold text-sm mb-2 flex items-center gap-2">
              <FiFileText className="text-xl" />
              Select CV File
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setCvFile(e.target.files[0])}
              className="file-input file-input-bordered w-full bg-gray-700 text-white"
            />
          </div>

          <div>
            <button
              type="button"
              onClick={handleCvUpload}
              disabled={!cvFile || cvUploading}
              className="btn btn-secondary gap-2 w-full"
            >
              {cvUploading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                <AiOutlineCloudUpload />
              )}
              {cvUploading ? "Uploading..." : "Upload CV"}
            </button>

            {cvUploading && (
              <div className="mt-2 flex items-center gap-2">
                <progress
                  className="progress progress-success w-full"
                  value={uploadProgress}
                  max="100"
                ></progress>
                <span className="text-sm">{uploadProgress}%</span>
              </div>
            )}
          </div>

          {cvUrl && (
            <div className="text-green-400 flex items-center gap-2">
              <AiFillCheckCircle />
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                View Uploaded CV
              </a>
            </div>
          )}

          {applyError && (
            <div className="alert alert-error shadow-lg">
              <AiFillExclamationCircle />
              <span>{applyError}</span>
            </div>
          )}

          {applySuccess && (
            <div className="alert alert-success shadow-lg">
              <AiFillCheckCircle />
              <span>Application submitted successfully!</span>
            </div>
          )}

          <button
            type="submit"
            disabled={applying || cvUploading || !cvUrl}
            className="btn btn-primary w-full"
          >
            {applying ? (
              <AiOutlineLoading3Quarters className="animate-spin mr-2" />
            ) : (
              "Submit Application"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
