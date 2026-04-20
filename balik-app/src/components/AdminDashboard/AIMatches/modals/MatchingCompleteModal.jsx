import { CheckCircle } from "lucide-react";

export default function MatchingCompleteModal({
  open,
  onViewMatches,
  onClose,
  matches = []
}) {
  if (!open) return null;

  const total = matches.length;
  const high = matches.filter(m => m.confidence >= 90).length;
  const med = matches.filter(m => m.confidence >= 70 && m.confidence < 90).length;
  const low = matches.filter(m => m.confidence < 70).length;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-[720px] rounded-xl p-8 space-y-6">

        {/* ICON */}
        <div className="flex justify-center">
          <div className="bg-green-100 p-5 rounded-full">
            <CheckCircle className="text-green-600" size={40} />
          </div>
        </div>

        {/* TITLE */}
        <div className="text-center">
          <h2 className="text-xl font-semibold">
            Matching Complete!
          </h2>
          <p className="text-gray-500">
            AI has analyzed all items and generated new matches
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-green-400 rounded-lg p-5 text-center bg-green-50">
            <p className="text-green-700 font-medium">
              New Matches Found
            </p>
            <p className="text-2xl font-bold">{total}</p>
          </div>

          <div className="border border-blue-400 rounded-lg p-5 text-center bg-blue-50">
            <p className="text-blue-700 font-medium">
              Processing Time
            </p>
            <p className="text-2xl font-bold">2.3s</p>
          </div>
        </div>

        {/* CONFIDENCE SUMMARY */}
        <div className="space-y-3 text-sm">
          <Row label="High Confidence (>90%)" value={`${high} ${high === 1 ? 'match' : 'matches'}`} color="text-green-600" />
          <Row label="Medium Confidence (70–90%)" value={`${med} ${med === 1 ? 'match' : 'matches'}`} color="text-yellow-600" />
          <Row label="Low Confidence (<70%)" value={`${low} ${low === 1 ? 'match' : 'matches'}`} color="text-red-600" />
        </div>

        {/* NEXT STEP */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          <h3 className="font-extrabold text-base text-yellow-600">Next Steps</h3>
          <p>Review the new matches in the table below. Approve high-confidence
matches and verify medium/low confidence matches manually before notifying owners.</p>
        </div>

        {/* BUTTON */}
        <button
          onClick={onViewMatches}
          className="cursor-pointer w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
        >
          View Matches
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, color }) {
  return (
    <div className="flex justify-between bg-gray-100 rounded-lg px-4 py-3">
      <span>{label}</span>
      <span className={`${color} font-bold`}>{value}</span>
    </div>
  );
}