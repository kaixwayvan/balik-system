import { useState, useEffect } from "react";
import ActivityCard from "./ActivityCard";

export default function ActivityCardList({ logs }) {
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
    <div>
      {paginatedLogs.map((log) => (
        <ActivityCard key={log.id} log={log} />
      ))}

      {/* PAGINATION */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
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
                : "hover:bg-gray-100"
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
                : "hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}