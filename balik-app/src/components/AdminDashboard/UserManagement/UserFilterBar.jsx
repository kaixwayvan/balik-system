import { Search, Plus } from "lucide-react";

export default function UserFilterBar({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
}) {
  const clearFilters = () => {
    setRoleFilter("All");
    setSearch("");
  };

  return (
    <div className="bg-gray-100 rounded-xl">
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">

        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg">Filter Registered Users</h2>

          <button
            onClick={clearFilters}
            className="font-semibold text-sm text-green-600 hover:underline"
          >
            Clear All Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <span className="block text-sm font-semibold mb-1">
              Search
            </span>

            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user"
                className="border border-gray-400 pl-9 pr-3 py-2 rounded-lg w-full text-sm"
              />
            </div>
          </div>

          <div>
            <span className="block text-sm font-semibold mb-1">
              Role
            </span>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-400 px-3 py-2 rounded-lg w-full text-sm"
            >
              <option value="All">All Roles</option>
              <option value="Student">Students</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="flex gap-2 items-center justify-center cursor-pointer bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg w-full">
              <Plus size={13}/>
              Export Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}