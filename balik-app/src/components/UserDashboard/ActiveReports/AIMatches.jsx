import { Brain, MapPin, CircleCheckBig } from "lucide-react";
import Id from "../../../assets/home-assets/img-items/id.png";

export default function AIMatches({ onClaim }) {
  const matches = [];

  if (matches.length === 0) return null;

  return (
    <div className="mt-6 bg-yellow-100 border border-yellow-300 rounded-xl p-5">
      <h4 className="font-bold flex items-center gap-2 mb-4">
        <Brain size={16} /> AI-Powered Match Suggestions
      </h4>

      <div className="grid grid-cols-2 gap-4">
        {matches.map((match, i) => (
          <div key={i} className="bg-white border rounded-lg p-4">
            <div className="flex gap-3">
              <img src={Id} className="w-16 h-16 rounded-md border" />

              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="text-sm font-medium">Match Confidence</p>
                  <p className="text-orange-500 font-bold">
                    {match.confidence}%
                  </p>
                </div>

                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full"
                    style={{
                      width: `${match.confidence}%`,
                      background: "linear-gradient(to right, #FFB639, #7D5014)",
                    }}
                  />
                </div>

                <p className="mt-4 text-xs text-gray-500 flex gap-1">
                  <MapPin size={14} /> {match.location}
                </p>
                <p className="text-xs text-gray-500">
                  <strong>Reported by:</strong> {match.reporter}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-4 items-center">
              <button
                onClick={onClaim}
                className="cursor-pointer flex items-center px-12 gap-2 bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-md"
              >
                <CircleCheckBig size={14} />
                Claim This Item
              </button>

              <button className="cursor-pointer flex-1 border border-red-400 text-red-600 text-sm py-2 rounded-md">
                {" "}
                Not My Item{" "}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
