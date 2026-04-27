export const statusStyles = {
  approved: { bg: "bg-green-100", text: "text-green-700" },
  pending: { bg: "bg-yellow-100", text: "text-yellow-700" },
  rejected: { bg: "bg-red-100", text: "text-red-700" },
  claimed: { bg: "bg-green-100", text: "text-green-700" },
  flagged: { bg: "bg-yellow-100", text: "text-yellow-700" },
  active: { bg: "bg-green-100", text: "text-green-700" },
  restricted: { bg: "bg-red-100", text: "text-red-700" },
  default: { bg: "bg-gray-100", text: "text-gray-600" },
};

export const actionColors = {
  View: "text-green-600",
  Restrict: "text-yellow-500",
  Block: "text-red-600",
  Archive: "text-gray-500",
};

export default function StatusBadge({ status }) {
  if (!status) return null;

  const normalized = status.toLowerCase();
  const { bg, text } = statusStyles[normalized] || statusStyles.default;

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${bg} ${text}`}>
      {status}
    </span>
  );
}