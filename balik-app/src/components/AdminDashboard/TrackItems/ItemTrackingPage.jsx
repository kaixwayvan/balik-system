import { useState, useEffect } from "react";
import StatsCards from "./StatsCards";
import FilterBar from "./FilterBar";
import ReportsList from "./ReportsList";
import { itemService } from "../../../services/itemService";

export default function ItemTrackingPage() {
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);
        const data = await itemService.getAllItems();
        
        // Map Supabase data to component format
        const mappedData = data.map(item => ({
          id: item.id.toString().slice(0, 8).toUpperCase(),
          item: item.title,
          user: item.metadata?.reporter?.name || "Unknown",
          location: item.location || "No location provided",
          activity: item.type === 'found' ? "Item found and reported" : "Lost item report submitted",
          // Map database status to UI status (Capitalized)
          status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
          time: new Date(item.created_at).toLocaleString(),
          image: item.image_url || "/camera.jpg", // Fallback image
          type: item.type // Keep for stats calculation
        }));

        setReports(mappedData);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  const filteredReports = reports.filter((report) => {
    const matchesStatus =
      status === "All" || report.status === status;

    const matchesSearch =
      report.item.toLowerCase().includes(search.toLowerCase()) ||
      report.user.toLowerCase().includes(search.toLowerCase()) ||
      report.id.toString().includes(search);

    return matchesStatus && matchesSearch;
  });

  // Calculate real-time stats
  const statsData = {
    total: reports.length,
    lost: reports.filter(r => r.type === 'lost').length,
    found: reports.filter(r => r.type === 'found').length,
    claimed: reports.filter(r => r.status === 'Claimed').length
  };

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Synchronizing with Supabase...</p>
      </div>
    );
  }

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

      <StatsCards stats={statsData} />

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