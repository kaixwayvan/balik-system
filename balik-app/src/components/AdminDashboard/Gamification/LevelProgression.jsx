import { ChartNoAxesCombined, CircleArrowRight } from "lucide-react";

export default function LevelProgression({ rules }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
      <div className="flex items-center gap-2 mb-2">
        <ChartNoAxesCombined size={22} className="text-gray-700" />
        <h3 className="font-bold text-lg">
          Level Progression Rules
        </h3>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Level progression is determined automatically based on points earned and activity completed.
      </p>

      <div className="space-y-4">
        {rules.map((rule, index) => (
          <div
            key={index}
            className="border border-gray-300 shadow-sm rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div className="text-blue-800 flex items-center gap-2 text-lg font-bold">
              {rule.from} <CircleArrowRight size={15}/> {rule.to}
            </div>

            <div className="text-base text-gray-700 font-semibold italic mt-2 md:mt-0">
              {rule.requirement}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 mb-2">
        <span className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm">
          Automatically evaluated by system
        </span>
      </div>
    </div>
  );
}