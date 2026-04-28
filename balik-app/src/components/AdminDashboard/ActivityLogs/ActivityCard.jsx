import { Eye } from "lucide-react";

export default function ActivityCard({ log }) {
  return (
    <div className="border rounded-xl p-4 mb-3 shadow-sm">
      <p className="text-sm text-gray-500">{log.datetime}</p>

      <div className="mt-2 space-y-1">
        <p><span className="font-medium">Actor:</span> {log.actor}</p>
        <p><span className="font-medium">Activity:</span> {log.activity}</p>
        <p><span className="font-medium">Target:</span> {log.target}</p>
        <p><span className="font-medium">IP:</span> {log.ip}</p>
      </div>

      <div className="flex justify-end mt-3">
        <button
          className="text-green-600 hover:text-green-800"
          aria-label="View activity details"
          title="View"
        >
          <Eye size={18} />
        </button>
      </div>
    </div>
  );
}