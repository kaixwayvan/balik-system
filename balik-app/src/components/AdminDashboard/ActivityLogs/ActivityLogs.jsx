import { useState } from "react";
import { activityLogs } from "./helper/logsData";
import ActivityTable from "./ActivityTable";
import ActivityCard from "./ActivityCard";
import ActivityCardList from "./ActivityCardList";
import { Search, Calendar, RefreshCw } from "lucide-react";

export default function ActivityLogs() {
  const [role, setRole] = useState("All");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filtered = activityLogs.filter((log) => {
    const matchesSearch = Object.values(log).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase()),
    );

    const matchesRole =
      role === "All" || log.actor?.toLowerCase() === role.toLowerCase();

    const logDate = new Date(log.datetime);

    const matchesStart = startDate ? logDate >= new Date(startDate) : true;

    const matchesEnd = endDate
      ? logDate <= new Date(endDate + "T23:59:59")
      : true;

    return matchesSearch && matchesRole && matchesStart && matchesEnd;
  });

  return (
    <div className="p-6 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Activity Logs
          </h1>
          <p className="text-gray-500 text-sm">
            Track and filter user actions, system events, and account activities
            for auditing and security purposes.
          </p>
        </div>

        <button className="cursor-pointer flex items-center gap-3 text-white px-6 py-2 rounded-lg bg-purple-700 hover:bg-purple-800">
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg">Filter Activity Logs</h2>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setSearch("");
                setRole("All");
                setStartDate("");
                setEndDate("");
              }}
              className="cursor-pointer font-semibold text-sm text-purple-600 hover:underline"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* FILTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-semibold">Search</label>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search actor, activity, target"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-400 rounded-lg pl-9 pr-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
              <option value="Officer">Officer</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold">From Date</label>

            <div className="relative">
              <Calendar
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onClick={(e) => e.target.showPicker?.()}
                onKeyDown={(e) => e.preventDefault()}
                className="cursor-pointer w-full border border-gray-400 rounded-lg pl-9 pr-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">To Date</label>

            <div className="relative">
              <Calendar
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                onClick={(e) => e.target.showPicker?.()}
                onKeyDown={(e) => e.preventDefault()}
                className="cursor-pointer w-full border border-gray-400 rounded-lg pl-9 pr-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CARDS */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="font-medium mb-2">No activity logs found</p>
          <p className="text-sm italic">
            Try adjusting your filters or search terms
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow">
            <div className="p-5 text-lg border-b border-gray-400 flex items-center justify-between">
              <span className="font-bold">Activity Records</span>

              <span className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filtered.length}</span>{" "}
                activities
              </span>
            </div>
            <div className="hidden md:block">
              <ActivityTable logs={filtered} />
            </div>

            <div className="md:hidden mt-2 p-6">
              <ActivityCardList logs={filtered} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}