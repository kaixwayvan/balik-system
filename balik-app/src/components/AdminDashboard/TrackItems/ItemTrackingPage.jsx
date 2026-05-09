import { useState } from "react";
import StatsCards from "./StatsCards";
import FilterBar from "./FilterBar";
import ReportsList from "./ReportsList";

export default function ItemTrackingPage() {
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");

  const reports = [];

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