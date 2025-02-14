"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ResponsiveBar } from "@nivo/bar";
import { FaFileImport, FaSearch, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const DRACULA_COLORS = {
  background: "#282a36",
  text: "#f8f8f2",
  accent: "#bd93f9",
  gridLine: "#44475a",
  statuses: {
    submitted: "#ff79c6",
    in_review: "#8be9fd",
    accepted: "#50fa7b",
    rejected: "#ff5555",
  },
};

export default function ApplicationStats({ applicantProfileId }) {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/applications/stats/${applicantProfileId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          const allStatuses = ["submitted", "in_review", "accepted", "rejected"];
          const statusMap = response.data.data.reduce((acc, stat) => ({
            ...acc,
            [stat.application_status]: Math.round(stat.count),
          }), {});

          setStats(allStatuses.map((status) => ({
            status,
            count: statusMap[status] || 0,
            label: status.replace("_", " "),
          })));
        }
      } catch {
        setError("Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [applicantProfileId]);

  if (loading) return <div className="p-6 text-gray-400">Loading insights...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  const maxCount = Math.max(...stats.map((stat) => stat.count), 5);

  return (
    <div className="w-full bg-neutral-900 rounded-xl shadow-xl p-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-extrabold" style={{ color: DRACULA_COLORS.accent }}>
          Application Analytics
        </h2>
        <p className="text-gray-400">Overview of your application statuses</p>
      </div>

      {/* Visual Chart */}
      <div className="h-96 w-full">
        <ResponsiveBar
          data={stats}
          keys={["count"]}
          indexBy="status"
          margin={{ top: 20, right: 30, bottom: 80, left: 60 }}
          padding={0.4}
          colors={({ data }) => DRACULA_COLORS.statuses[data.status]}
          theme={{
            textColor: DRACULA_COLORS.text,
            fontSize: 14,
            axis: {
              ticks: {
                text: { fill: DRACULA_COLORS.text },
              },
              legend: {
                text: {
                  fill: DRACULA_COLORS.text,
                  fontWeight: "bold",
                },
              },
            },
            grid: {
              line: { stroke: DRACULA_COLORS.gridLine, strokeWidth: 1 },
            },
          }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 10,
            tickRotation: 0,
            legend: "Application Status",
            legendPosition: "middle",
            legendOffset: 50,
            format: (value) => value.replace("_", " ").toUpperCase(),
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 10,
            legend: "Count",
            legendPosition: "middle",
            legendOffset: -50,
            tickValues: Array.from({ length: maxCount + 1 }, (_, i) => i), // Only whole numbers
          }}
          labelTextColor={DRACULA_COLORS.text}
          tooltip={({ indexValue, value }) => (
            <div className="bg-neutral-800 p-3 rounded-lg shadow-lg text-white flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: DRACULA_COLORS.statuses[indexValue] }}
              />
              <span className="font-semibold">
                {indexValue.replace("_", " ").toUpperCase()}: {value}
              </span>
            </div>
          )}
          motionConfig="gentle"
        />
      </div>

      {/* Status Report Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map(({ status, count }) => (
          <div
            key={status}
            className="flex items-center gap-4 p-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition"
          >
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: DRACULA_COLORS.statuses[status] + "33" }}
            >
              {status === "submitted" && (
                <FaFileImport className="text-2xl" style={{ color: DRACULA_COLORS.statuses[status] }} />
              )}
              {status === "in_review" && (
                <FaSearch className="text-2xl" style={{ color: DRACULA_COLORS.statuses[status] }} />
              )}
              {status === "accepted" && (
                <FaCheckCircle className="text-2xl" style={{ color: DRACULA_COLORS.statuses[status] }} />
              )}
              {status === "rejected" && (
                <FaTimesCircle className="text-2xl" style={{ color: DRACULA_COLORS.statuses[status] }} />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-400 capitalize">{status.replace("_", " ")}</p>
              <p className="text-2xl font-bold" style={{ color: DRACULA_COLORS.text }}>
                {count}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
