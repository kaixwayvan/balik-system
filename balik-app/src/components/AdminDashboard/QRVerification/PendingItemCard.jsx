import StatusBadge from "./shared/StatusBadge";

export default function PendingItemCard({ item }) {
  return (
    <div className="border rounded-lg flex-col gap-4">
      <div className="flex p-4 gap-2">
        <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 rounded object-cover"
      />

      <div className="flex-1">
        <h4 className="font-semibold">{item.name}</h4>
        <p className="text-sm text-gray-500">{item.category}</p>

        <p className="text-xs mt-1">QR: {item.qr}</p>

        <div className="mt-2">
          <StatusBadge status={item.status} />
        </div>
      </div>
      </div>

      <div className="p-4 text-xs text-gray-500 border-t border-gray-300">
        <p>
          <b>Owner:</b> {item.owner}
        </p>
        <p>
          <b>Claimer:</b> {item.claimer}
        </p>
        <p>
          <b>Matched:</b> {item.date}
        </p>
      </div>
    </div>
  );
}
