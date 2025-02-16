"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaGraduationCap,
  FaCode,
  FaBriefcase,
  FaProjectDiagram,
  FaUserFriends,
  FaFlask,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaMoneyBillWave,
  FaEnvelope,
  FaVenusMars,
  FaGlobe,
  FaPenAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const placeholderImage =
  "https://ui-avatars.com/api/?name=Profile&background=44475a&color=f8f8f2";

// Simple helper to format ISO date strings into a more readable format
function formatDate(dateString) {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    return dateString; // fallback if parsing fails
  }
}

export default function ProfileCard({ profile }) {
  // Instantiate router from useRouter
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (profile !== undefined && profile !== null && !profile.applicantProfileId) {
      router.push("/dashboard/applicant/profile/create");
    }
  }, [profile, router]);

  /***********************************************
   * 1. Early return if no data
   ***********************************************/
  if (profile === null || profile === undefined) {
    return (
      <p className="text-center text-sm mt-4 text-red-500">
        No profile data available.
      </p>
    );
  }

  /***********************************************
   * 2. Profile Completion Logic
   ***********************************************/
  const isBasicInfoComplete = Boolean(
    profile.first_name &&
      profile.last_name &&
      profile.gender &&
      profile.languages &&
      profile.intro
  );
  const isAddressComplete = Boolean(profile.address?.country);
  const isAcademicComplete = (profile.AcademicQualifications || []).length > 0;
  const isSkillsComplete = (profile.ApplicantSkills || []).length > 0;
  const isEmploymentComplete = (profile.PreviousEmployments || []).length > 0;
  const isProjectInfoComplete = (profile.ProjectInfo || []).length > 0;
  const isReferencesComplete = (profile.References || []).length > 0;
  const isResearchComplete = (profile.ResearchBasedInfo || []).length > 0;

  // Adjust weights as desired
  const WEIGHTS = {
    basicInfo: 15,
    address: 5,
    academic: 10,
    skills: 10,
    employment: 10,
    projects: 10,
    references: 15,
    research: 10,
  };

  const calculateCompletion = () => {
    let total = 0;
    if (isBasicInfoComplete) total += WEIGHTS.basicInfo;
    if (isAddressComplete) total += WEIGHTS.address;
    if (isAcademicComplete) total += WEIGHTS.academic;
    if (isSkillsComplete) total += WEIGHTS.skills;
    if (isEmploymentComplete) total += WEIGHTS.employment;
    if (isProjectInfoComplete) total += WEIGHTS.projects;
    if (isReferencesComplete) total += WEIGHTS.references;
    if (isResearchComplete) total += WEIGHTS.research;
    return total;
  };

  const completionPercentage = calculateCompletion();

  // If completion is >= 80, show a green check next to the name
  const isHighCompletion = completionPercentage >= 80;

  /***********************************************
   * 3. Stats (with your Dracula color icons)
   ***********************************************/
  const stats = [
    {
      label: "Academic",
      value: profile.AcademicQualifications?.length || 0,
      icon: <FaGraduationCap className="text-[#50fa7b]" />,
    },
    {
      label: "Skills",
      value: profile.ApplicantSkills?.length || 0,
      icon: <FaCode className="text-[#50fa7b]" />,
    },
    {
      label: "Employments",
      value: profile.PreviousEmployments?.length || 0,
      icon: <FaBriefcase className="text-[#50fa7b]" />,
    },
    {
      label: "Projects",
      value: profile.ProjectInfo?.length || 0,
      icon: <FaProjectDiagram className="text-[#50fa7b]" />,
    },
    {
      label: "References",
      value: profile.References?.length || 0,
      icon: <FaUserFriends className="text-[#50fa7b]" />,
    },
    {
      label: "Research",
      value: profile.ResearchBasedInfo?.length || 0,
      icon: <FaFlask className="text-[#50fa7b]" />,
    },
  ];

  /***********************************************
   * 4. Animated radial progress gauge
   ***********************************************/
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    if (displayPercent < completionPercentage) {
      const timer = setTimeout(() => {
        setDisplayPercent((prev) => prev + 1);
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [displayPercent, completionPercentage]);

  /***********************************************
   * 5. Render Card
   ***********************************************/
  return (
    <div className="card w-full bg-[#282a36] text-[#f8f8f2] shadow-xl">
      <div className="card-body">
        {/* Header Row: Picture, Name, Status, Radial on Desktop */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Picture */}
          <div className="avatar">
            <div className="w-28 h-28 rounded-full ring ring-primary ring-offset-2 overflow-hidden">
              <Image
                src={
                  !imageError
                    ? profile.profile_picture_path || placeholderImage
                    : placeholderImage
                }
                alt="Profile Picture"
                width={112}
                height={112}
                unoptimized
                onError={() => setImageError(true)}
                className="object-cover"
              />
            </div>
          </div>

          {/* Names + Status */}
          <div>
            <h2 className="flex items-center text-2xl font-bold">
              {profile.first_name} {profile.last_name}
              {isHighCompletion && (
                <FaCheckCircle
                  className="text-green-500 ml-2"
                  title="Profile 80%+ Complete!"
                />
              )}
            </h2>
            <p className="text-sm text-[#bd93f9] mt-1">
              <span className="font-semibold">Status:</span>{" "}
              {profile.status || "Not available"}
            </p>

            {/* For Mobile: Radial Progress below name */}
            <div className="md:hidden flex items-center mt-3">
              <div
                className="radial-progress text-secondary"
                style={{
                  "--value": displayPercent,
                  "--size": "3.5rem",
                  "--thickness": "6px",
                }}
              >
                {displayPercent}%
              </div>
              <p className="ml-3 text-sm font-semibold self-end">
                Profile Completion
              </p>
            </div>
          </div>

          {/* Desktop: Radial Progress on the right */}
          <div className="ml-auto hidden md:flex items-center space-x-2">
            <div className="flex flex-col items-center">
              <div
                className="radial-progress text-secondary"
                style={{
                  "--value": displayPercent,
                  "--size": "4rem",
                  "--thickness": "6px",
                }}
              >
                {displayPercent}%
              </div>
              <p className="mt-2 text-sm font-semibold">Profile Completion</p>
            </div>
          </div>
        </div>

        {/* Basic Info directly under Name/Picture */}
        <div className="mt-4 space-y-2 text-sm leading-6">
          {/* Preferred Salary */}
          <p className="flex items-center text-[#ffb86c]">
            <FaMoneyBillWave className="mr-2" />
            <span className="font-semibold mr-1">Preferred Salary:</span>
            {profile.preferred_salary_range || "Not specified"}
          </p>

          {/* Email */}
          {profile.Users?.email && (
            <p className="flex items-center text-[#ff79c6]">
              <FaEnvelope className="mr-2" />
              <span className="font-semibold mr-1">Email:</span>
              {profile.Users.email}
            </p>
          )}

          {/* Gender */}
          <p className="flex items-center text-[#ff79c6]">
            <FaVenusMars className="mr-2" />
            <span className="font-semibold mr-1">Gender:</span>
            {profile.gender || "N/A"}
          </p>

          {/* Languages */}
          <p className="flex items-center text-[#ff79c6]">
            <FaGlobe className="mr-2" />
            <span className="font-semibold mr-1">Languages:</span>
            {profile.languages
              ? `${profile.languages}${
                  profile.language_proficiency
                    ? ` (${profile.language_proficiency})`
                    : ""
                }`
              : "N/A"}
          </p>

          {/* Introduction (FIXED) */}
          <div className="flex items-start text-[#ff79c6]">
            <FaPenAlt className="mr-2 mt-1" />
            <div>
              <span className="font-semibold mr-1">Introduction:</span>
              <p className="whitespace-pre-line">
                {profile.intro
                  ? profile.intro.toUpperCase()
                  : "NO INTRODUCTION PROVIDED."}
              </p>
            </div>
          </div>
        </div>

        {/* Stats (Academic, Skills, etc.) */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-2"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="font-bold text-xl">{stat.value}</div>
              <p className="text-sm text-[#bd93f9]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Toggle Show/Hide for Full Details */}
        <div className="text-center mt-6">
          <button
            className="btn btn-sm btn-primary gap-2"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide Full Profile" : "Show Full Profile"}
            {showDetails ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        {/* Full Profile (collapsible) */}
        {showDetails && (
          <div className="mt-8 space-y-4 bg-[#44475a] p-4 rounded-xl">
            {/* Address Section */}
            <SectionWithIcon
              icon={<FaMapMarkerAlt className="mr-2 text-[#50fa7b]" />}
              title="Address"
            >
              {profile.address ? (
                <p className="text-sm">
                  {`${profile.address.city || ""}, ${profile.address.state || ""}, ${
                    profile.address.country || ""
                  }`}
                </p>
              ) : (
                <p className="italic">No address provided.</p>
              )}
            </SectionWithIcon>

            {/* Academic */}
            <SectionWithIcon
              icon={<FaGraduationCap className="mr-2 text-[#50fa7b]" />}
              title="Academic Qualifications"
            >
              {isAcademicComplete ? (
                <ul className="list-disc ml-6 space-y-2">
                  {profile.AcademicQualifications.map((aq) => (
                    <li key={aq.qualification_id}>
                      <p className="font-semibold">
                        {aq.degree_type} in {aq.degree} — {aq.university}
                      </p>
                      <p className="text-sm text-[#f1fa8c]">
                        Department: {aq.department}, CGPA: {aq.cgpa}
                      </p>
                      <p className="text-xs">
                        {formatDate(aq.start_date)} - {formatDate(aq.end_date)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="italic">No Academic Qualifications provided.</p>
              )}
            </SectionWithIcon>

            {/* Skills */}
            <SectionWithIcon
              icon={<FaCode className="mr-2 text-[#50fa7b]" />}
              title="Skills"
            >
              {isSkillsComplete ? (
                <div className="flex flex-wrap gap-2">
                  {profile.ApplicantSkills.map(({ id, Skill }) => (
                    <div key={id} className="badge badge-secondary">
                      {Skill?.name}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="italic">No Skills provided.</p>
              )}
            </SectionWithIcon>

            {/* Employments */}
            <SectionWithIcon
              icon={<FaBriefcase className="mr-2 text-[#50fa7b]" />}
              title="Previous Employments"
            >
              {isEmploymentComplete ? (
                <ul className="list-disc ml-6 space-y-2">
                  {profile.PreviousEmployments.map((emp) => (
                    <li key={emp.employment_id}>
                      <p className="font-semibold">{emp.position_held}</p>
                      <p className="text-sm text-[#f1fa8c]">
                        {emp.institution} ({emp.employment_duration})
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="italic">No Employment history provided.</p>
              )}
            </SectionWithIcon>

            {/* Projects */}
            <SectionWithIcon
              icon={<FaProjectDiagram className="mr-2 text-[#50fa7b]" />}
              title="Projects"
            >
              {isProjectInfoComplete ? (
                <ul className="list-disc ml-6 space-y-2">
                  {profile.ProjectInfo.map((proj) => (
                    <li key={proj.project_id}>
                      <p className="font-semibold">{proj.project_title}</p>
                      <p className="text-sm text-[#f1fa8c]">
                        {formatDate(proj.project_start_date)} -{" "}
                        {formatDate(proj.project_end_date)}
                      </p>
                      <p className="text-sm">{proj.project_description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="italic">No Project information provided.</p>
              )}
            </SectionWithIcon>

            {/* References */}
            <SectionWithIcon
              icon={<FaUserFriends className="mr-2 text-[#50fa7b]" />}
              title="References"
            >
              {isReferencesComplete ? (
                <ul className="list-disc ml-6 space-y=2">
                  {profile.References.map((ref) => (
                    <li key={ref.reference_id}>
                      <p className="font-semibold">{ref.name}</p>
                      <p className="text-sm text-[#f1fa8c]">
                        {ref.email} | {ref.phonenumber}
                      </p>
                      <p className="text-sm">
                        Relationship: {ref.relationship}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="italic">No References provided.</p>
              )}
            </SectionWithIcon>

            {/* Research */}
            <SectionWithIcon
              icon={<FaFlask className="mr-2 text-[#50fa7b]" />}
              title="Research"
            >
              {isResearchComplete ? (
                <ul className="list-disc ml-6 space-y-2">
                  {profile.ResearchBasedInfo.map((paper) => {
                    const isVerified = paper.review_status === "VERIFIED";
                    return (
                      <li key={paper.paper_id}>
                        <p className="font-semibold flex items-center">
                          {paper.paper_title}
                          {isVerified && (
                            <FaCheckCircle
                              className="text-green-400 ml-2"
                              title="Verified Paper"
                            />
                          )}
                        </p>
                        <p className="text-sm text-[#f1fa8c]">
                          Journal: {paper.journal_name} (DOI: {paper.doi})
                        </p>
                        <p className="text-sm">
                          Publication Date:{" "}
                          {formatDate(paper.publication_date)}, Citations:{" "}
                          {paper.citation_count}
                        </p>
                        <p className="text-xs italic">
                          Authors: {paper.authors}
                        </p>
                        <p className="text-xs mt-1">
                          <strong>Abstract:</strong> {paper.abstract}
                        </p>
                        {paper.review_status && (
                          <p className="text-xs mt-1">
                            Status: {paper.review_status}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="italic">No Research info provided.</p>
              )}
            </SectionWithIcon>
          </div>
        )}
      </div>
    </div>
  );
}

/***********************************************
 * Helper: SectionWithIcon
 ***********************************************/
function SectionWithIcon({ icon, title, children }) {
  return (
    <div>
      <h3 className="flex items-center text-xl font-semibold mb-2">
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}
