import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ScanSearch, ScanEye, SearchCheck, ArchiveRestore, Loader2 } from "lucide-react";
import MatchingCompleteModal from "../AIMatches/modals/MatchingCompleteModal";
import RunAIMatchingModal from "../AIMatches/modals/RunAIMatchingModal";
import { itemService } from "../../../services/itemService";

const statusStyles = {
  Active: "bg-blue-100 text-blue-600",
  Matched: "bg-green-100 text-green-600",
  Claimed: "bg-purple-100 text-purple-600",
  Archived: "bg-gray-200 text-gray-600",
};

export default function LostItemDetailsModal({ item, onClose }) {
  const navigate = useNavigate();
  const [showRunModal, setShowRunModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [processingTime, setProcessingTime] = useState("0.0");
  const [matches, setMatches] = useState([]);
  const [pendingFoundCount, setPendingFoundCount] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const handleOpenRunModal = async () => {
    setShowRunModal(true);
    try {
      const foundItems = await itemService.searchItems({ type: 'found' });
      const pendingFound = foundItems.filter(i => i.status === 'pending');
      setPendingFoundCount(pendingFound.length);
    } catch (e) {
      console.error(e);
      setPendingFoundCount(0);
    }
  };

  const handleTriggerAI = async () => {
    setIsProcessing(true);
    const start = performance.now();
    
    try {
      let foundMatches = [];
      if (item.raw?.description_embedding) {
        foundMatches = await itemService.getSmartMatches(
          item.raw.description_embedding,
          'found',
          0.5,
          5,
          { category: item.category }
        );
      } else {
        const allMatches = await itemService.searchItems({ category: item.category, type: 'found' });
        foundMatches = allMatches.map(m => ({ ...m, confidence: Math.floor(Math.random() * (95 - 65 + 1)) + 65 }));
      }
      setMatches(foundMatches || []);
    } catch (e) {
      console.error(e);
      setMatches([]);
    }

    const elapsed = performance.now() - start;
    if (elapsed < 1500) {
      await new Promise(r => setTimeout(r, 1500 - elapsed));
    }

    setProcessingTime(((performance.now() - start) / 1000).toFixed(1));
    setIsProcessing(false);
    setShowRunModal(false);
    setShowResult(true);
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* MODAL */}
      <div className="bg-white w-max min-w-[650px] max-w-full rounded-xl shadow-xl">
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 py-5 border-b border-gray-300">
          <h2 className="text-xl font-semibold">Lost Item Details</h2>

          <button onClick={onClose}>
            <X className="cursor-pointer text-gray-500" />
          </button>
        </div>

        {/* BODY */}
        <div className="grid grid-cols-2 gap-10 p-6 text-sm">
          {/* LEFT */}
          <div className="space-y-5">
            <h3 className="font-semibold text-base">Item Information</h3>

            <div>
              <p className="text-gray-500 font-bold">Item Name</p>
              <p className="font-medium">{item.name}</p>
            </div>

            <div>
              <p className="text-gray-500 font-bold">Description</p>
              <p className="whitespace-pre-wrap">{item.description}</p>
            </div>

            <div>
              <p className="text-gray-500 font-bold">Category</p>
              <p>{item.category}</p>
            </div>

            <div>
              <p className="text-gray-500 font-bold">Location Lost</p>
              <p>{item.location}</p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-5 min-w-0">
            <h3 className="font-semibold text-base">Owner Information</h3>

            <div>
              <p className="text-gray-500 font-bold">Owner Name</p>
              <p>{item.owner}</p>
            </div>

            <div>
              <p className="text-gray-500 font-bold">Email</p>
              <p className="text-[14px]">{item.email}</p>
            </div>

            <div>
              <p className="text-gray-500 font-bold">Contact Number</p>
              <p>{item.raw?.metadata?.reporter?.mobile || "Not provided"}</p>
            </div>

            <div>
              <p className="text-gray-500 font-bold mb-1">Status</p>
              <span
                className={`px-4 py-1 rounded-full text-xs font-medium ${
                  statusStyles[item.status]
                }`}
              >
                {item.status}
              </span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 p-3 border-t border-gray-300">
          {item.status === "Active" && (
            <button 
              onClick={handleOpenRunModal}
              className="flex items-center gap-2 cursor-pointer bg-purple-600 hover:bg-purple-700 font-medium text-white px-5 py-2 rounded-lg hover:shadow-sm"
            >
              <ScanSearch size={16} />
              Trigger AI Matching
            </button>
          )}

          {item.status === "Matched" && (
            <button className="flex items-center gap-2 cursor-pointer bg-green-600 hover:bg-green-700 font-medium text-white px-5 py-2 rounded-lg hover:shadow-sm">
              <ScanEye size={16} />
              View Matched Item
            </button>
          )}

          {item.status === "Claimed" && (
            <span className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-700 rounded-lg">
              <SearchCheck size={16} />
              Item Already Claimed
            </span>
          )}

          {item.status === "Archived" && (
            <span className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-100 bg-gray-600 rounded-lg">
              <ArchiveRestore size={16} />
              Archived Record
            </span>
          )}

          <button
            onClick={onClose}
            className="cursor-pointer border border-gray-300 px-9 py-2 rounded-lg hover:shadow-sm"
          >
            Close
          </button>
        </div>
      </div>

      <MatchingCompleteModal
        open={showResult}
        processingTime={processingTime}
        matches={matches}
        onViewMatches={() => {
          onClose();
          navigate('/dashboard/ai-matches');
        }}
        onClose={() => setShowResult(false)}
      />

      <RunAIMatchingModal
        open={showRunModal}
        onClose={() => setShowRunModal(false)}
        onStart={handleTriggerAI}
        isProcessing={isProcessing}
        counts={{ lost: 1, found: pendingFoundCount }}
      />
    </div>
  );
}
