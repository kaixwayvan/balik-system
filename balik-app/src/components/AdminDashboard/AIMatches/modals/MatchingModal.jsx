export default function MatchingModal({
  loadingOpen,
  resultOpen,
  onViewMatches,
}) {
  if (!loadingOpen && !resultOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

      {resultOpen && (
        <div className="bg-white p-10 rounded-xl w-[600px] text-center">
          <h2 className="text-lg font-semibold">
            Matching Complete!
          </h2>

          <button
            onClick={onViewMatches}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            View Matches
          </button>
        </div>
      )}
    </div>
  );
}