import { Search } from "lucide-react";

export default function FilterBar({ status, setStatus, search, setSearch }) {
  const statuses = ["All", "Pending", "Claimed", "Rejected", "Flagged"];

  const clearFilters = () => {
    setStatus("All");
    setSearch("");
  };

  return (
    <div className="bg-gray-100 rounded-xl flex gap-4 items-center">
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 w-full">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg">Filter Track Items</h2>

          <button
            onClick={clearFilters}
            className="font-semibold text-sm text-green-600 hover:underline"
          >
            Clear All Filters
          </button>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {/* SEARCH */}
          <div className="col-span-3">
            <label className="text-sm font-semibold">Search</label>

            <div className="flex items-center relative mt-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search item / ID / user"
                className="w-full border border-gray-400 rounded-lg pl-9 pr-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* STATUS */}
          <div className="col-span-2">
            <label className="text-sm font-semibold">Status</label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="cursor-pointer w-full border border-gray-400 rounded-lg px-3 py-2 text-sm mt-1"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}