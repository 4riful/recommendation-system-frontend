"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AcademicCapIcon,
  BriefcaseIcon,
  UserIcon,
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

/**
 * Returns a friendly summary with formatted details for each section.
 */
function renderSectionDetails(sectionId, fullProfile) {
  switch (sectionId) {
    case "personalInfo": {
      const { first_name, last_name, Users, gender, intro, profile_picture_path } = fullProfile;
      return (
        <div className="space-y-1">
          <div><strong>Name:</strong> {`${first_name} ${last_name}`}</div>
          <div><strong>Email:</strong> {Users?.email}</div>
          <div><strong>Phone:</strong> {Users?.phone_number}</div>
          <div><strong>Gender:</strong> {gender}</div>
          {intro && <div><strong>About:</strong> {intro}</div>}
          {profile_picture_path && (
            <div>
              <img
                src={profile_picture_path}
                alt="Profile"
                className="mt-2 max-w-[150px] rounded"
              />
            </div>
          )}
        </div>
      );
    }
    case "education": {
      const quals = fullProfile.AcademicQualifications || [];
      return quals.length ? (
        <div className="space-y-2">
          {quals.map((q) => (
            <div key={q.qualification_id} className="border-b border-gray-700 pb-1">
              <div className="font-semibold">
                {q.degree_type} in {q.degree}
              </div>
              <div className="text-sm text-gray-400">
                {q.university}, {q.department}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(q.start_date).toLocaleDateString()} –{" "}
                {new Date(q.end_date).toLocaleDateString()}
              </div>
              <div className="text-xs text-gray-500">CGPA: {q.cgpa}</div>
            </div>
          ))}
        </div>
      ) : (
        "No education data found."
      );
    }
    case "experience": {
      const exps = fullProfile.PreviousEmployments || [];
      return exps.length ? (
        <div className="space-y-2">
          {exps.map((exp) => (
            <div key={exp.employment_id} className="border-b border-gray-700 pb-1">
              <div className="font-semibold">{exp.position_held}</div>
              <div className="text-sm text-gray-400">{exp.institution}</div>
              <div className="text-xs text-gray-500">Duration: {exp.employment_duration}</div>
            </div>
          ))}
        </div>
      ) : (
        "No experience data found."
      );
    }
    case "skills": {
      const skills = fullProfile.ApplicantSkills || [];
      return skills.length ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span
              key={s.id}
              className="px-2 py-1 bg-gray-700 rounded text-xs"
            >
              {s.Skill?.name}
            </span>
          ))}
        </div>
      ) : (
        "No skills found."
      );
    }
    case "projects": {
      const projs = fullProfile.ProjectInfo || [];
      return projs.length ? (
        <div className="space-y-2">
          {projs.map((p) => (
            <div key={p.project_id} className="border-b border-gray-700 pb-1">
              <div className="font-semibold">{p.project_title || "Untitled Project"}</div>
              <div className="text-xs text-gray-500">
                {new Date(p.project_start_date).toLocaleDateString()} –{" "}
                {new Date(p.project_end_date).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-400">{p.project_description}</div>
            </div>
          ))}
        </div>
      ) : (
        "No project data found."
      );
    }
    case "references": {
      const refs = fullProfile.References || [];
      return refs.length ? (
        <div className="space-y-2">
          {refs.map((r) => (
            <div key={r.reference_id} className="border-b border-gray-700 pb-1">
              <div className="font-semibold">{r.name}</div>
              <div className="text-xs text-gray-500">
                {r.relationship}
              </div>
              <div className="text-sm text-gray-400">
                Phone: {r.phonenumber}, Email: {r.email}
              </div>
            </div>
          ))}
        </div>
      ) : (
        "No references found."
      );
    }
    case "research": {
      const papers = fullProfile.ResearchBasedInfo || [];
      return papers.length ? (
        <div className="space-y-2">
          {papers.map((p) => (
            <div key={p.paper_id} className="border-b border-gray-700 pb-1">
              <div className="font-semibold">{p.paper_title}</div>
              <div className="text-xs text-gray-500">
                Published in {p.journal_name} on {new Date(p.publication_date).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-400">
                Citation Count: {p.citation_count}, DOI: {p.doi}
              </div>
              <div className="text-xs text-gray-500">Status: {p.review_status}</div>
            </div>
          ))}
        </div>
      ) : (
        "No research data found."
      );
    }
    default:
      return "No data found.";
  }
}

export default function CVGeneratorPage() {
  const [profileId, setProfileId] = useState("");
  const [templateType, setTemplateType] = useState("Modern");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fullProfile, setFullProfile] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});

  // On mount, get the applicantProfileId.
  useEffect(() => {
    const storedId = localStorage.getItem("applicantProfileId");
    if (storedId) {
      setProfileId(storedId);
    } else {
      setError("Applicant Profile ID not found in localStorage.");
    }
  }, []);

  // Fetch sections from the server when profileId is set.
  useEffect(() => {
    if (!profileId) return;
    const fetchSections = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cv-generate/sections/${profileId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        const data = res.data.data;
        setFullProfile(data.fullProfile);

        // Build sections: personalInfo always first.
        const newSections = [
          {
            id: "personalInfo",
            label: "Personal Information",
            Icon: UserIcon,
            hasData: true,
          },
        ];
        const mapping = {
          AcademicQualifications: {
            id: "education",
            label: "Education",
            Icon: AcademicCapIcon,
          },
          PreviousEmployments: {
            id: "experience",
            label: "Experience",
            Icon: BriefcaseIcon,
          },
          ApplicantSkills: {
            id: "skills",
            label: "Skills",
            Icon: ClipboardDocumentCheckIcon,
          },
          ProjectInfo: {
            id: "projects",
            label: "Projects",
            Icon: DocumentTextIcon,
          },
          References: {
            id: "references",
            label: "References",
            Icon: UserIcon,
          },
          ResearchBasedInfo: {
            id: "research",
            label: "Research",
            Icon: DocumentTextIcon,
          },
        };
        data.availableSections.forEach((s) => {
          if (mapping[s]) {
            newSections.push({ ...mapping[s], hasData: true });
          }
        });
        setSections(newSections);
        setSelectedSections(newSections.map((s) => s.id));
      } catch (err) {
        console.error("Error fetching sections:", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, [profileId]);

  // Update template type.
  const onTemplateChange = (val) => {
    setTemplateType(val);
  };

  // Toggle section selection.
  const toggleSection = (secId) => {
    setSelectedSections((prev) =>
      prev.includes(secId) ? prev.filter((id) => id !== secId) : [...prev, secId]
    );
  };

  // Toggle expanded state to show details for a section.
  const toggleExpand = (secId) => {
    setExpandedSections((prev) => ({ ...prev, [secId]: !prev[secId] }));
  };

  // Generate and download CV.
  const generateCV = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cv-generate/generate/${profileId}`,
        { selectedSections, templateType },
        {
          responseType: "arraybuffer",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const pdfBlob = new Blob([res.data], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "cv.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Error generating CV:", err);
      setError("CV generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <header className="w-full max-w-screen-xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold">Professional CV Builder</h1>
        <p className="mt-2 text-lg text-gray-300">
          Create your custom CV in 3 simple steps.
        </p>
      </header>

      {/* Step Indicator */}
      <div className="w-full max-w-screen-xl mx-auto mb-8 flex items-center justify-center space-x-2">
        <div className="flex items-center gap-1">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold text-sm">
            1
          </div>
          <span className="text-xs text-gray-200">Choose Template</span>
        </div>
        <ChevronRightIcon className="w-4 h-4 text-gray-300" />
        <div className="flex items-center gap-1">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold text-sm">
            2
          </div>
          <span className="text-xs text-gray-200">Select Sections</span>
        </div>
        <ChevronRightIcon className="w-4 h-4 text-gray-300" />
        <div className="flex items-center gap-1">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold text-sm">
            3
          </div>
          <span className="text-xs text-gray-200">Generate CV</span>
        </div>
      </div>

      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

      {loading && (
        <div className="mb-4 text-gray-300 flex justify-center items-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          <span>Loading data...</span>
        </div>
      )}

      {/* Template Selection */}
      <div className="w-full max-w-screen-xl mx-auto mb-6 text-center">
        <label className="block text-sm font-semibold mb-2">Select Template Type:</label>
        <div className="flex justify-center gap-6">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="radio"
              name="templateType"
              value="Modern"
              checked={templateType === "Modern"}
              onChange={(e) => onTemplateChange(e.target.value)}
              className="radio radio-primary"
            />
            <span>Modern</span>
          </label>
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="radio"
              name="templateType"
              value="Classic"
              checked={templateType === "Classic"}
              onChange={(e) => onTemplateChange(e.target.value)}
              className="radio radio-primary"
            />
            <span>Classic</span>
          </label>
        </div>
      </div>

      {/* Sections to Include */}
      <div className="w-full max-w-screen-xl mx-auto mb-6">
        <h2 className="text-xl font-semibold mb-3 text-center">Sections to Include</h2>
        {sections.length === 0 ? (
          <div className="text-gray-400 text-sm text-center">No sections available yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sections.map((sec) => {
              const Icon = sec.Icon;
              return (
                <div key={sec.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-accent"
                        checked={selectedSections.includes(sec.id)}
                        onChange={() => toggleSection(sec.id)}
                      />
                      <Icon className="w-5 h-5" />
                      <span className="font-medium text-sm">{sec.label}</span>
                    </div>
                    <button
                      onClick={() => toggleExpand(sec.id)}
                      className="text-xs text-gray-400 hover:underline"
                    >
                      {expandedSections[sec.id] ? "Hide" : "View"}
                    </button>
                  </div>
                  {expandedSections[sec.id] && fullProfile && (
                    <div className="mt-2 text-xs text-gray-400">
                      {sec.id === "personalInfo"
                        ? renderPersonalInfo(fullProfile)
                        : sec.id === "education"
                        ? renderEducation(fullProfile.AcademicQualifications)
                        : sec.id === "experience"
                        ? renderExperience(fullProfile.PreviousEmployments)
                        : sec.id === "skills"
                        ? renderSkills(fullProfile.ApplicantSkills)
                        : sec.id === "projects"
                        ? renderProjects(fullProfile.ProjectInfo)
                        : sec.id === "references"
                        ? renderReferences(fullProfile.References)
                        : sec.id === "research"
                        ? renderResearch(fullProfile.ResearchBasedInfo)
                        : "No data available."}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Generate Button */}
      <div className="w-full max-w-screen-xl mx-auto text-center">
        <button
          onClick={generateCV}
          disabled={sections.length === 0 || loading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-md text-base font-medium shadow focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <ArrowDownTrayIcon className="w-5 h-5" />
              <span>Generate &amp; Download CV</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Render functions for each section's details

function renderPersonalInfo(fullProfile) {
  const { first_name, last_name, Users, gender, intro, profile_picture_path } = fullProfile;

  return (
    <div className="flex items-start space-x-4">
      {profile_picture_path && (
        <div className="w-32 h-32 flex-shrink-0">
          <img
            src={profile_picture_path}
            alt="Profile"
            className="w-full h-full rounded object-cover"
          />
        </div>
      )}
      <div className="flex-1 space-y-2">
        <div>
          <strong>Name:</strong> {first_name} {last_name}
        </div>
        <div>
          <strong>Email:</strong> {Users?.email}
        </div>
        <div>
          <strong>Phone:</strong> {Users?.phone_number}
        </div>
        <div>
          <strong>Gender:</strong> {gender}
        </div>
        {intro && (
          <div className="mt-2">
            <strong>About:</strong> <p className="text-justify">{intro}</p>
          </div>
        )}
      </div>
    </div>
  );
}





function renderEducation(qualifications) {
  if (!qualifications || qualifications.length === 0) return "No education data found.";
  return (
    <div className="space-y-2">
      {qualifications.map((q) => (
        <div key={q.qualification_id} className="border-b border-gray-700 pb-1">
          <div className="font-semibold">
            {q.degree_type} in {q.degree}
          </div>
          <div className="text-sm text-gray-400">
            {q.university}, {q.department}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(q.start_date).toLocaleDateString()} –{" "}
            {new Date(q.end_date).toLocaleDateString()}
          </div>
          <div className="text-xs text-gray-500">CGPA: {q.cgpa}</div>
        </div>
      ))}
    </div>
  );
}

function renderExperience(experiences) {
  if (!experiences || experiences.length === 0) return "No experience data found.";
  return (
    <div className="space-y-2">
      {experiences.map((exp) => (
        <div key={exp.employment_id} className="border-b border-gray-700 pb-1">
          <div className="font-semibold">{exp.position_held}</div>
          <div className="text-sm text-gray-400">{exp.institution}</div>
          <div className="text-xs text-gray-500">Duration: {exp.employment_duration}</div>
        </div>
      ))}
    </div>
  );
}

function renderSkills(skills) {
  if (!skills || skills.length === 0) return "No skills found.";
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((s) => (
        <span key={s.id} className="px-2 py-1 bg-gray-700 rounded text-xs">
          {s.Skill?.name}
        </span>
      ))}
    </div>
  );
}

function renderProjects(projects) {
  if (!projects || projects.length === 0) return "No project data found.";
  return (
    <div className="space-y-2">
      {projects.map((p) => (
        <div key={p.project_id} className="border-b border-gray-700 pb-1">
          <div className="font-semibold">{p.project_title || "Untitled Project"}</div>
          <div className="text-xs text-gray-500">
            {new Date(p.project_start_date).toLocaleDateString()} –{" "}
            {new Date(p.project_end_date).toLocaleDateString()}
          </div>
          <div className="text-sm text-gray-400">{p.project_description}</div>
        </div>
      ))}
    </div>
  );
}

function renderReferences(references) {
  if (!references || references.length === 0) return "No references found.";
  return (
    <div className="space-y-2">
      {references.map((r) => (
        <div key={r.reference_id} className="border-b border-gray-700 pb-1">
          <div className="font-semibold">{r.name}</div>
          <div className="text-xs text-gray-500">{r.relationship}</div>
          <div className="text-sm text-gray-400">
            Phone: {r.phonenumber}, Email: {r.email}
          </div>
        </div>
      ))}
    </div>
  );
}

function renderResearch(research) {
  if (!research || research.length === 0) return "No research data found.";
  return (
    <div className="space-y-2">
      {research.map((p) => (
        <div key={p.paper_id} className="border-b border-gray-700 pb-1">
          <div className="font-semibold">{p.paper_title}</div>
          <div className="text-xs text-gray-500">
            Published in {p.journal_name} on{" "}
            {new Date(p.publication_date).toLocaleDateString()}
          </div>
          <div className="text-sm text-gray-400">
            Citation Count: {p.citation_count}, DOI: {p.doi}
          </div>
          <div className="text-xs text-gray-500">Status: {p.review_status}</div>
        </div>
      ))}
    </div>
  );
}
