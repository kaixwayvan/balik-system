import { useState, useEffect } from "react";
import { Eye } from "lucide-react";

export default function ActivityTable({ logs }) {
  const columns = [
    { key: "datetime", label: "Date & Time" },
    { key: "actor", label: "Actor" },
    { key: "activity", label: "Activity" },
    { key: "target", label: "Target" },
    { key: "ip", label: "IP Address" },
  ];

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);

  const paginatedLogs = logs.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setPage(1);
  }, [logs]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr className="text-left uppercase border-b border-gray-300">
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-4 text-gray-500">
                {col.label}
              </th>
            ))}
            <th className="px-6 py-4 text-gray-500 text-center">View</th>
          </tr>
        </thead>

        <tbody>
          {paginatedLogs.map((log) => (
            <tr
              key={log.id}
              className="border-b border-gray-300 text-black hover:bg-gray-50"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-5 font-semibold">
                  {log[col.key]}
                </td>
              ))}

              <td className="px-6 py-5 text-center">
                <button className="text-green-600 hover:text-green-800">
                  <Eye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="flex items-center justify-between px-6 py-4 text-sm text-gray-600">
        <span>
          Page <span className="font-semibold">{page}</span> of{" "}
          <span className="font-semibold">{totalPages || 1}</span>
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className={`px-4 py-1 rounded border ${
              page === 1
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100 cursor-pointer"
            }`}
          >
            Prev
          </button>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages || totalPages === 0}
            className={`px-4 py-1 rounded border ${
              page === totalPages || totalPages === 0
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100 cursor-pointer"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}