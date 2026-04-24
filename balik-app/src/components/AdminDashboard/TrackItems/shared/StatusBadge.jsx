export default function StatusBadge({ status }) {
  const styles = {
    Approved: "bg-green-100 text-green-700",
    Claimed: "bg-green-100 text-green-700",
    Pending: "bg-gray-200 text-gray-700",
    Rejected: "bg-red-100 text-red-700",
    Flagged: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`px-5 py-1 mb-3 text-sm font-semibold rounded-full ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}