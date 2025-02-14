"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error("Failed to load notifications", err));
  }, []);

  return (
    <div className="bg-gray-800 p-4 text-white rounded">
      <h3 className="text-lg font-semibold">Notifications</h3>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map((n) => <p key={n.id}>{n.message}</p>)
      )}
    </div>
  );
}
