export const STATUS = {
  APPROVED: "Approved",
  PENDING: "Pending",
  REJECTED: "Rejected",
};

export const getStatusStyle = (status) => {
  switch (status) {
    case STATUS.APPROVED:
      return "bg-green-100 text-green-600";
    case STATUS.PENDING:
      return "bg-yellow-100 text-yellow-700";
    case STATUS.REJECTED:
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export const getConfidenceStyle = (value) => {
  if (value >= 90) return "bg-green-100 text-green-600";
  if (value >= 70) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-600";
};

export const STATUS_ACTIONS = {
  Approved: ["view", "notify", "qr"],
  Rejected: ["view", "notify", "qr"],
  Pending: ["view", "approve", "reject", "notify", "qr"],
};