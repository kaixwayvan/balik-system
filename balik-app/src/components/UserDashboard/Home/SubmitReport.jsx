import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import BALIKLogo from "../../../assets/BALIK.png";
import DatePicker from "react-datepicker";
import { IoNotifications } from "react-icons/io5";
import { X, CheckCircle, Search, Brain, MapPin, MapPinned } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../../shared/context/AuthContext";
import { itemService } from "../../../services/itemService";

export default function SubmitReport() {
  const [reportType, setReportType] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [location, setLocation] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [itemLost, setItemLost] = useState("");
  const [dateLost, setDateLost] = useState(null);
  const [file, setFile] = useState(null);
  const [reporterName, setReporterName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [matchedItems, setMatchedItems] = useState([]);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [createdItemId, setCreatedItemId] = useState(null);
  const [matchType, setMatchType] = useState(""); // 'lost' or 'found'

  // Auto-fill reporter info
  useEffect(() => {
    if (user) {
      setReporterName(user.user_metadata?.full_name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    // Navigate after closing modal
    if (reportType === "Missing Item") {
      navigate('/dashboard/reports');
    } else {
      navigate('/dashboard/track');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to submit a report.");
      return;
    }

    // Comprehensive validation
    if (!reportType) return alert("Please select a report type.");
    if (!category) return alert("Please select a category.");
    if (reportType === "Missing Item" && !itemLost) return alert("Please specify what was lost.");
    if (!location) return alert("Please enter the location.");
    if (!dateLost) return alert("Please select the date.");
    if (!reporterName) return alert("Reporter name is required.");
    if (!mobile) return alert("Mobile number is required.");
    if (!email) return alert("Email is required.");

    setIsSubmitting(true);
    try {
      // 1. Upload image if exists
      let imageUrl = null;
      if (file) {
        imageUrl = await itemService.uploadItemImage(file);
      }

      // 2. Format date for Supabase (YYYY-MM-DD)
      const formattedDate = dateLost instanceof Date
        ? dateLost.toISOString().split('T')[0]
        : dateLost;

      const mappedData = {
        user_id: user.id,
        type: reportType === "Missing Item" ? "lost" : "found",
        category,
        title: itemLost || (reportType === "Found Item" ? `Found ${category}` : "Untitled Item"),
        description: `Brand: ${brand}\nColor: ${color}\n\n${additionalInfo}`,
        location,
        date_reported: formattedDate,
        status: 'pending',
        image_url: imageUrl,
        metadata: {
          brand,
          color,
          reporter: {
            name: reporterName,
            mobile,
            email
          }
        }
      };

      // Generate embedding for smart matching (Non-blocking with timeout)
      try {
        const searchText = `${category} ${mappedData.title} ${brand} ${color} ${location} ${additionalInfo}`;

        // Add timeout to prevent blocking
        const embeddingPromise = nlpService.generateEmbedding(searchText);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('NLP timeout')), 5000)
        );

        const embedding = await Promise.race([embeddingPromise, timeoutPromise]);

        if (embedding) {
          mappedData.description_embedding = embedding;
        }
      } catch (nlpError) {
        console.warn("NLP Embedding failed in SubmitReport:", nlpError.message);
      }

      const newItem = await itemService.reportItem(mappedData);
      setCreatedItemId(newItem?.id);

      // 3. Immediate Smart Match Check
      if (mappedData.description_embedding) {
        try {
          const targetType = mappedData.type === "lost" ? "found" : "lost";
          const matches = await itemService.getSmartMatches(
            mappedData.description_embedding,
            targetType,
            0.6,
            5,
            {
              category,
              color,
              location,
              date: formattedDate
            }
          );

          if (matches && matches.length > 0) {
            setMatchedItems(matches);
            setMatchType(targetType);
            setShowMatchModal(true);
            setIsSubmitting(false);
            return; // Don't show regular success, show matches
          }
        } catch (matchError) {
          console.warn("Match check failed:", matchError);
        }
      }

      setShowSuccess(true);

      // Reset form but don't navigate yet, let them click OK
      setBrand("");
      setColor("");
      setLocation("");
      setAdditionalInfo("");
      setItemLost("");
      setDateLost(null);
      setFile(null);
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Failed to submit report: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="h-20 bg-white border-b flex items-center justify-between px-6">
        <div className="mt-6 font-semibold text-gray-700">
          <Link to="/">
            <img
              src={BALIKLogo}
              className="h-22 mb-6 mx-auto"
              alt="BALIK Logo"
            />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="cursor-pointer text-gray-500">
            <IoNotifications size={20} className="text-gray-500" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden text-white">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold">{user?.user_metadata?.full_name?.charAt(0) || "U"}</span>
              )}
            </div>
            <div className="text-sm">
              <p className="font-medium">{user?.user_metadata?.full_name || "Guest User"}</p>
              <p className="text-[10px] text-gray-500 font-semibold uppercase">ISKOLAR NG BAYAN</p>
            </div>
          </div>
        </div>
      </header>

      <div className="min-h-[calc(100vh-80px)] bg-gray-50 p-6 md:p-10">
        <div className="max-w-5xl mx-auto bg-white rounded-xl border p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-[#7B1C1C]">Submit a Report</h1>
          <p className="text-gray-500 mb-8">
            Our Online Lost & Found can Help you Find what you are Looking For!
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="reportType"
                    className="block text-sm font-medium mb-1"
                  >
                    Report Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="reportType"
                    required
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="" disabled>
                      Select report type
                    </option>
                    <option value="Missing Item">Missing Item</option>
                    <option value="Found Item">Found Item</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium mb-1"
                  >
                    Item Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    <option value="Electronics">Electronics</option>
                    <option value="ID & Documents">ID & Documents</option>
                    <option value="Wallets & Bags">Wallets & Bags</option>
                    <option value="Clothing & Accessories">Clothing & Accessories</option>
                    <option value="Personal Items">Personal Items</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    placeholder="Gucci / Louis Vuitton"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Color
                    </label>
                    <select
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full border rounded-md px-3 py-2"
                    >
                      <option value="" disabled>
                        Select color
                      </option>
                      <option value="Black">Black</option>
                      <option value="White">White</option>
                      <option value="Red">Red</option>
                      <option value="Blue">Blue</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Additional Information
                  </label>
                  <p className="text-xs text-gray-500 mb-1">
                    Please provide any additional details/description of your
                    item.
                  </p>
                  <textarea
                    rows={4}
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    What was Lost <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-1">
                    (Pen, Jacket, Smartphone, Wallet, etc.)
                  </p>
                  <input
                    type="text"
                    required
                    value={itemLost}
                    onChange={(e) => setItemLost(e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Date Lost <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-1">
                    Approximate date the item was lost or found.
                  </p>

                  <DatePicker
                    selected={dateLost}
                    onChange={(date) => setDateLost(date)}
                    placeholderText="Select date"
                    required
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Photo (Optional)
                  </label>

                  <div className="flex items-center w-full border rounded-md overflow-hidden">
                    <label className="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 cursor-pointer font-medium">
                      Choose File
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/gif"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>

                    <div className="flex-1 px-3 py-2 text-sm text-gray-600 bg-gray-100">
                      {file ? file.name : "No file chosen"}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: JPG, PNG, GIF (Max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Reporter Info */}
            <h2 className="text-blue-600 font-semibold text-lg mt-10 mb-4">
              Reporter’s Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 mt-10">
              <Link to="/dashboard">
                <button
                  type="reset"
                  onClick={() => {
                    setReportType("");
                    setCategory("");
                    setBrand("");
                    setColor("");
                    setLocation("");
                    setAdditionalInfo("");
                    setItemLost("");
                    setDateLost(null);
                    setFile(null);
                    setReporterName("");
                    setMobile("");
                    setEmail("");
                  }}
                  className="cursor-pointer px-8 py-2 border rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`cursor-pointer px-10 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#FFF9E1] rounded-2xl max-w-lg w-full p-10 relative mx-4 shadow-2xl border border-yellow-100/50 animate-in zoom-in-95 duration-300">
            <button
              onClick={handleCloseSuccess}
              className="cursor-pointer absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full border-[6px] border-green-500/20 flex items-center justify-center bg-white mb-6">
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879A1 1 0 003.293 9.293l4 4a1 1 0 001.414 0l8-8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <h3 className="text-[1.75rem] font-bold text-[#374151] mb-6 leading-tight">
                {reportType === "Missing Item" ? "Lost Item Report Submitted" : "Found Item Report Submitted"}
              </h3>

              <div className="space-y-1 text-[#4B5563] text-[1.05rem] leading-relaxed mb-8">
                <p>Thank you for providing your information.</p>
                <p>We have received your submission and our team is currently reviewing your report.</p>
                <p>We appreciate you taking the time to report this item.</p>
              </div>

              <div className="w-full max-w-[140px]">
                <button
                  onClick={handleCloseSuccess}
                  className="cursor-pointer w-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] text-lg"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showMatchModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] max-w-4xl w-full max-h-[90vh] overflow-hidden relative mx-4 shadow-2xl border border-blue-100 animate-in zoom-in-95 duration-300 flex flex-col">

            <div className="p-10 pb-6 text-center border-b border-slate-50 relative">
              <button
                onClick={handleCloseSuccess}
                className="cursor-pointer absolute top-8 right-10 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={32} />
              </button>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full font-black text-sm uppercase tracking-widest mb-4">
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
                        onClick={handleCloseSuccess}
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
                onClick={handleCloseSuccess}
                className="cursor-pointer text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase tracking-widest text-sm"
              >
                None of these match my report
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
