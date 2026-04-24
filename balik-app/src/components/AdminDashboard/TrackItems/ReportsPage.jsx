import { useState } from "react";
import FilterBar from "./FilterBar";
import ReportsList from "./ReportsList";

export default function ReportsPage({ reports }) {
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");

  const filteredReports = reports.filter((report) => {
    const matchesStatus = status === "All" || report.status === status;

    const matchesSearch =
      report.item.toLowerCase().includes(search.toLowerCase()) ||
      report.user.toLowerCase().includes(search.toLowerCase()) ||
      report.id.toString().includes(search);

    return matchesStatus && matchesSearch;
  });

  return (
    <>
      <FilterBar
        status={status}
        setStatus={setStatus}
        search={search}
        setSearch={setSearch}
      />

      <div className="mt-6">
        <ReportsList reports={filteredReports} />
      </div>
    </>
  );
}