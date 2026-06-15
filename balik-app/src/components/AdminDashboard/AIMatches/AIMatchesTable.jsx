import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { SquaresExclude, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import AIMatchRow from "./AIMatchRow";

import RunAIMatchingModal from "./modals/RunAIMatchingModal";
import MatchingModal from "./modals/MatchingModal";
import MatchingCompleteModal from "./modals/MatchingCompleteModal";
import MatchDetailsModal from "./modals/MatchDetailsModal";
import ApproveMatchModal from "./modals/statusModal/ApproveMatchModal";
import RejectMatchModal from "./modals/statusModal/RejectMatchModal";
import NotifyModal from "./modals/statusModal/NotifyModal";
import GenerateQRModal from "./modals/statusModal/GenerateQRModal";
import MatchSuccessModal from "./modals/statusModal/MatchSuccessModal";

const supabase = {
  from: () => ({ update: () => ({ eq: async () => ({ error: null }) }) }),
};
const sendNotification = async () => console.log("Simulated sendNotification");
const sendEmailNotification = async () => console.log("Simulated email");

const headers = ["Lost Item", "Found Item", "Confidence", "Status", "Actions"];

export default function AIMatchesTable({
  matches,
  loading,
  counts,
  onRunMatching,
  onRefreshMatches,
  isRunningMatch,
}) {
  const data = loading ? [] : matches;

  const [aiStage, setAiStage] = useState("idle");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [activeSubModal, setActiveSubModal] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successInfo, setSuccessInfo] = useState({ title: "", message: "" });
  const [processingTime, setProcessingTime] = useState(null);
  const startTimeRef = useRef(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  const openSetupModal = () => setAiStage("setup");
  const closeAllModals = () => setAiStage("idle");

  useEffect(() => {
    if (location.state?.runAI) {
      openSetupModal();
      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // --- THIS IS THE FIXED FUNCTION ---
  const startMatching = async () => {
    startTimeRef.current = Date.now();
    
    // 1. Tell React to switch to the processing view
    setAiStage("processing");

    // 2. CRITICAL FIX: Yield the main thread for 50ms to allow the browser to paint the loading UI
    await new Promise((resolve) => setTimeout(resolve, 50));

    // 3. BUFFER: Add a 1.5s delay so the user actually sees the beautiful animation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      if (onRunMatching) await onRunMatching();
    } catch (err) {
      console.error("AI matching failed:", err);
    } finally {
      const elapsed = ((Date.now() - startTimeRef.current) / 1000).toFixed(1);
      setProcessingTime(elapsed);
      setAiStage("complete");
    }
  };
  // ----------------------------------

  const handleViewMatches = () => {
    setSelectedMatch(data[0]);
    setAiStage("details");
  };

  const handleAction = (action, match) => {
    setSelectedMatch(match);
    if (action === "view") setAiStage("details");
    else setActiveSubModal(action);
  };

  const handleConfirmApprove = async () => {
    if (!selectedMatch) return;
    try {
      await supabase.from("items").update({ status: "matched" }).eq("id", selectedMatch.lost_id);
      await supabase.from("items").update({ status: "matched" }).eq("id", selectedMatch.found_id);
      if (onRefreshMatches) await onRefreshMatches();
      
      setSuccessInfo({
        title: "Match Approved!",
        message: "The items have been successfully linked. The owner has been notified.",
      });
      setShowSuccessModal(true);
      setActiveSubModal(null);
    } catch (err) {
      console.error(err);
      alert("Failed to approve match.");
    }
  };

  const handleConfirmReject = async () => {
    if (!selectedMatch) return;
    try {
      setSuccessInfo({
        title: "Match Rejected",
        message: "The match has been removed from your active list.",
      });
      setShowSuccessModal(true);
      setActiveSubModal(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendNotification = async (message, qrCodeUrl, qrImage) => {
    if (!selectedMatch) return;
    try {
      await sendNotification({ title: "Match Found", message: message, userId: selectedMatch.lost_user_id, type: "success" });
      await sendEmailNotification({ to: selectedMatch.lostEmail, subject: "Match Found", body: message, isHtml: true });
      
      setSuccessInfo({
        title: "Notification Sent!",
        message: `Email dispatched to ${selectedMatch.lostEmail}.`,
      });
      setActiveSubModal(null);
      setAiStage("idle");
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      alert("Failed to send notification.");
    }
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden flex flex-col w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 sm:p-6 border-b border-slate-100 gap-4">
        <h2 className="font-black text-xl text-slate-800 tracking-tight uppercase">Matched Items</h2>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openSetupModal}
          className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition-all active:scale-95 uppercase tracking-wider outline-none focus:ring-2 focus:ring-purple-500/40"
        >
          <Sparkles size={18} strokeWidth={3} />
          Run AI Matching
        </motion.button>
      </div>

      {/* Table Wrapper */}
      <div className="w-full overflow-x-auto overflow-y-visible pb-4 shrink-0 [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar-track]:bg-[#5C1313]/5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#5C1313]/40 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#5C1313]/70">
        <table className="w-full text-sm text-left whitespace-nowrap min-w-[900px] border-collapse">
          <thead className="bg-slate-50/80 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/60">
            <tr>
              {headers.map((h) => (
                <th key={h} className="px-6 py-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.tr key="table-loading-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-400 font-bold animate-pulse">
                    Analyzing database patterns...
                  </td>
                </motion.tr>
              ) : data.length === 0 ? (
                <motion.tr key="table-empty-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="bg-slate-100 p-4 rounded-full text-slate-400">
                        <SquaresExclude size={32} />
                      </div>
                      <p className="text-base font-bold">No active matches</p>
                      <p className="text-sm text-slate-400 max-w-sm text-wrap">
                        {counts?.lost ?? 0} lost and {counts?.found ?? 0} found items eligible. 
                      </p>
                    </div>
                  </td>
                </motion.tr>
              ) : (
                data.map((match, idx) => (
                  <AIMatchRow 
                    key={match?.id ? `match-${match.id}` : `fallback-row-${idx}`} 
                    match={match} 
                    onAction={handleAction} 
                    index={idx} 
                  />
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            <RunAIMatchingModal key="run-modal" open={aiStage === "setup" || aiStage === "processing"} onClose={closeAllModals} onStart={startMatching} isProcessing={aiStage === "processing"} counts={counts || { lost: 0, found: 0 }} />
            <MatchingModal key="match-modal" resultOpen={aiStage === "complete"} onViewMatches={closeAllModals} />
            <MatchingCompleteModal key="complete-modal" open={aiStage === "complete"} onViewMatches={handleViewMatches} onClose={closeAllModals} matches={matches} processingTime={processingTime} />
            <MatchDetailsModal key="details-modal" open={aiStage === "details"} match={selectedMatch} onConfirmApprove={handleConfirmApprove} onConfirmReject={handleConfirmReject} onSendNotification={handleSendNotification} onClose={() => setAiStage("idle")} />
            <ApproveMatchModal key="approve-modal" open={activeSubModal === "approve"} match={selectedMatch} onConfirm={handleConfirmApprove} onClose={() => setActiveSubModal(null)} />
            <RejectMatchModal key="reject-modal" open={activeSubModal === "reject"} match={selectedMatch} onConfirm={handleConfirmReject} onClose={() => setActiveSubModal(null)} />
            <NotifyModal key="notify-modal" open={activeSubModal === "notify"} match={selectedMatch} onSend={handleSendNotification} onClose={() => setActiveSubModal(null)} />
            <GenerateQRModal key="qr-modal" open={activeSubModal === "qr"} match={selectedMatch} onClose={() => setActiveSubModal(null)} />
            <MatchSuccessModal key="success-modal" open={showSuccessModal} title={successInfo.title} message={successInfo.message} onClose={() => setShowSuccessModal(false)} />
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}