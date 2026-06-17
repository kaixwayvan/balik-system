import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, AlertCircle } from "lucide-react";
import AIMatchesStats from "./AIMatchesStats";
import AIMatchesTable from "./AIMatchesTable";

// --- SIMULATED BACKEND SERVICES ---
const itemService = {
  backfillMissingEmbeddings: async () => {
    console.log("Simulating backfillMissingEmbeddings...");
    return { processed: 0, updated: 0 };
  },
};

const computeMatchesFromDatabase = async () => {
  console.log("Simulating computeMatchesFromDatabase...");
  return {
    matches: [],
    counts: {
      lost: 12,
      found: 8,
      lostMissingEmbedding: 2,
      foundWithEmbedding: 8,
      lostWithEmbedding: 10,
    },
  };
};

export default function AIMatches() {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [counts, setCounts] = useState({
    lost: 0,
    found: 0,
    lostWithEmbedding: 0,
    foundWithEmbedding: 0,
    lostMissingEmbedding: 0,
  });
  const [loading, setLoading] = useState(true);
  const [runningMatch, setRunningMatch] = useState(false);
  const [error, setError] = useState(null);
  const [filteredCount, setFilteredCount] = useState(0);

  const CONFIDENCE_THRESHOLD = 40;

  const fetchNlpMatches = useCallback(async () => {
    setError(null);
    const result = await computeMatchesFromDatabase({
      threshold: 0.35,
      matchCount: 8,
    });
    setMatches(result.matches);

    const qualityMatches = result.matches.filter(
      (m) => m.confidence >= CONFIDENCE_THRESHOLD
    );
    setFilteredMatches(qualityMatches);
    setFilteredCount(result.matches.length - qualityMatches.length);

    setCounts(result.counts);
    return result;
  }, []);

  const runAiMatching = useCallback(async () => {
    setRunningMatch(true);
    setError(null);
    try {
      console.log("🔄 Backfilling missing embeddings from database...");
      await itemService.backfillMissingEmbeddings(15, {
        prioritizeType: "lost",
      });
      await itemService.backfillMissingEmbeddings(10, {
        prioritizeType: "found",
      });
      return await fetchNlpMatches();
    } catch (err) {
      console.error("AI matching run failed:", err);
      setError(err.message || "Failed to run AI matching");
      throw err;
    } finally {
      setRunningMatch(false);
    }
  }, [fetchNlpMatches]);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        itemService
          .backfillMissingEmbeddings(5, { prioritizeType: "lost" })
          .catch((err) => console.warn("Background backfill:", err));
        await fetchNlpMatches();
      } catch (err) {
        console.error("Match error:", err);
        setError(err.message || "Failed to load matches");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [fetchNlpMatches]);

  // --- Dynamic Document Title ---
  useEffect(() => {
    document.title = `AI Matches (${filteredMatches.length}) | BALIK Admin`;

    return () => {
      document.title = "BALIK Admin";
    };
  }, [filteredMatches.length]);
  // ------------------------------

  // Framer Motion Variants
  const notifVariants = {
    hidden: { opacity: 0, height: 0, scale: 0.95, marginBottom: 0 },
    visible: { opacity: 1, height: "auto", scale: 1, marginBottom: 16 },
    exit: { opacity: 0, height: 0, scale: 0.95, marginBottom: 0 },
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }} 
      className="h-full rounded-[2rem] bg-white/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-200/60 overflow-y-auto space-y-6 sm:space-y-8 pb-12"
    >
      {/* Main Container */}
      <div className="p-6 sm:p-8 rounded-[2rem] w-full relative shrink-0 flex flex-col gap-3">
        
        {/* Notifications Area */}
        <div className="flex flex-col w-full overflow-hidden">
          <AnimatePresence mode="popLayout">
            {counts.lostMissingEmbedding > 0 && (
              <motion.div
                key="missing-embedding-notif"
                variants={notifVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-amber-50/60 backdrop-blur-md border border-amber-200/80 p-4 sm:p-3 rounded-3xl flex items-start sm:items-center gap-3.5 text-amber-800 shadow-sm"
              >
                <div className="bg-amber-100 p-2 rounded-xl shrink-0 mt-0.5 sm:mt-0">
                  <AlertCircle className="text-amber-600" size={20} strokeWidth={2.5} />
                </div>
                <p className="text-sm font-semibold tracking-wide leading-relaxed">
                  <span className="font-black text-amber-900">{counts.lostMissingEmbedding}</span> lost item{counts.lostMissingEmbedding === 1 ? "" : "s"} still need description embeddings. Click <b className="text-amber-900">Run AI Matching</b> to generate them.
                </p>
              </motion.div>
            )}

            {filteredCount > 0 && (
              <motion.div
                key="filtered-matches-notif"
                variants={notifVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-blue-50/60 backdrop-blur-md border border-blue-200/80 p-4 sm:p-5 rounded-2xl flex items-start sm:items-center gap-3.5 text-blue-800 shadow-sm"
              >
                <div className="bg-blue-100 p-2 rounded-xl shrink-0 mt-0.5 sm:mt-0">
                  <Info className="text-blue-600" size={20} strokeWidth={2.5} />
                </div>
                <p className="text-sm font-semibold tracking-wide leading-relaxed">
                  <span className="font-black text-blue-900">{filteredCount}</span> match{filteredCount === 1 ? "" : "es"} filtered out <span className="opacity-80">(confidence below 40%)</span>.
                </p>
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error-notif"
                variants={notifVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-red-50/60 backdrop-blur-md border border-red-200/80 p-4 sm:p-5 rounded-2xl flex items-start sm:items-center gap-3.5 text-red-800 shadow-sm"
              >
                <div className="bg-red-100 p-2 rounded-xl shrink-0 mt-0.5 sm:mt-0">
                  <AlertCircle className="text-red-600" size={20} strokeWidth={2.5} />
                </div>
                <p className="text-sm font-semibold tracking-wide leading-relaxed">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats Grid */}
        <AIMatchesStats matches={filteredMatches} />

        {/* Data Table */}
        <AIMatchesTable
          matches={filteredMatches}
          loading={loading}
          counts={counts}
          onRunMatching={runAiMatching}
          onRefreshMatches={fetchNlpMatches}
          isRunningMatch={runningMatch}
        />
      </div>
    </motion.div>
  );
}