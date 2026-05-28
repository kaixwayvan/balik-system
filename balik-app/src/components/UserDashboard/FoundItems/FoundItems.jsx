import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { 
  MapPin, Clock, Eye, Users, Plus, Image, RefreshCw, AlertCircle, X, 
  CheckCircle, Mail, Phone, Search, Tag, Calendar, FileText, Hourglass, 
  Files, LayoutGrid, Sparkles, CheckCircle2 
} from "lucide-react";
import VerifiedIcon from "@mui/icons-material/Verified";
import SubmitReport from "../Home/SubmitReport";

// Animation Wrapper
function AnimatedListItem({ children, index = 0 }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50 + index * 100);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
      }`}
    >
      {children}
    </div>
  );
}

// Simulation Data
const mockUser = { id: "mock-user-777", email: "goodsamaritan@example.com" };

const mockItemsData = [
  {
    id: "item-1",
    title: "Designer Leather Wallet",
    description: "Found a black bi-fold leather wallet near the central square bench. Contains cards but no cash. Looking for the owner.",
    location: "Central Square Park",
    date_reported: "2026-05-24T10:30:00Z",
    status: "matching",
    image_url: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "item-2",
    title: "Wireless Pro Earbuds",
    description: "Found case with right earbud inside near the cafeteria charging docks. Case has a small scratch on the bottom.",
    location: "Campus Cafeteria",
    date_reported: "2026-05-25T14:15:00Z",
    status: "pending",
    image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "item-3",
    title: "Silver Engagement Ring",
    description: "Successfully returned to the rightful owner after verifying the personalized engravings inside the band.",
    location: "Science Lab Hallway",
    date_reported: "2026-05-20T09:00:00Z",
    status: "released",
    image_url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80"
  }
];

const mockClaimsData = {
  "item-1": [
    {
      id: "claim-1",
      claimer_id: "profile-1",
      created_at: "2026-05-25T11:00:00Z",
      status: "pending",
      claim_details: {
        lostItemTitle: "My Black Wallet",
        category: "Personal Items",
        lostLocation: "Near Central Square",
        lostDate: "2026-05-24",
        description: "It's a black leather wallet containing a transit card and library ID matching my profile name.",
        identifiers: "A slight wear marks on the inner left card flap."
      }
    }
  ]
};

const mockProfilesData = {
  "profile-1": { id: "profile-1", full_name: "Alexander Wright", mobile_number: "+1 (555) 234-5678", email: "alex.wright@iskolarngbayan.pup.edu.ph" }
};

const useAuth = () => ({ user: mockUser });
const gamificationService = {
  awardItemReleasedPoints: (userId, itemId) => console.log(`%c✨ Gamification Points Awarded to ${userId} for releasing item ${itemId}!`, "color: #10b981; font-weight: bold;")
};
const itemService = {
  uploadItemImage: async (file) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return URL.createObjectURL(file);
  }
};

const supabase = {
  from: (table) => ({
    select: (query) => ({
      eq: (field, val) => ({
        eq: (field2, val2) => ({
          order: (sortField, sortConfig) => {
            if (table === 'items') return Promise.resolve({ data: mockItemsData, error: null });
            return Promise.resolve({ data: [], error: null });
          }
        }),
        order: (sortField, sortConfig) => {
          if (table === 'item_claims') return Promise.resolve({ data: mockClaimsData[val] || [], error: null });
          return Promise.resolve({ data: [], error: null });
        }
      }),
      in: (field, arrayValues) => {
        if (table === 'item_claims') {
          const combinedClaims = [];
          arrayValues.forEach(id => { if (mockClaimsData[id]) combinedClaims.push(...mockClaimsData[id]); });
          return Promise.resolve({ data: combinedClaims, error: null });
        }
        if (table === 'profiles') {
          const matches = arrayValues.map(id => mockProfilesData[id]).filter(Boolean);
          return Promise.resolve({ data: matches, error: null });
        }
        return Promise.resolve({ data: [], error: null });
      }
    }),
    update: (payload) => ({
      eq: (field, id) => {
        return Promise.resolve({ error: null });
      }
    })
  }),
  channel: (channelName) => ({
    on: (event, config, callback) => ({
      subscribe: () => ({
        unsubscribe: () => console.log(`Unsubscribed from ${channelName}`)
      })
    }),
    subscribe: () => ({
      unsubscribe: () => console.log(`Unsubscribed from ${channelName}`)
    })
  })
};

// Main Component
export default function FoundItems() {
  useEffect(() => {
    document.title = "Found Items - BALIK System";

    return () => {
      document.title = "BALIK System";
    };
  }, []);

  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal States
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemClaimers, setSelectedItemClaimers] = useState([]);
  const [claimersLoading, setClaimersLoading] = useState(false);
  const [openPhotoModal, setOpenPhotoModal] = useState(false);
  const [selectedItemForPhoto, setSelectedItemForPhoto] = useState(null);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [itemClaimerCounts, setItemClaimerCounts] = useState({});
  const [previousStatuses, setPreviousStatuses] = useState({});
  const [savingPhotos, setSavingPhotos] = useState(false);

  // Filter State
  const [activeFilter, setActiveFilter] = useState("all");

  // Filtered Reports Matching Logic
  const filteredReports = reports.filter((report) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "searching") return report.status === "pending";
    if (activeFilter === "claimed") {
      return report.status === "released" || report.status === "claimed" || report.status === "resolved";
    }
    return report.status === activeFilter;
  });

  const fetchReports = async () => {
    if (!user) return setLoading(false);
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'found')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setTimeout(() => {
        setReports(data || []);
        if (data && data.length > 0) {
          const itemIds = data.map(item => item.id);
          fetchClaimerCounts(itemIds);
        }
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchClaimerCounts = async (itemIds) => {
    try {
      const { data, error } = await supabase.from('item_claims').select('item_id').in('item_id', itemIds);
      if (error) throw error;
      const counts = {};
      (data || []).forEach(claim => { counts[claim.item_id] = (counts[claim.item_id] || 0) + 1; });
      setItemClaimerCounts(counts);
    } catch (err) {}
  };

  const fetchClaimersForItem = async (itemId) => {
    setClaimersLoading(true);
    try {
      const { data: claims, error: claimsError } = await supabase.from('item_claims').select('*').eq('item_id', itemId).order('created_at', { ascending: false });
      if (claimsError) throw claimsError;

      if (claims && claims.length > 0) {
        const claimerIds = claims.map(c => c.claimer_id).filter(Boolean);
        const { data: profiles, error: profilesError } = await supabase.from('profiles').select('id, full_name, mobile_number, email').in('id', claimerIds);
        if (profilesError) throw profilesError;

        const claimersWithDetails = claims.map(claim => {
          const profile = (profiles || []).find(p => p.id === claim.claimer_id);
          return {
            ...claim,
            claimer_name: profile?.full_name || 'Unknown',
            claimer_email: profile?.email || '',
            claimer_phone: profile?.mobile_number || ''
          };
        });
        setSelectedItemClaimers(claimersWithDetails);
      } else {
        setSelectedItemClaimers([]);
      }
    } catch (err) {
      setSelectedItemClaimers([]);
    } finally {
      setClaimersLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, [user?.id]);

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const file = files[0];
      setPhotoFiles([file]);
      setPreviewUrls([URL.createObjectURL(file)]);
    }
    e.target.value = "";
  };

  const removePhoto = (index) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSavePhotos = async () => {
    if (photoFiles.length === 0) return alert("Please select a photo to upload.");
    setSavingPhotos(true);
    try {
      const publicUrl = await itemService.uploadItemImage(photoFiles[0]);
      if (!publicUrl) throw new Error("Failed to upload image");
      setShowSuccess(true);
      setPhotoFiles([]);
      setPreviewUrls([]);
      setOpenPhotoModal(false);
      setReports(prev => prev.map(item => item.id === selectedItemForPhoto.id ? {...item, image_url: publicUrl} : item));
    } catch (err) {
      alert("Failed to save photo: " + err.message);
    } finally {
      setSavingPhotos(false);
    }
  };

  return (
    <div className="p-8 sm:p-8 md:p-8 lg:p-8 bg-[#F9F6F0] min-h-screen transition-all duration-300 antialiased overflow-x-hidden w-full">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Filter / Action Buttons */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 w-full mb-6">
          
          {/* Left Side: Header (Hidden on LG) & Filters */}
          <div className="flex flex-col w-full lg:w-auto gap-4">
            {/* Hidden Header for large screens */}
            <div className="lg:hidden animate-fade-in-up">
              <h1 className="text-3xl font-black tracking-tight text-[#66240E]">
                Found Reports
              </h1>
              <p className="mt-1.5 text-sm font-semibold text-[#997C68] leading-relaxed">
                Manage items you've recovered and easily authenticate ownership requests.
              </p>
            </div>

            {/* Filter Control Bar */}
            <div className="w-full sm:w-auto bg-[#FAF8F5] border border-[#E2DCD0] p-1 rounded-3xl shadow-sm inline-block animate-fade-in-up" style={{animationDelay: '100ms'}}>
              <div className="grid grid-cols-2 sm:flex sm:flex-row gap-1 bg-none p-1">
                {[
                  { id: "all", label: "All Items", icon: LayoutGrid },
                  { id: "matching", label: "Matches", icon: Sparkles },
                  { id: "searching", label: "Pending", icon: Search },
                  { id: "claimed", label: "Released", icon: CheckCircle2 },
                ].map((tab) => {
                  const isActive = activeFilter === tab.id;
                  const Icon = tab.icon;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveFilter(tab.id)}
                      className={`
                        cursor-pointer group flex items-center justify-center gap-2 px-3 py-2.5 sm:px-5 sm:py-3 rounded-2xl text-xs font-black uppercase tracking-wider w-full sm:w-auto
                        transition-all duration-300 ease-out transform active:scale-95
                        ${isActive
                            ? "bg-white text-emerald-700 shadow-md border border-[#E2DCD0] scale-100"
                            : "text-[#997C68] bg-transparent hover:text-[#66240E] hover:bg-white/60 hover:scale-[1.02]"
                        }
                      `}
                    >
                      <Icon size={14} className={`transition-all duration-300 ease-out ${isActive ? "text-emerald-700 scale-110 rotate-3" : "text-[#997C68] group-hover:scale-110 group-hover:text-[#66240E]"}`} />
                      <span className="whitespace-nowrap transition-transform duration-300">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side: Action Buttons */}
          <div className="flex w-full lg:w-auto gap-3 sm:gap-3 shrink-0 lg:mb-0 animate-fade-in-up" style={{animationDelay: '200ms'}}>
            <button
              onClick={fetchReports}
              className="cursor-pointer flex-1 sm:flex-none justify-center flex items-center gap-2 bg-white border border-[#E2DCD0] bg-[#FAF8F5] text-[#5E3929] px-2 sm:px-5 py-3 rounded-3xl font-bold hover:bg-gray-50 transition-all duration-200 hover:shadow-sm active:scale-95 text-base sm:text-base"
            >
              <RefreshCw 
                size={16} 
                className={loading ? "animate-spin" : ""} 
                strokeWidth={2.5} 
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            
            <button
              onClick={() => setShowReportModal(true)}
              className="cursor-pointer flex-[2] sm:flex-none justify-center flex items-center gap-1 bg-green-700 hover:bg-green-800 text-white px-5 sm:px-7 py-3 rounded-3xl font-bold transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 text-base sm:text-base whitespace-nowrap"
            >
              <Plus size={18} strokeWidth={2.5} /> Report Found Item
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 w-full mb-8 lg:mb-10">
          <StatCard
            index={0}
            title="Total Handed In"
            subtitle="Items reported"
            value={reports.length}
            icon={Files}
            glowA="bg-blue-400"
            glowB="bg-indigo-400"
            iconGrad="from-blue-500 to-indigo-600"
            textGrad="from-blue-700 to-indigo-900"
            chartColor="text-blue-500"
            trend="+100% active"
          />
          <StatCard
            index={1}
            title="Released Back"
            subtitle="Items returned"
            value={reports.filter(r => r.status === 'released' || r.status === 'claimed' || r.status === 'resolved').length}
            icon={CheckCircle}
            glowA="bg-emerald-400"
            glowB="bg-teal-400"
            iconGrad="from-emerald-400 to-teal-600"
            textGrad="from-emerald-700 to-teal-900"
            chartColor="text-emerald-500"
            trend="+Verified"
          />
          <StatCard
            index={2}
            title="Active Listings"
            subtitle="Pending matches"
            value={reports.filter(r => r.status === 'pending' || r.status === 'matching').length}
            icon={Eye}
            glowA="bg-amber-400"
            glowB="bg-orange-400"
            iconGrad="from-amber-400 to-orange-500"
            textGrad="from-amber-700 to-orange-900"
            chartColor="text-amber-500"
            trend="+Scanning"
          />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <AlertCircle size={20} className="shrink-0" />
            <div className="min-w-0">
              <p className="text-sm break-words">{error}</p>
            </div>
          </div>
        )}

        {/* Reports Grid */}
        <div className="w-full space-y-4 sm:space-y-6">
          {loading ? (
            <AnimatedListItem index={0}>
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 z-[99] border-b-2 border-green-700"></div>
              </div>
            </AnimatedListItem>
          ) : filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
              {filteredReports.map((item, index) => (
                <AnimatedListItem key={`${activeFilter}-${item.id}`} index={index}>
                  <div className="group relative bg-white border border-[#E8E3D9] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between h-full">
                    
                    {/* Image Wrapper */}
                    <div className="relative h-48 sm:h-56 bg-slate-100 overflow-hidden shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/0 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                      
                      {(item.status === "matching" || item.status === "released" || item.status === "claimed" || item.status === "resolved") && (
                        <div className={`absolute top-4 left-4 p-1.5 rounded-3xl shadow-lg flex items-center justify-center z-20 bg-white/95 backdrop-blur-md ${
                          item.status === "matching" ? "text-blue-600" : "text-emerald-600"
                        }`}>
                          <VerifiedIcon sx={{ fontSize: 20 }} />
                        </div>
                      )}

                      <span className={`absolute top-4 right-4 text-[10px] px-3 py-1.5 rounded-3xl shadow-lg font-black uppercase tracking-wider z-20 border backdrop-blur-md bg-white/95 ${
                        item.status === 'matching' ? "text-blue-600 border-blue-200" 
                        : (item.status === 'released' || item.status === 'claimed' || item.status === 'resolved') ? "text-emerald-700 border-emerald-200" 
                        : "text-amber-700 border-amber-200"
                      }`}>
                        {item.status === 'matching' ? 'Matching' : (item.status === 'released' || item.status === 'claimed' || item.status === 'resolved') ? 'Released' : 'Pending'}
                      </span>

                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between relative z-20 bg-white">
                      <div className="space-y-1.5">
                        <h3 className="font-black text-slate-900 text-lg sm:text-xl tracking-tight truncate uppercase">{item.title}</h3>
                        <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 min-h-[40px] leading-relaxed font-medium">{item.description}</p>
                      </div>

                      {/* Metadata Row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] sm:text-xs text-slate-500 border-t border-slate-100 pt-4 font-medium">
                        <div className="flex items-center gap-1.5 min-w-0 max-w-[60%]">
                          <MapPin size={14} className="text-slate-400 shrink-0" /> 
                          <span className="truncate">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Clock size={14} className="text-slate-400 shrink-0" /> 
                          <span>{new Date(item.date_reported).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Users size={14} className="text-slate-400 shrink-0" /> 
                          <span className="font-bold text-slate-700">
                            {itemClaimerCounts[item.id] || 0} {itemClaimerCounts[item.id] === 1 ? 'claimer' : 'claimers'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-3">
                        {(item.status === "released" || item.status === "claimed" || item.status === "resolved") ? (
                          <div className="cursor-not-allowed bg-emerald-50 text-emerald-800 border border-emerald-200 justify-center font-black uppercase tracking-wider text-center text-[10px] sm:text-xs p-3.5 rounded-2xl flex items-center gap-2 w-full shrink-0">
                            <CheckCircle size={16} className="text-emerald-600" strokeWidth={2.5} />
                            Item Released
                          </div>
                        ) : (
                          <div className="flex gap-2 sm:gap-3">
                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                fetchClaimersForItem(item.id);
                                setOpenModal(true);
                              }}
                              className="cursor-pointer flex-[2] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-3.5 px-3 rounded-3xl text-xs sm:text-xs font-black uppercase tracking-wide shadow-md shadow-blue-600/20 active:scale-95 transition-all"
                            >
                              <Users size={16} strokeWidth={2.5} /> Logs ({itemClaimerCounts[item.id] || 0})
                            </button>

                            <button
                              onClick={() => {
                                setSelectedItemForPhoto(item);
                                setPhotoFiles([]);
                                setPreviewUrls([]);
                                setOpenPhotoModal(true);
                              }}
                              className="cursor-pointer flex-1 flex items-center justify-center gap-2 border-2 border-[#E2DCD0] text-[#5E3929] py-3 sm:py-3.5 px-6 rounded-3xl text-xs sm:text-xs font-black uppercase tracking-wide hover:bg-[#FAF8F5] hover:border-[#DBC8BD] hover:text-slate-800 active:scale-95 transition-all"
                              title="Update Cover Photo"
                            >
                              <Image size={16} strokeWidth={2.5} /> Photo
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </AnimatedListItem>
              ))}
            </div>
          ) : (
            <AnimatedListItem index={0} key={`empty-${activeFilter}`}>
              <div className="text-center py-16 sm:py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 shadow-sm transition-all hover:border-gray-300">
                <p className="text-gray-500 font-medium text-base sm:text-lg">
                  {activeFilter === "all" ? "No active reports" : `No reports found matching "${activeFilter}"`}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                  {activeFilter === "all" 
                    ? "Report a found item to start tracking its status."
                    : "Try choosing another filter status option."}
                </p>
              </div>
            </AnimatedListItem>
          )}
        </div>

        
        {/* Claim Verification Modal */}
        {openModal && createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[90vh] overflow-hidden transform border border-slate-100">
              
              <div className="p-5 sm:p-6 lg:p-8 border-b border-slate-100 flex items-start justify-between bg-slate-50/50 shrink-0">
                <div className="space-y-1.5 pr-4 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg sm:text-2xl font-black text-[#66240E] truncate uppercase tracking-tight">Claimers for "{selectedItem?.title}"</h2>
                    <span className={`text-[10px] px-2.5 py-1 rounded-3xl font-black uppercase tracking-wider border ${
                      selectedItem?.status === 'released' || selectedItem?.status === 'claimed' || selectedItem?.status === 'resolved' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : selectedItem?.status === 'matching' ? 'bg-blue-50 text-blue-700 border-blue-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {selectedItem?.status === 'matching' ? 'Matching' : (selectedItem?.status === 'released' || selectedItem?.status === 'claimed' || selectedItem?.status === 'resolved') ? 'Released' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-500">
                    {selectedItemClaimers.length} {selectedItemClaimers.length === 1 ? 'submission record' : 'submission records'} registered.
                  </p>
                </div>
                <button
                  onClick={() => setOpenModal(false)}
                  className="cursor-pointer p-2 sm:p-2.5 rounded-full text-slate-400 hover:text-red-700 bg-slate-100 transition-colors shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-5 sm:space-y-6 bg-slate-50/30 flex-1 custom-scrollbar">
                {claimersLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-700"></div>
                  </div>
                ) : selectedItemClaimers.length > 0 ? (
                  <div className="space-y-5 sm:space-y-6">
                    {selectedItemClaimers.map((claim, idx) => (
                      <div key={claim.id} className="border border-[#E8E3D9] rounded-[2.5rem] p-5 sm:p-6 bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col gap-5">
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <h4 className="font-black text-slate-900 text-base sm:text-lg tracking-tight uppercase truncate">{claim.claimer_name}</h4>
                              {claim.status === 'approved' && <CheckCircle size={18} className="text-emerald-600 shrink-0" />}
                            </div>
                            <p className="text-[11px] sm:text-xs font-semibold text-[#997C68] uppercase tracking-wide">
                              Claim #{String(idx + 1).padStart(2, '0')} • {new Date(claim.created_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                            </p>
                          </div>

                          <span className={`shrink-0 self-start sm:self-center flex items-center gap-1.5 text-[10px] sm:text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-3xl font-black uppercase tracking-wider border ${
                            claim.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : claim.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' 
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {claim.status === 'approved' ? (
                              <><CheckCircle size={14} /> Approved</>
                            ) : claim.status === 'rejected' ? (
                              <><X size={14} /> Rejected</>
                            ) : (
                              <><Hourglass size={14} className="animate-pulse" /> Pending</>
                            )}
                          </span>
                        </div>

                        <div>
                          <p className="text-[10px] sm:text-[11px] text-slate-400 font-black uppercase tracking-widest mb-2.5">Applicant Contact Matrix</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-blue-50/50 p-4 rounded-3xl border border-blue-100 flex items-center gap-3 truncate">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 text-blue-600"><Mail size={16} /></div>
                              <div className="min-w-0">
                                <p className="text-[10px] sm:text-[11px] text-blue-600/80 font-bold uppercase tracking-wider leading-none">Email Address</p>
                                <p className="text-slate-800 font-semibold text-sm truncate mt-1">{claim.claimer_email || 'Not shared'}</p>
                              </div>
                            </div>
                            <div className="bg-emerald-50/50 p-4 rounded-3xl border border-emerald-100 flex items-center gap-3 truncate">
                              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600"><Phone size={16} /></div>
                              <div className="min-w-0">
                                <p className="text-[10px] sm:text-[11px] text-emerald-600/80 font-bold uppercase tracking-wider leading-none">Mobile</p>
                                <p className="text-slate-800 font-semibold text-sm truncate mt-1">{claim.claimer_phone || 'Not shared'}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {claim.claim_details && (claim.claim_details.lostItemTitle || claim.claim_details.description) && (
                          <div className="bg-[#FAF8F5] rounded-3xl p-5 border border-[#E8E3D9] shadow-sm space-y-4">
                            <div className="flex items-center gap-2 text-slate-800 pb-2 border-b border-[#E8E3D9]">
                              <Search size={16} className="text-[#66240E] stroke-[2.5px]" />
                              <p className="text-xs sm:text-sm font-black text-[#66240E] uppercase tracking-wider">Ownership Disclosures</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                              {claim.claim_details.lostItemTitle && (
                                <div className="space-y-1">
                                  <p className="text-[#997C68] font-semibold text-[10px] sm:text-[11px] uppercase tracking-wider">Declared Title</p>
                                  <p className="font-bold text-slate-800">{claim.claim_details.lostItemTitle}</p>
                                </div>
                              )}
                              {claim.claim_details.category && (
                                <div className="space-y-1">
                                  <p className="text-[#997C68] font-semibold text-[10px] sm:text-[11px] uppercase tracking-wider">Category</p>
                                  <p className="font-bold text-slate-800 capitalize">{claim.claim_details.category}</p>
                                </div>
                              )}
                              {claim.claim_details.lostLocation && (
                                <div className="space-y-1">
                                  <p className="text-[#997C68] font-semibold text-[10px] sm:text-[11px] uppercase tracking-wider">Misplacement Area</p>
                                  <p className="font-bold text-slate-800">{claim.claim_details.lostLocation}</p>
                                </div>
                              )}
                              {claim.claim_details.lostDate && (
                                <div className="space-y-1">
                                  <p className="text-[#997C68] font-semibold text-[10px] sm:text-[11px] uppercase tracking-wider">Date Lost</p>
                                  <p className="font-bold text-slate-800">
                                    {new Date(claim.claim_details.lostDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                                  </p>
                                </div>
                              )}
                            </div>

                            {claim.claim_details.description && (
                              <div className="text-xs sm:text-sm pt-2 border-t border-[#E8E3D9]">
                                <p className="text-[#997C68] font-semibold text-[10px] sm:text-[11px] uppercase tracking-wider mb-1">User Description</p>
                                <p className="text-slate-700 font-medium leading-relaxed bg-white p-3 rounded-2xl border border-[#E8E3D9]">{claim.claim_details.description}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-[2rem] border border-[#E8E3D9] shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-[#FAF8F5] flex items-center justify-center mx-auto mb-3 border border-[#E8E3D9]">
                      <Users size={28} className="text-[#997C68]" />
                    </div>
                    <p className="text-slate-800 font-black text-lg tracking-tight uppercase">No Verification Requests</p>
                    <p className="text-slate-500 text-sm font-medium mt-1">Incoming claim matching details will appear automatically.</p>
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-5 border-t border-slate-100 flex justify-end bg-slate-50/80 shrink-0">
                <button
                  onClick={() => setOpenModal(false)}
                  className="cursor-pointer w-full sm:w-auto bg-[#66240E] hover:bg-[#4A1A0A] text-white px-10 py-3.5 sm:py-3 rounded-3xl text-sm font-black uppercase tracking-wider transition-all active:scale-95 shadow-md"
                >
                  Close Logs
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Photo Upload Modal */}
        {openPhotoModal && createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-6 sm:p-8 relative transform space-y-5 border border-slate-100">
              <button
                onClick={() => {
                  setOpenPhotoModal(false);
                  setPhotoFiles([]);
                  setPreviewUrls([]);
                }}
                className="cursor-pointer absolute top-8 right-7 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Dismiss media uploader"
              >
                <X size={20} />
              </button>

              <div className="pr-8">
                <h2 className="text-xl sm:text-2xl font-black text-[#66240E] truncate tracking-tight uppercase">Edit Cover Asset</h2>
                <p className="text-xs sm:text-sm font-semibold text-[#997C68] mt-1 truncate">Updating: {selectedItemForPhoto?.title}</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">File Source Drag/Drop</label>
                <div className="relative border-2 border-dashed border-[#E2DCD0] hover:border-[#02A63E] rounded-[1.5rem] p-8 text-center hover:bg-[#FAF8F5] transition-all group bg-slate-50/50">
                  <input
                    id="photo-input"
                    type="file"
                    accept="image/png, image/jpeg, image/gif, image/webp"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                  <label htmlFor="photo-input" className="cursor-pointer flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-[1.25rem] bg-white border border-slate-200 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Image size={24} className="text-[#997C68] group-hover:text-[#02A63E] transition-colors" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-black text-[#66240E] uppercase tracking-tight">Browse Image Asset</span>
                      <span className="text-[11px] font-semibold text-[#997C68]">Supports PNG, JPEG, WEBP up to 5MB</span>
                    </div>
                  </label>
                </div>
              </div>

              {previewUrls.length > 0 && (
                <div className="bg-[#FAF8F5] p-4 rounded-[1.5rem] border border-[#E8E3D9]">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">Pending Selection</p>
                  <div className="relative group/thumb max-w-[180px]">
                    <img src={previewUrls[0]} alt="Upload preview asset file stub" className="w-full h-32 object-cover rounded-xl border border-[#E8E3D9] shadow-sm" />
                    <button
                      onClick={() => removePhoto(0)}
                      className="cursor-pointer absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg p-1.5 shadow-lg active:scale-90 transition-all opacity-0 group-hover/thumb:opacity-100"
                      title="Ditch choice"
                    >
                      <X size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    setOpenPhotoModal(false);
                    setPhotoFiles([]);
                    setPreviewUrls([]);
                  }}
                  className="cursor-pointer w-full sm:w-auto px-6 py-3.5 sm:py-3 border-2 border-[#E8E3D9] rounded-3xl text-xs sm:text-sm font-bold text-[#5E3929] hover:bg-[#FAF8F5] active:scale-95 transition-all uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePhotos}
                  disabled={photoFiles.length === 0 || savingPhotos}
                  className="cursor-pointer w-full sm:w-auto px-8 py-3.5 sm:py-3 bg-[#02A63E] hover:bg-[#028C34] disabled:bg-[#E8E3D9] disabled:text-[#997C68] disabled:cursor-not-allowed text-white rounded-3xl text-xs sm:text-sm font-black transition-all active:scale-95 shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  {savingPhotos ? (
                    <><RefreshCw size={16} className="animate-spin" /> Saving...</>
                  ) : (
                    "Save Asset"
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        <SubmitReport 
          isOpen={showReportModal} 
          onClose={() => setShowReportModal(false)}
          onSuccess={fetchReports}
          initialType="Found Item" 
        />

        {/* Success Completion Toast */}
        {showSuccess && createPortal(
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-[#FFF7EB] rounded-[2.5rem] p-8 sm:p-10 max-w-sm w-full shadow-2xl text-center relative border border-[#F7E1CD]">
              <button 
                onClick={() => setShowSuccess(false)}
                className="cursor-pointer absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-50 rounded-full transition-colors"
              >
                <X size={18} />
              </button>

              <div className="w-20 h-20 rounded-full bg-white text-green-600 flex items-center justify-center mx-auto mb-5 border-[6px] border-green-500/10 shadow-sm">
                <CheckCircle size={36} strokeWidth={2.5} />
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[#66240E] tracking-tight uppercase">
                Asset Updated
              </h3>
              
              <p className="text-xs sm:text-sm font-medium text-[#997C68] mt-2.5 leading-relaxed">
                Your item's photo asset has been successfully synchronized and is now instantly visible to the community workspace.
              </p>

              <button 
                onClick={() => setShowSuccess(false)}
                className="cursor-pointer w-full mt-6 py-3.5 rounded-2xl bg-[#0051FF] hover:bg-[#0041CC] text-white font-black text-xs sm:text-sm shadow-lg transition-all active:scale-95 uppercase tracking-widest"
              >
                Continue Work
              </button>
            </div>
          </div>,
          document.body
        )}

      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .animate-fade-in { animation: fadeIn 0.2s linear forwards; }
        .animate-fade-in-up { animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}

// Stats Cards
function StatCard({ title, subtitle, value, icon: Icon, glowA, glowB, iconGrad, textGrad, chartColor, trend, index = 0 }) {
  return (
    <div 
      className="group relative w-full rounded-[1.5rem] sm:rounded-[2rem] bg-white border border-[#E8E3D9] shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-500 overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${index * 150}ms`, animationFillMode: "both" }}
    >
      <div className={`absolute -top-10 -right-10 w-32 h-32 sm:w-40 sm:h-40 ${glowA} rounded-full mix-blend-multiply filter blur-[2.5rem] sm:blur-[3rem] opacity-10 group-hover:opacity-30 transition-opacity duration-700`} />
      <div className={`absolute -bottom-10 -left-10 w-32 h-32 sm:w-40 sm:h-40 ${glowB} rounded-full mix-blend-multiply filter blur-[2.5rem] sm:blur-[3rem] opacity-10 group-hover:opacity-30 transition-opacity duration-700`} />
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

      <div className="relative z-10 p-4 sm:p-5 xl:p-6 flex flex-col h-full justify-between gap-4 sm:gap-5 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm sm:text-base lg:text-sm xl:text-lg font-black text-[#5E3929] tracking-tight truncate uppercase">
              {title}
            </p>
            <p className="text-[10px] sm:text-[11px] font-bold text-[#997C68] mt-0.5 truncate uppercase tracking-widest">
              {subtitle}
            </p>
          </div>
          <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 xl:w-14 xl:h-14 rounded-xl sm:rounded-[1.25rem] shrink-0 bg-gradient-to-br ${iconGrad} shadow-inner shadow-white/30 ring-1 ring-black/5 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500`}>
            {Icon && <Icon size={20} strokeWidth={2.5} className="text-white drop-shadow-md sm:w-6 sm:h-6 xl:w-7 xl:h-7" />}
          </div>
        </div>

        <div className="flex items-end justify-between mt-1">
          <div className="shrink-0 max-w-[50%] min-w-0">
            <p className={`text-3xl sm:text-4xl lg:text-3xl xl:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br ${textGrad} drop-shadow-sm truncate`}>
              {value}
            </p>
          </div>
          <div className="flex flex-col items-end min-w-0">
            <span className="text-[9px] sm:text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest truncate max-w-full">
              {trend}
            </span>
            <svg className="w-12 h-3 sm:w-16 sm:h-4 xl:w-20 xl:h-6 opacity-30 group-hover:opacity-100 transition-opacity duration-500" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path d="M0 20 C 20 20, 30 5, 50 15 C 70 25, 80 5, 100 10" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" className={`text-slate-200 group-hover:${chartColor} transition-colors duration-500`} />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}