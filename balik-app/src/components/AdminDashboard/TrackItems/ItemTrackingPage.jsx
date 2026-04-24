import { useState } from "react";
import StatsCards from "./StatsCards";
import FilterBar from "./FilterBar";
import ReportsList from "./ReportsList";

export default function ItemTrackingPage() {
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");

  const reports = [
    {
      id: 10137,
      item: "Camera",
      user: "Juan D.",
      location: "PUP-Main Library",
      activity: "Reported Submitted",
      status: "Claimed",
      time: "1 hour ago",
      image: "/camera.jpg",
    },
    {
      id: 40102,
      item: "Power Bank",
      user: "Kevin R.",
      location: "PUP South Wing",
      activity: "Admin requested additional details",
      status: "Pending",
      time: "3 hours ago",
      image: "/powerbank.jpg",
    },
    {
      id: 50988,
      item: "Blue Backpack",
      user: "Admin System",
      location: "",
      activity: "Item status updated to Claimed",
      status: "Claimed",
      time: "Sept 13, 2025",
      image: "/bag.jpg",
    },
    {
      id: 61277,
      item: "Wallet",
      user: "Anonymous",
      location: "",
      activity: "Duplicate report flagged",
      status: "Flagged",
      time: "Sept 12, 2025",
      image: "/wallet.jpg",
    },
  ];

  const filteredReports = reports.filter((report) => {
    const matchesStatus =
      status === "All" || report.status === status;

    const matchesSearch =
      report.item.toLowerCase().includes(search.toLowerCase()) ||
      report.user.toLowerCase().includes(search.toLowerCase()) ||
      report.id.toString().includes(search);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Item Tracking
        </h1>
        <p className="text-gray-500 text-sm">
          Monitor, review, and manage all reports
        </p>
      </div>

      <StatsCards />

      <FilterBar
        status={status}
        setStatus={setStatus}
        search={search}
        setSearch={setSearch}
      />

      <ReportsList reports={filteredReports} />
    </div>
  );
}