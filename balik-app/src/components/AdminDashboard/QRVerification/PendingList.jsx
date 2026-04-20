import PendingItemCard from "./PendingItemCard";

export default function PendingList({ items }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-semibold mb-4">Pending Verifications</h3>

      <div className="space-y-4">
        {items.map((item) => (
          <PendingItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}