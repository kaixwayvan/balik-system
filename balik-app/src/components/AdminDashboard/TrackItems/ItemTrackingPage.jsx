import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import StatsCards from "./StatsCards";
import FilterBar from "./FilterBar";
import ReportsList from "./ReportsList";
import ReportDetailsModal from "./ReportDetailsModal";
import ArchiveConfirmationModal from "./ArchiveConfirmationModal";

// Simulated Backend
const initialMockItems = [
  {
    id: "item-101",
    title: "iPhone 14 Pro Max",
    type: "lost",
    status: "pending",
    location: "Student Lounge Area",
    category: "Electronics",
    description: "Deep Purple iPhone 14 Pro Max with a cracked screen protector.",
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    metadata: { reporter: { name: "Khurtdaniel" }, image_url: null },
    user_id: "user-99"
  },
  {
    id: "item-102",
    title: "Black Leather Wallet",
    type: "found",
    status: "verified",
    location: "Engineering Bldg Gym",
    category: "Personal Accessories",
    description: "Contains a local transport card and student ID card.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    metadata: { reporter: { name: "Alice Smith" }, image_url: null },
    user_id: "user-88"
  },
  {
    id: "item-103",
    title: "Hydro Flask 32oz",
    type: "found",
    status: "resolved",
    location: "Main University Library",
    category: "Hydration",
    description: "White hydro flask with custom stickers on the side.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), // ~1 day ago
    metadata: { reporter: { name: "Bob Johnson" }, image_url: null },
    user_id: "user-77"
  },
  {
    id: "item-104",
    title: "MacBook Air M2",
    type: "lost",
    status: "flagged",
    location: "Science Lab B",
    category: "Electronics",
    description: "Space gray color, inside a brown leather sleeve.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(), // ~2 days ago
    metadata: { reporter: { name: "Charlie Brown" }, image_url: null },
    user_id: "user-66"
  }
];

// In-memory array acting as our database table
let localItemsDatabase = [...initialMockItems];

const supabase = {
  from: (table) => ({
    select: () => ({
      order: () => ({
        limit: () => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({ data: [...localItemsDatabase], error: null });
            }, 600);
          });
        }
      })
    }),
    insert: (payload) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(`Mock DB: Inserted row into ${table}`, payload);
          resolve({ error: null });
        }, 400);
      });
    },
    delete: () => ({
      eq: (column, value) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            if (column === "id") {
              localItemsDatabase = localItemsDatabase.filter(item => item.id !== value);
              console.log(`Mock DB: Deleted item with ID ${value} from ${table}`);
            }
            resolve({ error: null });
          }, 400);
        });
      }
    })
  })
};

export default function ItemTrackingPage() {
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, lost: 0, found: 0, claimed: 0 });
  const [selectedReport, setSelectedReport] = useState(null);
  const [archiveModal, setArchiveModal] = useState({ isOpen: false, report: null, status: 'idle', isLoading: false });

  useEffect(() => {
    fetchReports();
  }, []);

  // --- Dynamic Document Title ---
  useEffect(() => {
    document.title = `Track Items (${reports.length}) | BALIK Admin`;

    return () => {
      document.title = "BALIK Admin";
    };
  }, [reports.length]);
  // ------------------------------

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("items")
        .select("id, title, type, status, location, created_at, metadata, user_id, category, description")
        .order("created_at", { ascending: false })
        .limit(200);

      if (error) throw error;

      const items = data || [];

      // Compute stats
      const lost = items.filter((i) => i.type === "lost").length;
      const found = items.filter((i) => i.type === "found").length;
      const claimed = items.filter((i) => i.status === "resolved").length;
      setStats({ total: items.length, lost, found, claimed });

      // Map to display shape
      const formatted = items.map((i) => {
        let activityLabel = "Report Submitted";
        if (i.status === "resolved") activityLabel = "Item status updated to Claimed";
        else if (i.status === "pending") activityLabel = "Pending admin review";
        else if (i.status === "verified") activityLabel = "Item verified by admin";
        else if (i.status === "flagged") activityLabel = "Item marked as flagged";

        const created = new Date(i.created_at);
        const now = new Date();
        const diffMs = now - created;
        const diffH = Math.floor(diffMs / 3600000);
        const diffD = Math.floor(diffMs / 86400000);
        
        let timeAgo = "Just now";
        if (diffH >= 1 && diffH < 24) {
          timeAgo = `${diffH} hour${diffH !== 1 ? "s" : ""} ago`;
        } else if (diffH >= 24) {
          timeAgo = `${diffD} day${diffD !== 1 ? "s" : ""} ago`;
        }

        return {
          id: i.id,
          item: i.title || i.category || "Unknown Item",
          user: i.metadata?.reporter?.name || "Anonymous",
          location: i.location || "—",
          activity: activityLabel,
          status: i.status === "resolved" ? "Claimed" : i.status.charAt(0).toUpperCase() + i.status.slice(1),
          time: timeAgo,
          image: i.metadata?.image_url || null,
          type: i.type,
          _raw: i,
        };
      });

      setReports(formatted);
    } catch (err) {
      console.error("Error fetching track items:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesStatus = status === "All" || report.status === status;
    const matchesSearch =
      report.item.toLowerCase().includes(search.toLowerCase()) ||
      report.user.toLowerCase().includes(search.toLowerCase()) ||
      report.id.toString().includes(search);
    return matchesStatus && matchesSearch;
  });

  const handleConfirmArchive = async (reportId) => {
    setArchiveModal((prev) => ({ ...prev, isLoading: true }));
    try {
      const report = reports.find((r) => r.id === reportId);
      if (!report) throw new Error("Report not found");
      const raw = report._raw;

      const { error: insertError } = await supabase.from("archived_items").insert({
        original_id: reportId, title: raw.title, type: raw.type, status: raw.status, location: raw.location, category: raw.category, description: raw.description, metadata: raw.metadata, user_id: raw.user_id, original_created_at: raw.created_at, archived_at: new Date().toISOString(),
      });
      if (insertError) throw insertError;

      const { error: deleteError } = await supabase.from("items").delete().eq("id", reportId);
      if (deleteError) throw deleteError;

      setReports((prev) => prev.filter((r) => r.id !== reportId));
      setStats((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
        lost: raw.type === "lost" ? Math.max(0, prev.lost - 1) : prev.lost,
        found: raw.type === "found" ? Math.max(0, prev.found - 1) : prev.found,
        claimed: raw.status === "resolved" ? Math.max(0, prev.claimed - 1) : prev.claimed,
      }));

      setArchiveModal((prev) => ({ ...prev, status: 'success', isLoading: false }));
      setTimeout(() => setArchiveModal({ isOpen: false, report: null, status: 'idle', isLoading: false }), 2000);
    } catch (err) {
      console.error("Error archiving:", err);
      setArchiveModal((prev) => ({ ...prev, status: 'error', isLoading: false }));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-full overflow-y-auto bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] space-y-6 sm:space-y-8 custom-scrollbar relative"
    >
      <StatsCards stats={stats} loading={loading} />

      <FilterBar status={status} setStatus={setStatus} search={search} setSearch={setSearch} />

      <ReportsList 
        reports={filteredReports} 
        loading={loading}
        onViewReport={setSelectedReport}
        onArchive={(report) => setArchiveModal({ isOpen: true, report, status: 'idle', isLoading: false })}
      />

      {typeof document !== "undefined" && createPortal(
        <>
          <AnimatePresence>
            {selectedReport && (
              <ReportDetailsModal report={selectedReport} onClose={() => setSelectedReport(null)} />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {archiveModal.isOpen && (
              <ArchiveConfirmationModal
                report={archiveModal.report}
                isOpen={archiveModal.isOpen}
                isLoading={archiveModal.isLoading}
                status={archiveModal.status}
                onConfirm={handleConfirmArchive}
                onClose={() => setArchiveModal({ isOpen: false, report: null, status: 'idle', isLoading: false })}
              />
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </motion.div>
  );
}