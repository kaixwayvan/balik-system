import AIMatchesStats from "./AIMatchesStats";
import AIMatchesTable from "./AIMatchesTable";

export default function AIMatches() {
  return (
    <div className="p-6 space-y-6 bg-[#EEF1F8]">
      <div>
        <h1 className="text-2xl font-bold">AI Matches</h1>
        <p className="text-gray-500 text-sm">
          AI-generated matches between lost and found items
        </p>
      </div>

      <AIMatchesStats />
      <AIMatchesTable />
    </div>
  );
}
