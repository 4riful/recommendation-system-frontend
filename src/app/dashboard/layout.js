"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import axios from "axios";

import { logout } from "@/app/utils/auth";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import ApplicantSidebar from "../dashboard/applicant/components/ApplicantSidebar";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  // State variables
  const [hydrated, setHydrated] = useState(false); // Ensure client-side consistency
  const [dynamicTitle, setDynamicTitle] = useState("Dashboard");
  const [notificationCount, setNotificationCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);

  // Dynamic title function
  const getDynamicTitle = (path) => {
    if (path.startsWith("/dashboard/applicant/overview")) return "Overview";
    if (path.startsWith("/dashboard/applicant/applications")) return "My Applications";
    if (path.startsWith("/dashboard/applicant/jobs")) return "Available Jobs";
    if (path.startsWith("/dashboard/applicant/profile")) return "Profile";
    if (path.startsWith("/dashboard/notifications")) return "Notifications";
    if (path.startsWith("/dashboard/settings")) return "Settings";
    return "Dashboard";
  };

  // Initialize title and state after hydration
  useEffect(() => {
    setHydrated(true);
    setDynamicTitle(getDynamicTitle(pathname));
  }, [pathname]);

  // Load sidebar state from localStorage
  useEffect(() => {
    const storedSidebarState = localStorage.getItem("isSidebarOpen");
    if (storedSidebarState !== null) {
      setIsSidebarOpen(storedSidebarState === "true");
    }
  }, []);

  // Fetch notifications after component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const unreadCount = response.data.filter((n) => !n.is_read).length;
        setNotificationCount(unreadCount);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        setNotificationCount(0);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, [router]);

  // Scroll listener to apply blur effect on the navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsNavbarScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem("isSidebarOpen", newState);
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-80" : "w-20"
        } bg-gray-900 transition-all duration-300 border-r border-gray-800 flex-shrink-0`}
      >
        <ApplicantSidebar isSidebarOpen={isSidebarOpen} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <nav
          className={`sticky top-0 z-10 px-6 py-4 flex justify-between items-center border-b border-gray-800 transition-all duration-300 ${
            hydrated && isNavbarScrolled ? "bg-gray-800/80 backdrop-blur-md shadow-md" : "bg-gray-900"
          }`}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="text-white hover:text-blue-500 focus:outline-none"
              aria-label="Toggle sidebar"
            >
              <MenuIcon />
            </button>
            <span className="text-2xl font-bold text-blue-500">{dynamicTitle}</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/dashboard/notifications" className="relative">
              <NotificationsNoneOutlinedIcon className="text-white hover:text-blue-500 transition-transform transform hover:scale-110" />
              {!loadingNotifications && notificationCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs">
                  {notificationCount}
                </span>
              )}
            </Link>

            <Link href="/dashboard/settings">
              <SettingsOutlinedIcon className="text-white hover:text-blue-500 transition-transform transform hover:scale-110" />
            </Link>

            <button
              onClick={handleLogout}
              className="hover:text-red-500 transition-transform transform hover:scale-110 focus:outline-none"
              aria-label="Logout"
            >
              <LogoutOutlinedIcon className="text-white" />
            </button>
          </div>
        </nav>

        {/* Scrollable content */}
        <main className="flex-1 overflow-auto p-6 lg:p-12">{children}</main>
      </div>
    </div>
  );
}
