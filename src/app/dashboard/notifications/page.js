"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  BellAlertIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(response.data);
    } catch {
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${notificationId}`,
        { notification_status: "read" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the notification status in the UI
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, notification_status: "read" } : n
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h2 className="text-3xl font-bold flex items-center gap-3 text-primary">
        <BellAlertIcon className="w-10 h-10 text-primary animate-pulse" />
        Notifications
      </h2>

      {/* Loading and Error States */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="loading-spinner animate-spin w-10 h-10 border-4 rounded-full border-primary border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="alert alert-error shadow-lg">{error}</div>
      ) : notifications.length === 0 ? (
        <p className="text-gray-400 text-center">No notifications at this time.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`p-5 rounded-lg shadow-lg flex items-center justify-between bg-gradient-to-r ${
                n.notification_status === "unread"
                  ? "from-primary/20 via-gray-800 to-gray-900 border-l-4 border-primary"
                  : "bg-gray-800"
              } hover:bg-gray-700 transition-all duration-300`}
              onClick={() => markAsRead(n.id)}
            >
              <div className="flex items-center gap-4">
                {/* Icon to indicate status */}
                {n.notification_status === "unread" || !n.notification_status ? (
                  <ExclamationCircleIcon className="w-8 h-8 text-primary" />
                ) : (
                  <CheckCircleIcon className="w-8 h-8 text-green-400" />
                )}

                {/* Message content */}
                <div>
                  <p className="text-white text-lg font-semibold">{n.message}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Status:{" "}
                    <span
                      className={`capitalize font-medium ${
                        n.notification_status === "unread" || !n.notification_status
                          ? "text-primary"
                          : "text-green-400"
                      }`}
                    >
                      {n.notification_status || "unread"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Timestamp */}
              <span className="text-xs text-gray-500">
                {new Date(n.created_at).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
