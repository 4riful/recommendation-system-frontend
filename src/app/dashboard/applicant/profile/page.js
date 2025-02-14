"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CloudinaryUploadWidget } from "../../../../components/CloudinaryUploadWidget";
import {
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBriefcase,
  FaWrench,
  FaClipboardCheck,
  FaFileAlt,
  FaSpinner,
} from "react-icons/fa";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const storedProfileId =
    typeof window !== "undefined" ? localStorage.getItem("applicantProfileId") : null;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!storedProfileId) {
      router.push("/dashboard/applicant");
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-profiles/${storedProfileId}/full`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch full profile");
        }
        const data = await res.json();
        setProfileData(data);
        saveIdsToLocalStorage(data); // Save the IDs after fetching profile data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [storedProfileId, token, router]);

  const handleProfilePictureUpload = async (cloudinaryUrl) => {
    try {
      setUploading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-profiles/${storedProfileId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ profile_picture_path: cloudinaryUrl }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to update profile picture");
      }
      const updatedProfile = await res.json();
      setProfileData((prev) => ({
        ...prev,
        profile_picture_path: updatedProfile.profile_picture_path,
      }));
      alert("Profile picture updated successfully!");
      router.refresh(); // Force refresh after profile change
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  // Function to save profile-related IDs to localStorage
  const saveIdsToLocalStorage = (data) => {
    const ids = {
      academicQualifications: data?.AcademicQualifications?.map(item => item.qualification_id),
      previousEmployments: data?.PreviousEmployments?.map(item => item.employment_id),
      skills: data?.ApplicantSkills?.map(item => item.skill_id),
      projects: data?.ProjectInfo?.map(item => item.project_id),
      references: data?.References?.map(item => item.reference_id),
      researchPapers: data?.ResearchBasedInfo?.map(item => item.paper_id),
      preferredJobTitles: data?.PreferredJobTitles?.map(item => item.id),
      preferredJobTypes: data?.PreferredJobTypes?.map(item => item.id),
      preferredLocations: data?.PreferredLocations?.map(item => item.id),
      address: data?.address?.id, // Save the address ID
    };
    localStorage.setItem("profileIds", JSON.stringify(ids));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-[#f8f8f2]">
        <FaSpinner className="animate-spin text-3xl mb-4" />
        <p>Loading Profile...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 mt-20 text-center">Error: {error}</div>;
  }

  if (!profileData) {
    return <div className="mt-20 text-center text-[#f8f8f2]">No Profile Data</div>;
  }

  const {
    applicantProfileId,
    profile_picture_path,
    first_name,
    last_name,
    gender,
    languages,
    language_proficiency,
    intro,
    preferred_salary_range,
    status,
    address,
    AcademicQualifications,
    ApplicantSkills,
    PreferredJobTitles,
    PreferredJobTypes,
    PreferredLocations,
    PreviousEmployments,
    ProjectInfo,
    References,
    ResearchBasedInfo,
  } = profileData;

  return (
    <div className="min-h-screen text-[#f8f8f2] font-sans px-4 md:px-8 py-6">
      <div className="bg-gradient-to-br from-[#44475a] to-[#343647] rounded-xl border border-[#6272a4] shadow-xl p-6 mb-10 flex flex-col md:flex-row items-center">
        {/* Fixed-size image container */}
        <div className="relative group flex-shrink-0">
          <img
            src={profile_picture_path || "/placeholder-avatar.png"}
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover border-4 border-[#6272a4]"
          />
          <CloudinaryUploadWidget
            preset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
            onUploadSuccess={handleProfilePictureUpload}
          >
            <button
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-0 opacity-0 group-hover:opacity-100 transition duration-300 focus:outline-none"
              disabled={uploading}
            >
              {uploading ? (
                <FaSpinner className="animate-spin text-white text-xl" />
              ) : (
                <FaEdit className="text-white text-xl" />
              )}
            </button>
          </CloudinaryUploadWidget>
        </div>

        <div className="mt-6 md:mt-0 md:ml-8 text-center md:text-left">
          <h2 className="text-3xl font-bold">
            {first_name} {last_name}
          </h2>
          <div className="mt-2 space-y-2 text-sm">
            <p>
              <span className="font-bold">Gender:</span> {gender || "N/A"}
            </p>
            <p>
              <span className="font-bold">Languages:</span>{" "}
              {languages ? `${languages} (${language_proficiency || "N/A"})` : "N/A"}
            </p>
            <p>
              <span className="font-bold">Preferred Salary:</span> {preferred_salary_range || "N/A"}
            </p>
            <p>
              <span className="font-bold">Intro:</span> {intro || "No intro yet"}
            </p>
            <div className="flex items-center justify-center md:justify-start">
              <span className="font-bold">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded text-[#282a36] ${status === "incomplete" ? "bg-[#ff5555]" : "bg-[#50fa7b]"}`}>
                {status}
              </span>
            </div>
          </div>
          {/* Right-aligned Edit and Delete buttons */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-end">
            <button
              className="flex items-center gap-1 bg-[#50fa7b] hover:bg-[#8be9fd] px-3 py-1 rounded-full text-[#282a36] text-sm font-semibold transition-colors duration-200 shadow"
              onClick={() => router.push(`/dashboard/applicant/profile/${applicantProfileId}/edit`)}
            >
              <FaEdit />
              Edit
            </button>
            <button
              className="flex items-center gap-1 bg-[#ff5555] hover:bg-[#ff79c6] px-3 py-1 rounded-full text-[#282a36] text-sm font-semibold transition-colors duration-200 shadow"
              onClick={() => {
                if (confirm("Are you sure you want to delete your profile?")) {
                  fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-profiles/${applicantProfileId}`,
                    {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  )
                    .then((res) => {
                      if (!res.ok) throw new Error("Failed to delete");
                      return res.json();
                    })
                    .then(() => {
                      alert("Profile deleted!");
                      router.push("/dashboard/applicant");
                    })
                    .catch((err) => alert(err.message));
                }
              }}
            >
              <FaTrashAlt />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Full-width sections */}
      <div className="grid grid-cols-1 gap-6">
        <SectionDisplay
          title="Address"
          icon={<FaMapMarkerAlt className="w-6 h-6 text-[#8be9fd]" />}
          items={address ? [address] : []}
          isSingle
          createLink="/dashboard/applicant/profile/address/create"
          renderItem={(addr) => (
            <div className="text-sm">
              {addr.city}, {addr.state}, {addr.country}
            </div>
          )}
          editLinkFn={(addr) => `/dashboard/applicant/profile/address/${addr.id}/edit`}
        />

        <SectionDisplay
          title="Academic Qualifications"
          icon={<FaGraduationCap className="w-6 h-6 text-[#8be9fd]" />}
          items={AcademicQualifications}
          createLink="/dashboard/applicant/profile/academic-qualifications/create"
          renderItem={(item) => (
            <div>
              <strong>
                {item.degree_type} in {item.degree}
              </strong>
              <br />
              {item.university} <br />
              Dept: {item.department} | CGPA: {item.cgpa}
            </div>
          )}
          editLinkFn={(item) =>
            `/dashboard/applicant/profile/academic-qualifications/${item.qualification_id}/edit`
          }
        />

        <SectionDisplay
          title="Previous Employments"
          icon={<FaBriefcase className="w-6 h-6 text-[#8be9fd]" />}
          items={PreviousEmployments}
          createLink="/dashboard/applicant/profile/experiences/create"
          renderItem={(item) => (
            <div>
              {item.position_held} at {item.institution} for {item.employment_duration}
            </div>
          )}
          editLinkFn={(item) =>
            `/dashboard/applicant/profile/experiences/${item.employment_id}/edit`
          }
        />

        <SectionDisplay
          title="Skills"
          icon={<FaWrench className="w-6 h-6 text-[#8be9fd]" />}
          items={ApplicantSkills}
          createLink="/dashboard/applicant/profile/skills/create"
          renderItem={(item) => <div>{item.Skill?.name}</div>}
          editLinkFn={(item) =>
            `/dashboard/applicant/profile/skills/${item.skill_id}/edit`
          }
        />

        <SectionDisplay
          title="Projects"
          icon={<FaClipboardCheck className="w-6 h-6 text-[#8be9fd]" />}
          items={ProjectInfo}
          createLink="/dashboard/applicant/profile/projects/create"
          renderItem={(item) => (
            <div>
              <strong>{item.project_title}</strong>
              <p className="text-sm">{item.project_description}</p>
            </div>
          )}
          editLinkFn={(item) =>
            `/dashboard/applicant/profile/projects/${item.project_id}/edit`
          }
        />

        <SectionDisplay
          title="References"
          icon={<FaFileAlt className="w-6 h-6 text-[#8be9fd]" />}
          items={References}
          createLink="/dashboard/applicant/profile/references/create"
          renderItem={(item) => (
            <div>
              {item.name} - {item.relationship} <br />
              <span className="text-xs">{item.email}</span>
            </div>
          )}
          editLinkFn={(item) =>
            `/dashboard/applicant/profile/references/${item.reference_id}/edit`
          }
        />

        <SectionDisplay
          title="Research & Publications"
          icon={<FaFileAlt className="w-6 h-6 text-[#8be9fd]" />}
          items={ResearchBasedInfo}
          createLink="/dashboard/applicant/profile/research-based-info/create"
          renderItem={(item) => (
            <div>
              <strong>{item.paper_title}</strong>
              <br />
              {item.journal_name}, Citations: {item.citation_count}
              <br />
              <span className="text-xs">
                DOI: {item.doi} ({item.review_status})
              </span>
            </div>
          )}
          editLinkFn={(item) =>
            `/dashboard/applicant/profile/research-based-info/${item.paper_id}/edit`
          }
        />

        <SectionDisplay
          title="Preferred Job Titles"
          icon={<FaClipboardCheck className="w-6 h-6 text-[#8be9fd]" />}
          items={PreferredJobTitles}
          createLink="/dashboard/applicant/profile/preferred-job-titles/create"
          renderItem={(item) => <div>{item.job_title}</div>}
          editLinkFn={(item) =>
            `/dashboard/applicant/profile/preferred-job-titles/${item.id}/edit`
          }
        />

        <SectionDisplay
          title="Preferred Job Types"
          icon={<FaClipboardCheck className="w-6 h-6 text-[#8be9fd]" />}
          items={PreferredJobTypes}
          createLink="/dashboard/applicant/profile/preferred-job-types/create"
          renderItem={(item) => <div>{item.preferred_job_type}</div>}
          editLinkFn={(item) =>
            `/dashboard/applicant/profile/preferred-job-types/${item.id}/edit`
          }
        />

        <SectionDisplay
          title="Preferred Locations"
          icon={<FaMapMarkerAlt className="w-6 h-6 text-[#8be9fd]" />}
          items={PreferredLocations}
          createLink="/dashboard/applicant/profile/preferred-locations/create"
          renderItem={(item) => <div>{item.location}</div>}
          editLinkFn={(item) =>
            `/dashboard/applicant/profile/preferred-locations/${item.id}/edit`
          }
        />
      </div>
    </div>
  );
}

/**
 * Reusable SectionDisplay component
 */
function SectionDisplay({
  title,
  icon,
  items = [],
  createLink,
  renderItem,
  editLinkFn,
  isSingle = false,
}) {
  return (
    <div className="bg-gradient-to-br from-[#44475a] to-[#3a3c46] border border-[#6272a4] p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        {isSingle ? (
          items.length === 0 ? (
            <a
              href={createLink}
              className="flex items-center gap-1 bg-[#bd93f9] hover:bg-[#ff79c6] text-[#282a36] text-xs px-2 py-1 rounded-full font-semibold transition-colors duration-200"
            >
              <FaPlus className="w-4 h-4" />
              Add
            </a>
          ) : (
            <a
              href={editLinkFn(items[0])}
              className="flex items-center gap-1 bg-[#50fa7b] hover:bg-[#8be9fd] text-[#282a36] text-xs px-2 py-1 rounded-full font-semibold transition-colors duration-200"
            >
              <FaEdit className="w-4 h-4" />
              Edit
            </a>
          )
        ) : (
          <a
            href={createLink}
            className="flex items-center gap-1 bg-[#bd93f9] hover:bg-[#ff79c6] text-[#282a36] text-xs px-2 py-1 rounded-full font-semibold transition-colors duration-200"
          >
            <FaPlus className="w-4 h-4" />
            Add
          </a>
        )}
      </div>
      {items && items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={
                item.id ||
                item.qualification_id ||
                item.employment_id ||
                item.project_id ||
                item.reference_id ||
                item.paper_id
              }
              className="flex justify-between items-center bg-[#6272a4] bg-opacity-60 p-2 rounded transition-colors duration-200"
            >
              <div className="text-sm">{renderItem(item)}</div>
              <div className="flex space-x-2">
                <a
                  href={editLinkFn(item)}
                  className="flex items-center gap-1 bg-[#50fa7b] hover:bg-[#8be9fd] text-[#282a36] text-xs px-2 py-1 rounded-full font-semibold transition-colors duration-200"
                >
                  <FaEdit className="w-4 h-4" />
                  Edit
                </a>
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete this ${title}?`)) {
                      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/delete-endpoint`, {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                      })
                        .then((res) => {
                          if (!res.ok) throw new Error("Failed to delete");
                          return res.json();
                        })
                        .then(() => {
                          alert("Item deleted!");
                        })
                        .catch((err) => alert(err.message));
                    }
                  }}
                  className="flex items-center gap-1 bg-[#ff5555] hover:bg-[#ff79c6] text-[#282a36] text-xs px-2 py-1 rounded-full font-semibold transition-colors duration-200"
                >
                  <FaTrashAlt className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-300 italic">No {title} added yet.</p>
      )}
    </div>
  );
}
