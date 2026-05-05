import { useState } from "react";

import AIMatchRow from "./AIMatchRow";
import RunAIMatchingModal from "./modals/RunAIMatchingModal";
import MatchingModal from "./modals/MatchingModal";
import MatchingCompleteModal from "./modals/MatchingCompleteModal";
import MatchDetailsModal from "./modals/MatchDetailsModal";

import { SquaresExclude } from "lucide-react";

const headers = ["Lost Item", "Found Item", "Confidence", "Status", "Actions"];

const defaultMatches = [
  {
    id: 1,
    lost: "Blue Nike Backpack",
    lostEmail: "john.doe@gmail.com",
    lostDate: "1/15/2024",
    found: "Blue Backpack",
    foundEmail: "jane.smith@gmail.com",
    foundDate: "1/16/2024",
    confidence: 95,
    status: "Pending",
  },
  {
    id: 2,
    lost: "Blue Nike Backpack",
    lostEmail: "john.doe@gmail.com",
    lostDate: "1/15/2024",
    found: "Blue Backpack",
    foundEmail: "jane.smith@gmail.com",
    foundDate: "1/16/2024",
    confidence: 88,
    status: "Pending",
  },
  {
    id: 3,
    lost: "Blue Nike Backpack",
    lostEmail: "john.doe@gmail.com",
    lostDate: "1/15/2024",
    found: "Blue Backpack",
    foundEmail: "jane.smith@gmail.com",
    foundDate: "1/16/2024",
    confidence: 95,
    status: "Approved",
  },
];

<<<<<<< HEAD
export default function AIMatchesTable({ matches, loading, counts }) {
  const data = loading ? [] : matches;
=======
export default function AIMatchesTable({ matches }) {
  const data = matches?.length ? matches : defaultMatches;
>>>>>>> a5afc5cb (ADMIN to QR. QR not yet finished)

  /**
   * AI FLOW STATE
   * idle → setup → loading → result
   */
  const [aiStage, setAiStage] = useState("idle");
  const [selectedMatch, setSelectedMatch] = useState(null);
<<<<<<< HEAD
  const [processingTime, setProcessingTime] = useState("0.0");
=======
>>>>>>> a5afc5cb (ADMIN to QR. QR not yet finished)

  /* ---------------- AI FLOW ---------------- */

  const openSetupModal = () => setAiStage("setup");

  const closeAllModals = () => setAiStage("idle");

  const startMatching = () => {
    setAiStage("processing");
<<<<<<< HEAD
    const startTime = performance.now();
    setTimeout(() => {
      const endTime = performance.now();
      setProcessingTime(((endTime - startTime) / 1000).toFixed(1));
=======
    setTimeout(() => {
>>>>>>> a5afc5cb (ADMIN to QR. QR not yet finished)
      setAiStage("complete");
    }, 2500);
  };

  const handleViewMatches = () => {
    setSelectedMatch(data[0]);
    setAiStage("details");
  };

  const handleAction = (action, match) => {
    console.log(action.toUpperCase(), match);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="flex justify-between items-center p-5 border-b border-gray-400">
        <h2 className="font-bold text-lg">Recent AI Matches</h2>

        <button
          onClick={openSetupModal}
          className="cursor-pointer flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
        >
          <SquaresExclude size={16} />
          Run AI Matching
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr className="text-left uppercase border-b border-gray-300">
            {headers.map((h) => (
              <th key={h} className="px-6 py-4">
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
<<<<<<< HEAD
          {loading ? (
            <tr><td colSpan="5" className="px-6 py-6 text-center text-gray-500">Loading matches...</td></tr>
          ) : data.length === 0 ? (
            <tr><td colSpan="5" className="px-6 py-6 text-center text-gray-500">No AI matches found.</td></tr>
          ) : data.map((match) => (
=======
          {data.map((match) => (
>>>>>>> a5afc5cb (ADMIN to QR. QR not yet finished)
            <AIMatchRow key={match.id} match={match} onAction={handleAction} />
          ))}
        </tbody>
      </table>

      {/* SETUP MODAL */}
      <RunAIMatchingModal
        open={aiStage === "setup" || aiStage === "processing"}
        onClose={closeAllModals}
        onStart={startMatching}
        isProcessing={aiStage === "processing"}
<<<<<<< HEAD
        counts={counts || { lost: 0, found: 0 }}
=======
>>>>>>> a5afc5cb (ADMIN to QR. QR not yet finished)
      />

      {/* LOADING + RESULT MODAL */}
      <MatchingModal
        resultOpen={aiStage === "complete"}
        onViewMatches={closeAllModals}
      />

      <MatchingCompleteModal
        open={aiStage === "complete"}
        onViewMatches={handleViewMatches}
<<<<<<< HEAD
        matches={matches}
        processingTime={processingTime}
=======
>>>>>>> a5afc5cb (ADMIN to QR. QR not yet finished)
      />

      <MatchDetailsModal
        open={aiStage === "details"}
        match={selectedMatch}
        onClose={() => setAiStage("idle")}
      />
    </div>
  );
}
