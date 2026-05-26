import { useState, useEffect } from "react";
import {
  Plus,
  RefreshCw,
  AlertCircle,
  LayoutGrid,
  Sparkles,
  Search,
  CheckCircle2,
  X,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "./simulation-mocks";

import ReportCard from "./ReportCard";
import ConfirmMatchModal from "./ConfirmMatchModal";
import ClaimModal from "./ClaimModal";
import SubmitReport from "../Home/SubmitReport";

// Animation Wrapper
function AnimatedListItem({ children, index = 0 }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setIsVisible(true);
      },
      50 + index * 100,
    );

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {children}
    </div>
  );
}

export default function ActiveReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal States
  const [openReportId, setOpenReportId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showClaim, setShowClaim] = useState(false);
  const [showLostItemForm, setShowLostItemForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [form, setForm] = useState({
    itemType: "",
    colorMaterial: "",
    uniqueMarks: "",
    brand: "",
    insideItems: "",
    secretItem: "",
    lastSeen: "",
  });
  const [errors, setErrors] = useState({});

  // Filter State
  const [activeFilter, setActiveFilter] = useState("all");

  // Filtered Reports Logic
  const filteredReports = reports.filter((report) => {
    if (activeFilter === "all") return true;
    return report.status === activeFilter;
  });

  const fetchReports = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Simulation of fetching reports
      setTimeout(() => {
        setReports([
          {
            id: "1",
            title: "Blue Nike Backpack",
            description:
              "Lost my blue Nike backpack containing my laptop and some notebooks. Has a scratch on the front pocket.",
            location: "Main Library, 2nd Floor",
            timeAgo: "2 hours ago",
            status: "matches",
            progress: 85,
            image:
              "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400",
            matches: [
              {
                id: "m1",
                title: "Dark Blue Backpack",
                category: "Bags",
                similarity: 0.92,
                location: "Campus Security Desk",
                created_at: new Date().toISOString(),
                image_url:
                  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400",
              },
              {
                id: "m2",
                title: "Nike Bag (Blue/Black)",
                category: "Bags",
                similarity: 0.74,
                location: "Student Union Building",
                created_at: new Date(Date.now() - 86400000).toISOString(),
                image_url:
                  "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?auto=format&fit=crop&q=80&w=400",
              },
            ],
          },
          {
            id: "2",
            title: "Apple AirPods Pro",
            description:
              "White AirPods Pro in a black silicone case. Left earbud has a tiny scuff.",
            location: "Cafeteria",
            timeAgo: "1 day ago",
            status: "searching",
            progress: 45,
            image:
              "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&q=80&w=400",
            matches: [],
          },
          {
            id: "3",
            title: "HydroFlask Water Bottle",
            description:
              "Yellow 32oz HydroFlask with a few stickers on the bottom.",
            location: "Gymnasium",
            timeAgo: "3 days ago",
            status: "claimed",
            progress: 100,
            image:
              "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=400",
            matches: [],
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [user?.id]);

  useEffect(() => {
    document.body.style.overflow =
      showConfirmModal || showClaim || showLostItemForm || showSuccess
        ? "hidden"
        : "auto";
  }, [showConfirmModal, showClaim, showLostItemForm, showSuccess]);

  const handleSuccessClose = () => {
    setShowSuccess(false);
    fetchReports();
  };

  return (
    <div className="p-8 sm:p-8 md:p-8 bg-[#F9F6F0] min-h-screen transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-5">
        {/* Left Side: Header (Mobile) */}
        <div className="flex flex-col w-full lg:w-auto gap-4">
          <div className="lg:hidden">
            <h1 className="text-3xl font-black tracking-tight text-[#66240E]">
              Active Reports
            </h1>
            <p className="mt-1.5 text-sm font-semibold text-[#997C68] leading-relaxed">
              Track your reported items.
            </p>
          </div>

          {/* Filter Control Bar */}
          <div className="w-full sm:w-auto bg-[#FAF8F5] border border-[#E2DCD0] p-1 rounded-3xl shadow-sm inline-block">
            <div className="grid grid-cols-2 sm:flex sm:flex-row gap-1 bg-none p-1">
              {[
                { id: "all", label: "All Items", icon: LayoutGrid },
                { id: "matches", label: "Matches", icon: Sparkles },
                { id: "searching", label: "Searching", icon: Search },
                { id: "claimed", label: "Claimed", icon: CheckCircle2 },
              ].map((tab) => {
                const isActive = activeFilter === tab.id;
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFilter(tab.id)}
                    className={`
                      group flex items-center justify-center gap-2 px-3 py-2.5 sm:px-5 sm:py-3 rounded-2xl text-xs font-black uppercase tracking-wider cursor-pointer w-full sm:w-auto
                      transition-all duration-300 ease-out transform
                      active:scale-95
                      ${
                        isActive
                          ? "bg-white text-red-700 shadow-md border border-[#E2DCD0] scale-100"
                          : "text-[#997C68] bg-transparent hover:text-[#66240E] hover:bg-white/60 hover:scale-[1.02] hover:shadow-xs"
                      }
                    `}
                  >
                    <Icon
                      size={14}
                      className={`
                        transition-all duration-300 ease-out
                        ${
                          isActive
                            ? "text-red-700 scale-110 rotate-3"
                            : "text-[#997C68] group-hover:scale-110 group-hover:text-[#66240E]"
                        }
                      `}
                    />
                    <span className="whitespace-nowrap transition-transform duration-300">
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex w-full lg:w-auto gap-3 sm:gap-3 shrink-0 lg:mb-0">
          <button
            onClick={fetchReports}
            className="flex-1 sm:flex-none justify-center cursor-pointer flex items-center gap-2 bg-white border border-[#E2DCD0] bg-[#FAF8F5] text-[#5E3929] px-2 sm:px-5 py-3 rounded-3xl font-bold hover:bg-gray-50 transition-all duration-200 hover:shadow-sm text-base sm:text-base"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
              strokeWidth={2.5}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => setShowLostItemForm(true)}
            className="flex-2 sm:flex-none justify-center cursor-pointer flex items-center gap-1 bg-red-700 hover:bg-red-800 text-white px-5 sm:px-7 py-3 rounded-3xl font-bold transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 text-base sm:text-base whitespace-nowrap"
          >
            <Plus size={16} strokeWidth={2.5} /> Report Lost Item
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Reports Container */}
      <div className="space-y-4 sm:space-y-6">
        {loading ? (
          <AnimatedListItem index={0}>
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-700"></div>
            </div>
          </AnimatedListItem>
        ) : filteredReports.length > 0 ? (
          filteredReports.map((report, index) => (
            <AnimatedListItem
              key={`${activeFilter}-${report.id}`}
              index={index}
            >
              <ReportCard
                report={report}
                openReportId={openReportId}
                setOpenReportId={setOpenReportId}
                onClaim={() => setShowConfirmModal(true)}
              />
            </AnimatedListItem>
          ))
        ) : (
          <AnimatedListItem index={0} key={`empty-${activeFilter}`}>
            <div className="text-center py-16 sm:py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 shadow-sm transition-all hover:border-gray-300">
              <p className="text-gray-500 font-medium text-base sm:text-lg">
                {activeFilter === "all"
                  ? "No active reports"
                  : `No reports found matching "${activeFilter}"`}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">
                {activeFilter === "all"
                  ? "Report a lost item to start tracking its status."
                  : "Try choosing another filter status option."}
              </p>
            </div>
          </AnimatedListItem>
        )}
      </div>

      {showConfirmModal && (
        <ConfirmMatchModal
          onClose={() => setShowConfirmModal(false)}
          onConfirm={() => {
            setShowConfirmModal(false);
            setShowClaim(true);
          }}
        />
      )}

      {showClaim && (
        <ClaimModal
          showClaim={showClaim}
          setShowClaim={setShowClaim}
          form={form}
          setForm={setForm}
          errors={errors}
          setErrors={setErrors}
          itemId={openReportId}
        />
      )}

      {/* Submit Report */}
      <div
        className={`transition-all duration-300 ${showLostItemForm ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <SubmitReport
          isOpen={showLostItemForm}
          initialType="Missing Item"
          onClose={() => setShowLostItemForm(false)}
        />
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#FFF9E1] rounded-[2rem] p-8 sm:p-12 max-w-md w-full shadow-2xl text-center relative border border-yellow-100/50 animate-in zoom-in-90 duration-300">
            <button
              onClick={handleSuccessClose}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-white/50 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[6px] border-green-500/20 flex items-center justify-center bg-white mx-auto mb-6 sm:mb-8 shadow-sm">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-500 flex items-center justify-center animate-in zoom-in duration-500 delay-150">
                <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#374151] mb-4 sm:mb-6 uppercase tracking-tight">
              Report Submitted
            </h3>
            <p className="text-[#4B5563] text-sm sm:text-base font-medium mb-8 sm:mb-10">
              Your lost item report has been successfully recorded. Our AI is
              now searching for matches!
            </p>
            <button
              onClick={handleSuccessClose}
              className="w-full py-3 sm:py-4 rounded-xl bg-[#0051FF] hover:bg-[#0041CC] text-white font-black text-base sm:text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 uppercase tracking-wider cursor-pointer"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}