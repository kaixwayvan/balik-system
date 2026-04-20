import StatusBadge from "./shared/StatusBadge";

export default function RecentVerificationsTable({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-sm mt-6">
      <div className="p-5 border-b">
        <h3 className="font-semibold">Recent Verifications</h3>
      </div>

      <table className="w-full text-sm">
        <thead className="text-gray-500 bg-gray-50">
          <tr>
            <th className="p-4 text-left">Item</th>
            <th>QR Code</th>
            <th>Owner/Claimer</th>
            <th>Status</th>
            <th>Verified At</th>
            <th>Points</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-4 flex gap-3 items-center">
                <img src={item.image} className="w-10 h-10 rounded" />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.category}</p>
                </div>
              </td>

              <td>{item.qr}</td>

              <td>
                <p>{item.owner}</p>
                <p className="text-xs text-gray-500">{item.claimer}</p>
              </td>

              <td>
                <StatusBadge status={item.status} />
              </td>

              <td>{item.verifiedAt}</td>

              <td className="text-green-600 font-semibold">
                +{item.points} pts
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}