import { useState, useRef, useEffect } from "react"
import UserProfile from "../components/UserDashboard/UserProfile/UserProfile";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { valuableItemsCards, systemCards } from "./data/cards"
import { ALL_CATEGORIES } from "../shared/constants/categories"
import { foundItems } from "./data/recentlyFoundData"
import headerBg from "../assets/home-assets/bg-header.png"
import { whyBalikData } from "./data/whyBalikData"
import { topContributors } from "./data/topContributorsData"
import { successStories } from "./data/successStoriesData"
import { securityData } from "./data/securityData";
import { faqData } from "./data/faqData";
import { Search, ChevronDown, Users, UserPlus, LogIn, X, Brain, Check, MapPinned } from "lucide-react";
import ColorPicker from "../shared/components/ColorPicker";
import MapPicker from "../shared/components/MapPicker";
import { joinFeaturesData } from "./data/joinFeaturesData";
import { useAuth } from "../shared/context/AuthContext";
import { itemService } from "../services/itemService";
import { nlpService } from "../services/nlpService";
import Joi from "joi";

// Validation Schema
const schema = Joi.string().trim().min(2).max(100)
  .pattern(/^[\p{L}\p{M} .&'-]+$/u)
  .invalid('asdf', 'qwerty');

// Country codes list with emoji flags
const countryCodes = [
  { code: "+1", name: "United States", flag: "🇺🇸", example: "2025550123", minLength: 10 },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧", example: "7123456789", minLength: 10 },
  { code: "+61", name: "Australia", flag: "🇦🇺", example: "412345678", minLength: 9 },
  { code: "+63", name: "Philippines", flag: "🇵🇭", example: "9123456789", minLength: 10 },
  { code: "+91", name: "India", flag: "🇮🇳", example: "9123456789", minLength: 10 },
  { code: "+81", name: "Japan", flag: "🇯🇵", example: "9012345678", minLength: 10 },
  { code: "+49", name: "Germany", flag: "🇩🇪", example: "15123456789", minLength: 10 },
  { code: "+33", name: "France", flag: "🇫🇷", example: "612345678", minLength: 9 },
  { code: "+39", name: "Italy", flag: "🇮🇹", example: "3123456789", minLength: 10 },
  { code: "+7", name: "Russia", flag: "🇷🇺", example: "9123456789", minLength: 10 },
  { code: "+86", name: "China", flag: "🇨🇳", example: "13800138000", minLength: 11 },
  { code: "+82", name: "South Korea", flag: "🇰🇷", example: "1012345678", minLength: 10 },
  { code: "+55", name: "Brazil", flag: "🇧🇷", example: "91987654321", minLength: 11 },
  { code: "+27", name: "South Africa", flag: "🇿🇦", example: "712345678", minLength: 9 },
  { code: "+34", name: "Spain", flag: "🇪🇸", example: "612345678", minLength: 9 },
  { code: "+47", name: "Norway", flag: "🇳🇴", example: "91234567", minLength: 8 },
  { code: "+46", name: "Sweden", flag: "🇸🇪", example: "701234567", minLength: 9 },
  { code: "+41", name: "Switzerland", flag: "🇨🇭", example: "791234567", minLength: 9 },
  { code: "+31", name: "Netherlands", flag: "🇳🇱", example: "612345678", minLength: 9 },
  { code: "+48", name: "Poland", flag: "🇵🇱", example: "501234567", minLength: 9 },
  { code: "+352", name: "Luxembourg", flag: "🇱🇺", example: "66123456", minLength: 8 },
  { code: "+32", name: "Belgium", flag: "🇧🇪", example: "471234567", minLength: 9 },
  { code: "+351", name: "Portugal", flag: "🇵🇹", example: "912345678", minLength: 9 },
  { code: "+353", name: "Ireland", flag: "🇮🇪", example: "851234567", minLength: 9 },
  { code: "+30", name: "Greece", flag: "🇬🇷", example: "6912345678", minLength: 10 },
  { code: "+60", name: "Malaysia", flag: "🇲🇾", example: "123456789", minLength: 9 },
  { code: "+65", name: "Singapore", flag: "🇸🇬", example: "91234567", minLength: 8 },
  { code: "+358", name: "Finland", flag: "🇫🇮", example: "401234567", minLength: 9 },
  { code: "+52", name: "Mexico", flag: "🇲🇽", example: "5512345678", minLength: 10 },
  { code: "+54", name: "Argentina", flag: "🇦🇷", example: "91123456789", minLength: 11 },
  { code: "+98", name: "Iran", flag: "🇮🇷", example: "9123456789", minLength: 10 },
  { code: "+20", name: "Egypt", flag: "🇪🇬", example: "1012345678", minLength: 10 },
  { code: "+964", name: "Iraq", flag: "🇮🇶", example: "7712345678", minLength: 10 },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦", example: "501234567", minLength: 9 },
  { code: "+212", name: "Morocco", flag: "🇲🇦", example: "661234567", minLength: 9 },
  { code: "+92", name: "Pakistan", flag: "🇵🇰", example: "3012345678", minLength: 10 },
  { code: "+84", name: "Vietnam", flag: "🇻🇳", example: "912345678", minLength: 9 },
  { code: "+66", name: "Thailand", flag: "🇹🇭", example: "912345678", minLength: 9 },
  { code: "+995", name: "Georgia", flag: "🇬🇪", example: "551234567", minLength: 9 },
  { code: "+386", name: "Slovenia", flag: "🇸🇮", example: "31234567", minLength: 8 },
  { code: "+421", name: "Slovakia", flag: "🇸🇰", example: "901234567", minLength: 9 },
  { code: "+373", name: "Moldova", flag: "🇲🇩", example: "79123456", minLength: 8 },
  { code: "+52", name: "Mexico", flag: "🇲🇽", example: "5512345678", minLength: 10 },
  { code: "+358", name: "Finland", flag: "🇫🇮", example: "401234567", minLength: 9 }
];

function Home() {
  const navigate = useNavigate()
  const { hash } = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [hash])

  const formRef = useRef(null)
  const [formMode, setFormMode] = useState("found") // 'found' | 'lost'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [recentSupabaseItems, setRecentSupabaseItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);

  // Fetch real data from Supabase for "Recently Found Items"
  useEffect(() => {
    async function fetchRecent() {
      try {
        setItemsLoading(true);
        const data = await itemService.getRecentItems('found', 6);
        setRecentSupabaseItems(data);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setItemsLoading(false);
      }
    }
    fetchRecent();
  }, []);

  const [index, setIndex] = useState(0);
  const story = successStories.length > 0 ? successStories[index] : null;

  const prevStory = () => {
    setIndex((prev) =>
      prev === 0 ? successStories.length - 1 : prev - 1
    )
  }

  const nextStory = () => {
    setIndex((prev) =>
      prev === successStories.length - 1 ? 0 : prev + 1
    )
  }

  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All Items")
  const [selectedItem, setSelectedItem] = useState(null)

  // Form state (Aligned with Dashboard)
  const [formData, setFormData] = useState({
    reportType: "Found Item",
    whatWasFound: "",
    itemCategory: "",
    dateFound: "",
    brand: "",
    color: "",
    location: "",
    additionalInfo: "",
    imageFile: null,
    reporterName: "",
    mobileNumber: "",
    email: "",
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [submitted, setSubmitted] = useState({ show: false, mode: "found" })
  const [, setFormAnimate] = useState(false)
  const [matchedItems, setMatchedItems] = useState([]);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  const handleLocationSelect = (address) => {
    setFormData(prev => ({ ...prev, location: address }));
    setShowMapModal(false);
  };

  const filteredFAQs = faqData.filter((item) =>
    item.question.toLowerCase().includes(search.toLowerCase()) ||
    item.answer.toLowerCase().includes(search.toLowerCase())
  );

  const displayedFoundItems =
    activeCategory === "All Items"
      ? recentSupabaseItems
      : recentSupabaseItems.filter((it) => it.category === activeCategory)

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  function handleHeaderReportFound() {
    setFormMode("found")
    setFormAnimate(true)
    scrollToForm()
    setTimeout(() => setFormAnimate(false), 700)
  }

  function handleHeaderReportLost() {
    navigate("/login")
  }

  function handleInputChange(e) {
    const { name, value, type, checked } = e.target

    const textOnlyFields = ["brand", "whatWasFound", "reporterName"];
    if (textOnlyFields.includes(name)) {
      if (value && !/^[\p{L}\p{M} .&'-]*$/u.test(value)) {
        return;
      }
    }

    if (type === "checkbox") {
      setFormData((s) => ({ ...s, [name]: checked }))
    } else {
      setFormData((s) => ({ ...s, [name]: value }))
    }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0] || null
    setFormData((s) => ({ ...s, imageFile: file }))
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
      setImagePreview(null)
    }
    if (file) setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validateForm()) {
      setSubmitted({ show: true, mode: 'found', isError: true, message: "Please fill all required fields before submitting." });
      return
    }

    setIsSubmitting(true)
    try {
      let imageUrl = null
      if (formData.imageFile) {
        imageUrl = await itemService.uploadItemImage(formData.imageFile)
      }

      const mappedData = {
        type: 'found',
        category: formData.itemCategory,
        title: formData.whatWasFound,
        description: `Brand: ${formData.brand}\nColor: ${formData.color}\n\n${formData.additionalInfo}`,
        location: formData.location,
        date_found: formData.dateFound,
        date_reported: new Date().toISOString(),
        status: 'pending',
        image_url: imageUrl,
        metadata: {
          brand: formData.brand,
          color: formData.color,
          reporter: {
            name: formData.reporterName,
            mobile: formData.mobileNumber,
            email: formData.email
          }
        }
      }

      if (user?.id) mappedData.user_id = user.id;

      let currentEmbedding = null;
      try {
        const searchText = `${formData.itemCategory} ${formData.whatWasFound} ${formData.brand} ${formData.color} ${formData.location} ${formData.additionalInfo}`;
        currentEmbedding = await nlpService.generateEmbedding(searchText);
        if (currentEmbedding) mappedData.description_embedding = currentEmbedding;
      } catch (nlpError) {
        console.warn("Embedding generation failed:", nlpError);
      }

      await itemService.reportItem(mappedData);
      
      const submittedFormData = { ...formData };
      setFormData({
        reportType: "Found Item",
        whatWasFound: "",
        itemCategory: "",
        dateFound: "",
        brand: "",
        color: "",
        location: "",
        additionalInfo: "",
        imageFile: null,
        reporterName: "",
        mobileNumber: "",
        email: "",
      });
      setImagePreview(null);

      setIsMatching(true);
      if (currentEmbedding) {
        try {
          const matches = await itemService.getSmartMatches(currentEmbedding, 'lost', 0.5, 4);
          if (matches && matches.length > 0) {
            setMatchedItems(matches);
            setShowMatchModal(true);
            setIsMatching(false);
            return;
          }
        } catch (matchError) {
          console.error("Smart matching error:", matchError);
        }
      }
      setIsMatching(false);
      setSubmitted({ show: true, mode: 'found', isError: false });

      const data = await itemService.getRecentItems('found', 6);
      setRecentSupabaseItems(data);
      setActiveCategory("All Items");
    } catch (err) {
      console.error("Submission Error:", err);
      setSubmitted({ show: true, mode: 'found', isError: true, message: err.message });
    } finally {
      setIsSubmitting(false)
    }
  }

  function validateForm() {
    const { whatWasFound, itemCategory, dateFound, location, reporterName, mobileNumber, email } = formData;
    return whatWasFound && itemCategory && dateFound && location && reporterName && mobileNumber && email;
  }

  return (
    <main>
      {/* HEADER */}
      <div
        className="relative w-full h-[450px] flex flex-col md:flex-row items-center justify-between gap-6 px-6 md:px-24 pt-24 text-white"
        style={{
          backgroundImage: `url(${headerBg})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
        }}
      >
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#F5E6E6]/20 to-[#ffdac9]/90"></div>
        <div className="relative z-20 flex flex-col justify-center max-w-3xl font-['Plus_Jakarta_Sans']">
          <h2 className="leading-tight text-4xl md:text-5xl mb-4 text-[#520000] font-extrabold">
            Lost Something On Campus? <br />
            Let’s Help You Find It.
          </h2>
          <p className="text-base font-bold font-['Lora'] mb-6 text-[#331e0c]">
            Looked everywhere on campus? Don’t stress! <br />
            Report, search, or claim lost items in minutes. <br />
            BALIK helps you reconnect with what matters.
          </p>
        </div>
        <div className="relative z-20 flex flex-col md:flex-row gap-8 items-center">
          <button type="button" onClick={handleHeaderReportLost} className="cursor-pointer bg-[#E50000] text-white font-bold h-16 w-72 rounded-full shadow-lg hover:bg-[#c40000] hover:-translate-y-1 transition-all duration-300 active:scale-95 text-xl flex items-center justify-center border border-[#b00000]/20">Report Lost Item</button>
          <button type="button" onClick={handleHeaderReportFound} className="cursor-pointer bg-[#02D44F] text-white font-bold h-16 w-72 rounded-full shadow-lg hover:bg-[#02b844] hover:-translate-y-1 transition-all duration-300 active:scale-95 text-xl flex items-center justify-center border border-[#2eb857]/20">Report Found Item</button>
        </div>
      </div>

      {/* SECTION 1 - The Frustration */}
      <section className="flex flex-col p-12 items-center justify-center bg-[#f7e6dc] shadow-[inset_0_1px_12px_rgba(0,0,0,0.12),_inset_0_-0.5px_12px_rgba(0,0,0,0.10)]">
        <h2 className="text-5xl font-extrabold mb-5 text-center">The Frustration of Losing Valuable Items</h2>
        <p className="mb-10 text-center max-w-2xl">Every day, thousands of people experience the stress and anxiety of losing important belongings.</p>
        <div className="mb-12 p-4 text-xl rounded-2xl shadow-lg border border-[#a11010] hover:shadow-xl transition-all duration-300 bg-white">73% of people lose valuable items monthly, spending 12+ hours searching</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mb-6">
          {valuableItemsCards.map((card) => (
            <div key={card.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 mb-4">
                <img src={card.icon} alt={card.title} className="w-6 h-6 object-contain" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2 - How It Works */}
      <section id="how-it-works" className="flex flex-col p-12 items-center justify-center">
        <h2 className="text-3xl text-black font-extrabold mb-10 text-center">How Our System Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl px-5 mx-auto">
          {systemCards.map((card) => (
            <div key={card.id} className="bg-white rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <img src={card.icon} alt={card.title} className="w-10 h-10 object-contain" />
              </div>
              <h3 className="text-lg font-semibold mb-4">{card.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3 - Recently Found */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-[2.8rem] text-black font-extrabold mb-2">Recently Found Items</h2>
          <p className="text-gray-500 text-lg">Admin-verified items waiting to be reunited with their owners</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {ALL_CATEGORIES.map((cat, index) => (
            <button key={index} onClick={() => setActiveCategory(cat)} className={`cursor-pointer px-8 py-3 rounded-full text-sm font-bold transition-all border-2 ${cat === activeCategory ? "bg-[#7B1C1C] text-white border-[#7B1C1C] shadow-lg" : "bg-white text-gray-600 border-gray-100"}`}>{cat}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {itemsLoading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-500 font-medium">Loading items...</p>
            </div>
          ) : displayedFoundItems.length > 0 ? (
            displayedFoundItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="relative">
                  <img src={item.image_url || "https://images.unsplash.com/photo-1544391439-1dfdc422e178?auto=format&fit=crop&q=80&w=400"} alt={item.title} className="w-full h-56 object-cover" />
                  <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow-sm">✓ Verified</span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-semibold text-lg mb-1 truncate">{item.title}</h3>
                  <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded mb-2 w-fit">{item.category}</span>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-xs text-gray-500 truncate max-w-[100px]">{item.location}</span>
                    <button onClick={() => setSelectedItem(item)} className="cursor-pointer bg-[#7B1C1C] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#5a1414] transition-all">Details</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">No recently found items</div>
          )}
        </div>
      </section>

      {/* SECTION 4 - Report Form */}
      <section className="py-24 bg-gray-50 flex justify-center px-4">
        <div className="w-full max-w-5xl" ref={formRef}>
          <div className="text-center mb-12">
            <h2 className="text-[2.8rem] text-black font-extrabold mb-3">Report Found Item</h2>
            <p className="text-gray-500 text-lg">Help your community by reporting items you've found on campus.</p>
          </div>
          <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-[#7B1C1C] text-lg">Report Type *</label>
                <input type="text" value="Found Item" readOnly className="w-full p-4 rounded-xl border border-slate-200 bg-slate-100 font-semibold" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold text-[#7B1C1C] text-lg">What was Found *</label>
                <input type="text" name="whatWasFound" value={formData.whatWasFound} onChange={handleInputChange} placeholder="Item name" className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-[#7B1C1C] text-lg">Category *</label>
                <select name="itemCategory" value={formData.itemCategory} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 outline-none" required>
                  <option value="">Select category</option>
                  {ALL_CATEGORIES.filter(c => c !== "All Items").map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold text-[#7B1C1C] text-lg">Date Found *</label>
                <input type="date" name="dateFound" value={formData.dateFound} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 outline-none" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-[#7B1C1C] text-lg">Brand</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="e.g. Apple" className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 outline-none" />
              </div>
              <ColorPicker value={formData.color} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-[#7B1C1C] text-lg text-left">Location <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Where was it found?" className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none" required />
                  <button type="button" onClick={() => setShowMapModal(true)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-[#7B1C1C] transition-all"><MapPinned size={22} /></button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold text-[#7B1C1C] text-lg">Photo (Optional)</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-[#7B1C1C] text-lg">Additional Info</label>
              <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleInputChange} rows={3} className="w-full p-4 border border-slate-200 rounded-xl outline-none" placeholder="More details..." />
            </div>
            <div className="pt-8 border-t border-slate-100">
              <h3 className="text-2xl font-bold text-[#7B1C1C] mb-6">Reporter's Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <input type="text" name="reporterName" value={formData.reporterName} onChange={handleInputChange} placeholder="Full Name" className="p-4 border rounded-xl" required />
                <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} placeholder="Mobile Number" className="p-4 border rounded-xl" required />
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="p-4 border rounded-xl" required />
              </div>
            </div>
            <div className="flex justify-center pt-8">
              <button type="submit" disabled={isSubmitting || isMatching} className="bg-[#7B1C1C] text-white font-bold py-4 px-12 rounded-full shadow-lg hover:bg-[#5a1414] transition-all active:scale-95 uppercase tracking-widest">{isSubmitting ? "Submitting..." : isMatching ? "Finding matches..." : "Submit Report"}</button>
            </div>
          </form>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-32 bg-white text-center px-6">
        <h2 className="text-5xl font-black mb-8">Ready to help others?</h2>
        <div className="flex justify-center gap-8">
          <Link to="/signup" className="bg-[#7B1C1C] text-white px-12 py-5 rounded-full font-bold text-xl hover:bg-[#5a1414] transition-all">Get Started</Link>
          <Link to="/login" className="border-2 border-[#7B1C1C] text-[#7B1C1C] px-12 py-5 rounded-full font-bold text-xl hover:bg-red-50 transition-all">Sign In</Link>
        </div>
      </section>

      {/* Success Modal */}
      {submitted.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] max-w-lg w-full p-10 text-center shadow-2xl relative">
            <button onClick={() => setSubmitted({ show: false, mode: "found" })} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"><X size={24} /></button>
            <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${submitted.isError ? 'bg-red-500' : 'bg-green-500'}`}>
              <Check className="text-white" size={40} />
            </div>
            <h3 className="text-2xl font-black mb-4">{submitted.isError ? 'Error' : 'Success!'}</h3>
            <p className="text-gray-600 mb-8">{submitted.message || (submitted.isError ? "Submission failed." : "Report submitted successfully.")}</p>
            <button onClick={() => setSubmitted({ show: false, mode: "found" })} className="w-full py-4 bg-[#7B1C1C] text-white rounded-full font-bold uppercase">OK</button>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-[2.5rem] max-w-3xl w-full h-[600px] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center">
              <h3 className="text-2xl font-black">Select Location</h3>
              <button onClick={() => setShowMapModal(false)}><X size={24} /></button>
            </div>
            <div className="flex-1 p-8"><MapPicker onSelect={handleLocationSelect} onClose={() => setShowMapModal(false)} /></div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Home;
