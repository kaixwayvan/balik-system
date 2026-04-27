import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, RefreshCw, AlertCircle } from "lucide-react";
import { supabase } from "../../../utils/supabaseClient";
import { useAuth } from "../../../shared/context/AuthContext";
import { itemService } from "../../../services/itemService";

import ReportCard from "./ReportCard";
import ConfirmMatchModal from "./ConfirmMatchModal";
import ClaimModal from "./ClaimModal";
import { CATEGORIES } from "../../../shared/constants/categories";

import Id from "../../../assets/home-assets/img-items/id.png";
import Camera from "../../../assets/home-assets/img-items/camera.png";
import GreenWallet from "../../../assets/home-assets/img-items/wallet-green.png";

export const STATUS_STYLES = {
  matches: {
    label: "Potential Matches Found",
    cardBg: "bg-yellow-50",
    border: "border-yellow-600",
    badge: "bg-yellow-100 text-yellow-700 border-yellow-300",
    progress: "bg-yellow-500",
  },
  searching: {
    label: "Actively Searching",
    cardBg: "bg-blue-50",
    border: "border-blue-400",
    badge: "bg-blue-100 text-blue-700 border-blue-300",
    progress: "bg-blue-500",
  },
  claimed: {
    label: "Successfully Claimed",
    cardBg: "bg-green-50",
    border: "border-green-400",
    badge: "bg-green-100 text-green-700 border-green-300",
    progress: "bg-green-500",
  },
};

export default function ActiveReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openReportId, setOpenReportId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showClaim, setShowClaim] = useState(false);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    lostLocation: "",
    lostDate: "",
    description: "",
    category: "",
    otherCategory: "",
    identifiers: "",
    itemType: "",
    colorMaterial: "",
    uniqueMarks: "",
    brand: "",
    insideItems: "",
    secretItem: "",
    lastSeen: "",
  });

  const [errors, setErrors] = useState({});


  const fetchReports = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log("ActiveReports: Fetching items for user:", user.id);
      const { data, error: fetchError } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['pending', 'matching'])
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      console.log("ActiveReports: Raw items found:", data);

      // Transform data for the UI with Live Match Check
      const formattedReports = await Promise.all(data.map(async (item) => {
        // Map database status to UI status
        let uiStatus = 'searching';
        let progress = 45;
        let detectedMatches = [];

        // LIVE MATCH CHECK: Always check for matches if we have embeddings
        // This ensures we display the most up-to-date match status and can show actual match data
        if (item.description_embedding) {
          try {
            console.log(`🔍 Checking matches for item: ${item.title} (Status: ${item.status})`);
            // Parse embedding if it's returned as a string from DB
            let embedding = item.description_embedding;
            if (typeof embedding === 'string') {
              embedding = JSON.parse(embedding);
            }

            // Determine match target (Lost items search for Found, and vice versa)
            const matchTarget = item.type === 'lost' ? 'found' : 'lost';

            // Check for smart matches (threshold 0.5 aligns with multi-factor weighted scoring)
            // Weighted scoring: NLP (50%) + Color (20%) + Location (15%) + Time (15%) = max 100%
            const matches = await itemService.getSmartMatches(
              embedding,
              matchTarget,
              0.5,
              5,
              {
                category: item.category,
                color: item.metadata?.color,
                location: item.location,
                date: item.date_found || item.date_reported
              }
            );

            if (matches && matches.length > 0) {
              console.log(`🎯 NLP SMART MATCH FOUND for ${item.title}:`, matches.length, 'matches');
              uiStatus = 'matches';
              progress = 95; // Significant jump to show user we found something
              detectedMatches = matches;
            } else {
              console.log(`❌ No matches found for: ${item.title}`);
              uiStatus = 'searching';
              progress = 45;
            }
          } catch (e) {
            console.warn("⚠️ Live match check error for item", item.id, ":", e.message);
            // If match check fails, fall back to database status
            if (item.status === 'matching') {
              uiStatus = 'matches';
              progress = 95;
            }
          }
        } else {
          console.log(`⏭️ Skipping match check for ${item.title}: No Embedding (Old Item?)`);
          // For items without embeddings, use database status
          if (item.status === 'matching') {
            uiStatus = 'matches';
            progress = 95;
          }
        }

        // Handle resolved/claimed items
        if (item.status === 'resolved' || item.status === 'claimed') {
          uiStatus = 'claimed';
          progress = 100;
        }

        return {
          id: item.id,
          type: item.type,
          category: item.category,
          title: item.title,
          description: item.description,
          location: item.location,
          reportDate: new Date(item.date_found || item.date_reported).toLocaleDateString(),
          timeAgo: new Date(item.created_at).toLocaleDateString(),
          status: uiStatus,
          progress: progress,
          image: item.image_url || null,
          matches: detectedMatches
        };
      }));

      console.log("ActiveReports: Formatted reports:", formattedReports);
      setReports(formattedReports);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    document.body.style.overflow =
      showConfirmModal || showClaim ? "hidden" : "auto";
  }, [showConfirmModal, showClaim]);

  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">Active Reports</h1>
          <p className="text-sm text-gray-600">
            Track and check AI matches for your reported items
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchReports}
            className="cursor-pointer flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <Link to="/submitreport">
            <button className="cursor-pointer flex items-center gap-1 bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded-lg font-medium">
              <Plus size={13} /> Report Lost Item
            </button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p>Failed to load reports: {error}</p>
        </div>
      )}

      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-700"></div>
          </div>
        ) : reports.length > 0 ? (
          reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              openReportId={openReportId}
              setOpenReportId={setOpenReportId}
              onClaim={() => setShowConfirmModal(true)}
            />
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 font-medium text-lg">No active reports</p>
            <p className="text-gray-400 text-sm mt-1">Report a lost item to start tracking its status.</p>
          </div>
        )}
      </div>

      {showConfirmModal && (
        <ConfirmMatchModal
          onClose={() => setShowConfirmModal(false)}
          onConfirm={() => {
            setShowConfirmModal(false);
            setShowClaim(true);
            setStep(1);
          }}
        />
      )}

      {showClaim && (
        <ClaimModal
          showClaim={showClaim}
          setShowClaim={setShowClaim}
          step={step}
          setStep={setStep}
          form={form}
          setForm={setForm}
          errors={errors}
          setErrors={setErrors}
          categories={CATEGORIES}
        />
      )}
    </div>
  );
}
