import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  X,
  AlertCircle,
  Brain,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../shared/context/AuthContext";
import { itemService } from "../../services/itemService";
import { nlpService } from "../../services/nlpService";
import WelcomeBanner from "../../components/UserDashboard/Home/WelcomeBanner";
import StatsCards from "../../components/UserDashboard/Home/StatsCards";
import QuickActions from "../../components/UserDashboard/Home/QuickActions";
import RecentActivity from "../../components/UserDashboard/Home/RecentActivity";
import PointsPanel from "../../components/UserDashboard/Home/PointsPanel";
import AchievementsPanel from "../../components/UserDashboard/Home/AchievementsPanel";
import { CATEGORIES } from "../../shared/constants/categories";
import { supabase } from "../../utils/supabaseClient";

const initialLostFormData = {
  reportType: "Missing Item",
  whatWasLost: "",
  itemCategory: "",
  dateLost: "",
  brand: "",
  color: "",
  location: "",
  additionalInfo: "",
  photo: null,
  reporterName: "",
  mobileNumber: "",
  email: "",
  anonymous: false,
};

const initialFoundFormData = {
  reportType: "Found Item",
  whatWasFound: "",
  itemCategory: "",
  dateFound: "",
  brand: "",
  color: "",
  location: "",
  additionalInfo: "",
  photo: null,
  reporterName: "",
  mobileNumber: "",
  email: "",
  anonymous: false,
};

export default function DashboardHome() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [stats, setStats] = useState({ total: 0, lost: 0, found: 0, resolved: 0 });
  const [showReportModal, setShowReportModal] = useState(false);
  const [showLostItemForm, setShowLostItemForm] = useState(false);
  const [showFoundItemForm, setShowFoundItemForm] = useState(false);
  const [lostFormData, setLostFormData] = useState(initialLostFormData);
  const [foundFormData, setFoundFormData] = useState(initialFoundFormData);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [recentItems, setRecentItems] = useState([]);

  // New state for instant matching features
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedItems, setMatchedItems] = useState([]);
  const [createdItemId, setCreatedItemId] = useState(null);
  const [matchType, setMatchType] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);



  // Fetch stats and recent items from Supabase
  useEffect(() => {
    async function fetchDashboardData() {
      if (!user?.id) return;
      
      try {
        console.log("Fetching dashboard data for:", user.id);
        const userStats = await itemService.getUserStats(user.id);
        setStats(userStats);

        const { data: userItems, error: itemsError } = await supabase
          .from('items')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (!itemsError && userItems) {
          setRecentItems(userItems);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    }
    fetchDashboardData();
  }, [user?.id]);

  // Connection test
  useEffect(() => {
    async function testConnection() {
      try {
        const { error } = await supabase.from('items').select('id', { count: 'exact', head: true });
        if (error) console.error("Supabase Connection Error:", error.message);
      } catch (err) {
        console.error("Supabase Connection Exception:", err);
      }
    }
    testConnection();
  }, []);

  // DashboardHome no longer needs independent redirect logic as it is wrapped in Protected Layout
  // Render dashboard contents directly as user and loading are guaranteed by UserDashboardLayout


  const handleReportClick = () => {
    setShowReportModal(true);
  };

  const handleReportLost = () => {
    setShowReportModal(false);
    setShowLostItemForm(true);
  };

  const handleReportFound = () => {
    setShowReportModal(false);
    setShowFoundItemForm(true);
  };

  const handleLostFormChange = (e) => {
    const { name, value } = e.target;
    setLostFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFoundFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFoundFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFoundFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0] || null;
    // Determine which form's photo state to update
    if (showLostItemForm) {
      setLostFormData((prev) => ({ ...prev, photo: file }));
    } else if (showFoundItemForm) {
      setFoundFormData((prev) => ({ ...prev, photo: file }));
    }

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Auto-fill reporter info when modal opens or user changes
  useEffect(() => {
    if (user && (showLostItemForm || showFoundItemForm)) {
      const fillData = {
        reporterName: user.user_metadata?.full_name || "",
        email: user.email || ""
      };

      if (showLostItemForm) {
        setLostFormData(prev => ({ ...prev, ...fillData }));
      } else {
        setFoundFormData(prev => ({ ...prev, ...fillData }));
      }
    }
  }, [user, showLostItemForm, showFoundItemForm]);

  const handleLostFormSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to submit a report.");

    const { whatWasLost, itemCategory, dateLost, location, reporterName, mobileNumber, email } = lostFormData;
    if (!whatWasLost || !itemCategory || !dateLost || !location || !reporterName || !mobileNumber || !email) {
      return alert("Please fill in all required fields.");
    }

    setIsSubmitting(true);
    try {
      let imageUrl = null;
      if (lostFormData.photo) {
        imageUrl = await itemService.uploadItemImage(lostFormData.photo);
      }

      const mappedData = {
        user_id: user.id,
        type: 'lost',
        category: lostFormData.itemCategory,
        title: lostFormData.whatWasLost,
        description: `Brand: ${lostFormData.brand}\nColor: ${lostFormData.color}\n\n${lostFormData.additionalInfo}`,
        location: lostFormData.location,
        date_found: lostFormData.dateLost,
        date_reported: new Date().toISOString(),
        status: 'pending',
        image_url: imageUrl,
        metadata: {
          brand: lostFormData.brand,
          color: lostFormData.color,
          reporter: {
            name: lostFormData.reporterName,
            mobile: lostFormData.mobileNumber,
            email: lostFormData.email
          }
        }
      };

      // Generate embedding for smart matching (Non-blocking with timeout)
      let embedding = null;
      try {
        const searchText = `${lostFormData.itemCategory} ${lostFormData.whatWasLost} ${lostFormData.brand} ${lostFormData.color} ${lostFormData.location} ${lostFormData.additionalInfo}`;

        // Add 5-second timeout to prevent blocking submission
        const embeddingPromise = nlpService.generateEmbedding(searchText);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('NLP timeout')), 5000)
        );

        embedding = await Promise.race([embeddingPromise, timeoutPromise]);

        if (embedding) {
          mappedData.description_embedding = embedding;
        }
      } catch (nlpError) {
        console.warn("NLP Embedding generation failed or timed out (continuing without smart match):", nlpError.message);
        // Continue without embedding - submission should not fail
      }

      const newItem = await itemService.reportItem(mappedData);

      const updatedStats = await itemService.getUserStats(user.id);
      setStats(updatedStats);

      // Step 2: Smart Matching Phase
      setIsMatching(true);
      if (embedding) {
        try {
          // If we reported a LOST item, we look for FOUND items
          const matches = await itemService.getSmartMatches(
            embedding,
            'found',
            0.5, // Lowered threshold slightly for better discoverability
            5,
            {
              category: lostFormData.itemCategory,
              color: lostFormData.color,
              location: lostFormData.location,
              date: lostFormData.dateLost
            }
          );

          if (matches && matches.length > 0) {
            setMatchedItems(matches);
            setMatchType('found');
            setShowMatchModal(true);
            setIsMatching(false);
            setCreatedItemId(newItem?.id);
            return;
          }
        } catch (matchError) {
          console.warn("Smart matching check failed:", matchError);
        }
      }
      setIsMatching(false);

      setShowSuccess(true);

      // Reset form
      setShowLostItemForm(false);
      setLostFormData(initialLostFormData);
      setPhotoPreview(null);
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Failed to submit report: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLostFormCancel = () => {
    setShowLostItemForm(false);
    setLostFormData(initialLostFormData);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
  };

  const handleFoundFormSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to submit a report.");

    const { whatWasFound, itemCategory, dateFound, location, reporterName, mobileNumber, email, anonymous } = foundFormData;
    const baseFields = whatWasFound && itemCategory && dateFound && location;
    const contactFields = anonymous || (reporterName && mobileNumber && email);

    if (!baseFields || !contactFields) {
      return alert("Please fill in all required fields.");
    }

    setIsSubmitting(true);
    try {
      let imageUrl = null;
      if (foundFormData.photo) {
        imageUrl = await itemService.uploadItemImage(foundFormData.photo);
      }

      const mappedData = {
        user_id: user.id,
        type: 'found',
        category: foundFormData.itemCategory,
        title: foundFormData.whatWasFound,
        description: `Brand: ${foundFormData.brand}\nColor: ${foundFormData.color}\n\n${foundFormData.additionalInfo}`,
        location: foundFormData.location,
        date_found: foundFormData.dateFound,
        date_reported: new Date().toISOString(),
        status: 'pending',
        image_url: imageUrl,
        metadata: {
          brand: foundFormData.brand,
          color: foundFormData.color,
          reporter: {
            name: foundFormData.anonymous ? "Anonymous" : foundFormData.reporterName,
            mobile: foundFormData.anonymous ? "N/A" : foundFormData.mobileNumber,
            email: foundFormData.anonymous ? "N/A" : foundFormData.email
          },
          is_anonymous: foundFormData.anonymous
        }
      };

      // Generate embedding for smart matching (Non-blocking with timeout)
      let embedding = null;
      try {
        const searchText = `${foundFormData.itemCategory} ${foundFormData.whatWasFound} ${foundFormData.brand} ${foundFormData.color} ${foundFormData.location} ${foundFormData.additionalInfo}`;

        // Add 5-second timeout to prevent blocking submission
        const embeddingPromise = nlpService.generateEmbedding(searchText);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('NLP timeout')), 5000)
        );

        embedding = await Promise.race([embeddingPromise, timeoutPromise]);

        if (embedding) {
          mappedData.description_embedding = embedding;
        }
      } catch (nlpError) {
        console.warn("NLP Embedding generation failed or timed out (continuing without smart match):", nlpError.message);
        // Continue without embedding - submission should not fail
      }

      const newItem = await itemService.reportItem(mappedData);

      const updatedStats = await itemService.getUserStats(user.id);
      setStats(updatedStats);

      // Step 2: Smart Matching Phase
      setIsMatching(true);
      // Check for matches immediately
      if (embedding) {
        try {
          // If we reported a FOUND item, we look for LOST items
          const matches = await itemService.getSmartMatches(
            embedding,
            'lost',
            0.5, // Lowered threshold slightly for better discoverability
            5,
            {
              category: foundFormData.itemCategory,
              color: foundFormData.color,
              location: foundFormData.location,
              date: foundFormData.dateFound
            }
          );

          if (matches && matches.length > 0) {
            setMatchedItems(matches);
            setMatchType('lost');
            setShowMatchModal(true);
            setIsMatching(false);
            setCreatedItemId(newItem?.id);
            return;
          }
        } catch (matchError) {
          console.warn("Smart matching check failed:", matchError);
        }
      }
      setIsMatching(false);

      setShowSuccess(true);

      setShowFoundItemForm(false);
      setFoundFormData(initialFoundFormData);
      setPhotoPreview(null);
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Failed to submit report: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFoundFormCancel = () => {
    setShowFoundItemForm(false);
    setFoundFormData(initialFoundFormData);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 p-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <WelcomeBanner />
        </div>

        <div className="col-span-12">
          <StatsCards data={stats} />
        </div>

        <div className="col-span-8 space-y-6">
          <QuickActions onReportClick={handleReportClick} />
          <RecentActivity items={recentItems} />
        </div>

        <div className="col-span-4 space-y-6">
          <PointsPanel />
          <AchievementsPanel />
        </div>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl max-w-md w-full p-8 relative mx-4 shadow-xl">
            <button onClick={() => setShowReportModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose Report Type</h2>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 mb-6">
              <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">Please select whether you are identifying a personal item you have lost or submitting details about property you have found.</p>
            </div>
            <div className="space-y-3">
              <button onClick={handleReportLost} className="w-full py-4 px-6 bg-[#7B1C1C] hover:bg-[#5a1515] text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition">
                <Plus size={20} /> Report Lost Item
              </button>
              <button onClick={handleReportFound} className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition">
                <Plus size={20} /> Report Found Item
              </button>
            </div>
            <div className="mt-6 flex justify-center">
              <button onClick={() => setShowReportModal(false)} className="px-8 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-lg transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showLostItemForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto py-8">
          <div className="bg-white rounded-xl max-w-4xl w-full p-8 relative mx-4 shadow-xl my-auto">
            <h2 className="text-2xl font-bold text-[#7B1C1C] mb-1">Submit a Report</h2>
            <p className="text-gray-600 mb-6">Our Online Lost & Found can Help you Find what you are Looking For!</p>
            <form onSubmit={handleLostFormSubmit}>
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block font-semibold mb-1">Report Type <span className="text-red-500">*</span></label>
                  <select name="reportType" value={lostFormData.reportType} onChange={handleLostFormChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500">
                    <option value="Missing Item">Missing Item</option>
                    <option value="Stolen Item">Stolen Item</option>
                    <option value="Misplaced Item">Misplaced Item</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">What was Lost<span className="text-red-500">*</span></label>
                  <p className="text-xs text-gray-500 mb-1">(Pen, Jacket, Smartphone, Wallet, etc.)</p>
                  <input type="text" name="whatWasLost" value={lostFormData.whatWasLost} onChange={handleLostFormChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block font-semibold mb-1">Item Category <span className="text-red-500">*</span></label>
                  <select name="itemCategory" value={lostFormData.itemCategory} onChange={handleLostFormChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500">
                    <option value="">Select category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Date Lost<span className="text-red-500">*</span></label>
                  <p className="text-xs text-gray-500 mb-1">Approximate date of when the item was lost /found.</p>
                  <input type="date" name="dateLost" value={lostFormData.dateLost} onChange={handleLostFormChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 cursor-pointer" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 mb-4">
                <div>
                  <label className="block font-semibold mb-1">Brand</label>
                  <input type="text" name="brand" value={lostFormData.brand} onChange={handleLostFormChange} placeholder="Guss/louivutin" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Color</label>
                  <select name="color" value={lostFormData.color} onChange={handleLostFormChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500">
                    <option value="">Select color</option>
                    <option value="Black">Black</option>
                    <option value="White">White</option>
                    <option value="Red">Red</option>
                    <option value="Blue">Blue</option>
                    <option value="Green">Green</option>
                    <option value="Yellow">Yellow</option>
                    <option value="Brown">Brown</option>
                    <option value="Gray">Gray</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Location <span className="text-red-500">*</span></label>
                  <input type="text" name="location" value={lostFormData.location} onChange={handleLostFormChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block font-semibold mb-1">Additional Information</label>
                  <p className="text-xs text-gray-500 mb-1">Please provide any additional details/description of your item.</p>
                  <textarea name="additionalInfo" value={lostFormData.additionalInfo} onChange={handleLostFormChange} rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 resize-none" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Photo (Optional)</label>
                  <input type="file" accept="image/jpeg,image/png,image/gif" onChange={handlePhotoChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
                  <p className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, GIF (Max 5MB)</p>
                  {photoPreview && <img src={photoPreview} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded" />}
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#7B1C1C] mb-4">Reporters Information</h3>
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block font-semibold mb-1">Name <span className="text-red-500">*</span></label>
                  <input type="text" name="reporterName" value={lostFormData.reporterName} onChange={handleLostFormChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Mobile Number <span className="text-red-500">*</span></label>
                  <input type="tel" name="mobileNumber" value={lostFormData.mobileNumber} onChange={handleLostFormChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Email <span className="text-red-500">*</span></label>
                  <input type="email" name="email" value={lostFormData.email} onChange={handleLostFormChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-8">
                <button type="button" onClick={handleLostFormCancel} className="px-12 py-3 border border-gray-400 rounded-lg font-semibold hover:bg-gray-100 transition">Cancel</button>
                <button type="submit" disabled={isSubmitting || isMatching} className={`px-12 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition ${isSubmitting || isMatching ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {isSubmitting ? "Submitting..." : isMatching ? "Finding Matches..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showFoundItemForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto py-8">
          <div className="bg-white rounded-xl max-w-4xl w-full p-8 relative mx-4 shadow-xl my-auto">
            <h2 className="text-2xl font-bold text-[#7B1C1C] mb-1">Submit a Report</h2>
            <p className="text-gray-600 mb-6">Our Online Lost & Found can Help you Find what you are Looking For!</p>
            <form onSubmit={handleFoundFormSubmit}>
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block font-semibold mb-1 text-[#7B1C1C]">Report Type <span className="text-red-500">*</span></label>
                  <select name="reportType" value={foundFormData.reportType} onChange={handleFoundFormChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500">
                    <option value="Found Item">Found Item</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#7B1C1C]">What was Found <span className="text-red-500">*</span></label>
                  <p className="text-xs text-gray-500 mb-1">(Pen, Jacket, Smartphone, Wallet, etc.)</p>
                  <input type="text" name="whatWasFound" value={foundFormData.whatWasFound} onChange={handleFoundFormChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block font-semibold mb-1 text-[#7B1C1C]">Item Category <span className="text-red-500">*</span></label>
                  <select name="itemCategory" value={foundFormData.itemCategory} onChange={handleFoundFormChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500">
                    <option value="">Select category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#7B1C1C]">Date Found <span className="text-red-500">*</span></label>
                  <p className="text-xs text-gray-500 mb-1">Approximate date of when the item was found.</p>
                  <input type="date" name="dateFound" value={foundFormData.dateFound} onChange={handleFoundFormChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 cursor-pointer" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 mb-4">
                <div>
                  <label className="block font-semibold mb-1 text-[#7B1C1C]">Brand</label>
                  <input type="text" name="brand" value={foundFormData.brand} onChange={handleFoundFormChange} placeholder="Guss/louivutin" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#7B1C1C]">Color</label>
                  <select name="color" value={foundFormData.color} onChange={handleFoundFormChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500">
                    <option value="">Select color</option>
                    <option value="Black">Black</option>
                    <option value="White">White</option>
                    <option value="Red">Red</option>
                    <option value="Blue">Blue</option>
                    <option value="Green">Green</option>
                    <option value="Yellow">Yellow</option>
                    <option value="Brown">Brown</option>
                    <option value="Gray">Gray</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#7B1C1C]">Location <span className="text-red-500">*</span></label>
                  <input type="text" name="location" value={foundFormData.location} onChange={handleFoundFormChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block font-semibold mb-1 text-[#7B1C1C]">Additional Information</label>
                  <p className="text-xs text-gray-500 mb-1">Please provide any additional details/description of the item.</p>
                  <textarea name="additionalInfo" value={foundFormData.additionalInfo} onChange={handleFoundFormChange} rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 resize-none" />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#7B1C1C]">Photo (Optional)</label>
                  <input type="file" accept="image/jpeg,image/png,image/gif" onChange={handlePhotoChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
                  <p className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, GIF (Max 5MB)</p>
                  {photoPreview && <img src={photoPreview} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded" />}
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <input
                  type="checkbox"
                  name="anonymous"
                  id="dashboard-anonymous"
                  checked={foundFormData.anonymous}
                  onChange={handleFoundFormChange}
                  className="w-5 h-5 cursor-pointer accent-blue-600"
                />
                <label htmlFor="dashboard-anonymous" className="font-bold text-blue-900 cursor-pointer select-none">
                  Submit Anonymously
                  <span className="block text-xs text-blue-500 font-normal">Hide your identity from claimants</span>
                </label>
              </div>

              {!foundFormData.anonymous && (
                <div className="animate-in slide-in-from-top duration-300">
                  <h3 className="text-xl font-bold text-[#7B1C1C] mb-4">Reporters Information</h3>
                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block font-semibold mb-1 text-[#7B1C1C]">Name <span className="text-red-500">*</span></label>
                      <input type="text" name="reporterName" value={foundFormData.reporterName} onChange={handleFoundFormChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-[#7B1C1C]">Mobile Number <span className="text-red-500">*</span></label>
                      <input type="tel" name="mobileNumber" value={foundFormData.mobileNumber} onChange={handleFoundFormChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-[#7B1C1C]">Email <span className="text-red-500">*</span></label>
                      <input type="email" name="email" value={foundFormData.email} onChange={handleFoundFormChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-center gap-4 mt-8">
                <button type="button" onClick={handleFoundFormCancel} className="px-12 py-3 border border-gray-400 rounded-lg font-semibold hover:bg-gray-100 transition">Cancel</button>
                <button type="submit" disabled={isSubmitting || isMatching} className={`px-12 py-3 bg-[#00C853] hover:bg-[#00ad48] text-white font-semibold rounded-lg transition ${isSubmitting || isMatching ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {isSubmitting ? "Submitting..." : isMatching ? "Finding Matches..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MATCH CONFIRMATION MODAL */}
      {
        showMatchModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] max-w-4xl w-full max-h-[90vh] overflow-hidden relative mx-4 shadow-2xl border border-blue-100 animate-in zoom-in-95 duration-300 flex flex-col">

              <div className="p-10 pb-6 text-center border-b border-slate-50 relative">
                <button
                  onClick={() => {
                    setShowMatchModal(false);
                    if (matchType === 'found') navigate('/dashboard/reports');
                    else navigate('/dashboard/track');
                  }}
                  className="cursor-pointer absolute top-8 right-10 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={32} />
                </button>

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full font-black text-sm uppercase tracking-widest mb-4 animate-pulse">
                  <Brain size={16} />
                  AI Smart Match Found
                </div>

                <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
                  Potential Matches Identified!
                </h3>
                <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
                  Our AI found {matchedItems.length} items that closely match your report.
                  Could one of these be what you're looking for?
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {matchedItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all group duration-500">
                      <div className="relative h-48">
                        <img
                          src={item.image_url || "https://images.unsplash.com/photo-1544391439-1dfdc422e178?auto=format&fit=crop&q=80&w=400"}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          alt={item.title}
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full font-black uppercase tracking-tighter shadow-lg">
                            {Math.round(item.similarity * 100)}% Match
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded font-black uppercase tracking-widest">
                            {item.category}
                          </span>
                        </div>
                        <h4 className="text-xl font-black text-slate-900 mb-2 truncate uppercase tracking-tight">{item.title}</h4>
                        <div className="space-y-1 mb-4">
                          <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                            <MapPin size={12} className="text-slate-400" /> {item.location}
                          </p>
                        </div>
                        <button
                          onClick={() => navigate('/dashboard/find-items')}
                          className="cursor-pointer w-full py-3 bg-slate-900 text-white rounded-xl font-black text-sm hover:bg-blue-600 transition-all active:scale-[0.98]"
                        >
                          VIEW DETAILS
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-white border-t border-slate-50 flex justify-center">
                <button
                  onClick={() => {
                    setShowMatchModal(false);
                    if (matchType === 'found') navigate('/dashboard/reports');
                    else navigate('/dashboard/track');
                  }}
                  className="cursor-pointer text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase tracking-widest text-sm"
                >
                  None of these match my report
                </button>
              </div>
            </div>
          </div>
        )
      }

      {
        showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#FFF9E1] rounded-2xl max-w-lg w-full p-10 relative mx-4 shadow-2xl border border-yellow-100/50 animate-in zoom-in-95 duration-300 font-sans">
              <button
                onClick={() => { setShowSuccess(false); navigate(showLostItemForm ? '/dashboard/reports' : '/dashboard/track'); }}
                className="cursor-pointer absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full border-[6px] border-green-500/20 flex items-center justify-center bg-white mb-6">
                  <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                </div>

                <h3 className="text-[1.75rem] font-bold text-[#374151] mb-6 leading-tight">
                  Report Submitted Successfully
                </h3>

                <div className="space-y-1 text-[#4B5563] text-[1.05rem] leading-relaxed mb-8">
                  <p>Thank you for providing your information.</p>
                  <p>No immediate matches were found, but our AI is now constantly monitoring new reports for you.</p>
                  <p>We'll notify you the moment a potential match appears!</p>
                </div>

                <div className="w-full max-w-[140px]">
                  <button
                    onClick={() => {
                      setShowSuccess(false);
                      // Navigation already handled logically or via dashboard redirect
                      if (showLostItemForm) navigate('/dashboard/reports');
                      else navigate('/dashboard/track');
                    }}
                    className="cursor-pointer w-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] text-lg"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}
