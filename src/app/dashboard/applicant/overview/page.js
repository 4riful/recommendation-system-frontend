"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ProfileOverview from "../components/ProfileOverview";
import ApplicationStats from "../components/ApplicationStats";
import JobRecommendations from "../components/JobRecommendations";

export default function OverviewPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const applicantProfileId = localStorage.getItem("applicantProfileId");

    if (!applicantProfileId) {
      setError("No applicant profile found. Please create one first.");
      setLoading(false);
      return;
    }

    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-profiles/${applicantProfileId}/full`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setProfile(res.data);
      })
      .catch(() => {
        setError("Failed to load profile data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /***********************************************
   * Render Loading and Error States
   ***********************************************/
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#ff79c6]" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-20">{error}</div>;
  }

  /***********************************************
   * Render Page Content
   ***********************************************/
  return (
    <div className="space-y-8 p-6 lg:p-12">
      {/* Profile Overview */}
      <section className="bg-[#282a36] rounded-lg shadow-lg p-6">
        <ProfileOverview profile={profile} />
      </section>

      {/* Application Stats */}
      <section className="bg-[#282a36] rounded-lg shadow-lg p-6">
        <ApplicationStats applicantProfileId={profile.applicantProfileId} />
      </section>

      {/* Job Recommendations */}
      <section className="bg-[#282a36] rounded-lg shadow-lg p-6">
        <JobRecommendations />
      </section>
    </div>
  );
}
