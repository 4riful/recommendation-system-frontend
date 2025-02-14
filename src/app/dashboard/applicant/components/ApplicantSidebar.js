"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  UserCircleIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline"; // Import an icon for the CV Generator page

export default function ApplicantSidebar({ isSidebarOpen }) {
  const pathname = usePathname();

  // Updated navLinks array with the CV Generator link
  const navLinks = [
    { label: "Overview", href: "/dashboard/applicant/overview", icon: <HomeIcon className="w-6 h-6" /> },
    { label: "Applications", href: "/dashboard/applicant/applications", icon: <DocumentTextIcon className="w-6 h-6" /> },
    { label: "Jobs", href: "/dashboard/applicant/jobs", icon: <BriefcaseIcon className="w-6 h-6" /> },
    { label: "Profile", href: "/dashboard/applicant/profile", icon: <UserCircleIcon className="w-6 h-6" /> },
    // New CV Generator link
    {
      label: "Generate CV",
      href: "/dashboard/applicant/cv-generator",
      icon: <DocumentDuplicateIcon className="w-6 h-6" />,
    },
  ];

  return (
    <ul className="mt-20 px-4 space-y-4">
      {navLinks.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className={`flex items-center gap-4 py-3 px-4 rounded-lg ${
              pathname.startsWith(link.href)
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-700"
            }`}
          >
            {link.icon}
            {isSidebarOpen && <span className="text-lg">{link.label}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
