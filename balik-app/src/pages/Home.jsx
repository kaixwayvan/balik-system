import { useState, useRef, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom";
import { valuableItemsCards, systemCards } from "./data/cards"
import { foundItems } from "./data/recentlyFoundData"
import headerBg from "../assets/home-assets/bg-header.png"
import { whyBalikData } from "./data/whyBalikData"
import { topContributors } from "./data/topContributorsData"
import { successStories } from "./data/successStoriesData"
import { securityData } from "./data/securityData";
import { faqData } from "./data/faqData";
import { Search, ChevronDown, Users, UserPlus, LogIn, X, Brain, Check, MapPinned, ChevronUp, MapPin, Calendar } from "lucide-react";
import ColorPicker from "../shared/components/ColorPicker";
import MapPicker from "../shared/components/MapPicker";
import { nlpService } from "../services/nlpService";
import { itemService } from "../services/itemService";

const ALL_CATEGORIES = ["All Items", "Electronics", "Accessories", "Bags", "Documents", "Others"];



function Home() {
  const navigate = useNavigate()
  const { hash } = useLocation()

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
  const [recentSupabaseItems, setRecentSupabaseItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [index, setIndex] = useState(0);
  const story = successStories.length > 0 ? successStories[index] : null;

  const prevStory = () => {
    if (successStories.length === 0) return;
    setIndex((prev) =>
      prev === 0 ? successStories.length - 1 : prev - 1
    )
  }

  const nextStory = () => {
    if (successStories.length === 0) return;
    setIndex((prev) =>
      prev === successStories.length - 1 ? 0 : prev + 1
    )
  }

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Items")
  const [selectedItem, setSelectedItem] = useState(null)
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const filteredFAQs = faqData.filter((item) =>
    item.question.toLowerCase().includes(search.toLowerCase()) ||
    item.answer.toLowerCase().includes(search.toLowerCase())
  );

  // Form state
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
    scrollToForm()
  }

  function handleHeaderReportLost() {
    navigate("/login")
  }

  function handleInputChange(e) {
    const { name, value, type, checked } = e.target;

    // Date validation: Prevent future dates and dates before 2025
    if (name === "dateFound") {
      const today = new Date().toISOString().split("T")[0];
      const minDate = "2025-01-01";
      if (value > today || (value && value < minDate)) return;
    }

    // Text field validation: Only allow letters, spaces, and common punctuation
    const textOnlyFields = ["brand", "reporterName", "whatWasFound"];
    if (textOnlyFields.includes(name)) {
      if (value && !/^[\p{L}\p{M} .&'-]*$/u.test(value)) {
        return;
      }
    }

    if (type === "checkbox") {
      setFormData((s) => ({ ...s, [name]: checked }));
    } else {
      setFormData((s) => ({ ...s, [name]: value }));
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
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Upload image if exists
      let imageUrl = null;
      if (formData.imageFile) {
        imageUrl = await itemService.uploadItemImage(formData.imageFile);
      }

      // 2. Generate NLP Embedding for smart matching
      // Combining title and description for better context
      const textToEmbed = `${formData.whatWasFound}. ${formData.additionalInfo}`;
      const embedding = await nlpService.generateEmbedding(textToEmbed);

      // 3. Save to Supabase
      const itemToSave = {
        title: formData.whatWasFound,
        category: formData.itemCategory,
        date_reported: formData.dateFound,
        brand: formData.brand,
        color: formData.color,
        location: formData.location,
        description: formData.additionalInfo,
        image_url: imageUrl,
        reporter_name: formData.reporterName,
        reporter_mobile: formData.mobileNumber,
        reporter_email: formData.email,
        type: formMode === "found" ? "found" : "lost",
        embedding: embedding // This stores the 384d vector for RPC match_items
      };

      await itemService.reportItem(itemToSave);

      setSubmitted({ show: true, mode: formMode, isError: false });
      
      // Reset Form
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
    } catch (error) {
      console.error("Submission failed:", error);
      setSubmitted({ show: true, mode: formMode, isError: true });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="overflow-x-hidden">
      {/* HEADER */}
      <div
        className="relative w-full h-[500px] flex flex-col md:flex-row items-center justify-between gap-6 px-6 md:px-24 pt-24 text-white"
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
        <h2 className="text-4xl md:text-5xl font-extrabold mb-5 text-center text-[#520000]">The Frustration of Losing Valuable Items</h2>
        <p className="mb-10 text-center max-w-2xl text-[#331e0c]">Every day, thousands of students experience the stress and anxiety of losing important belongings.</p>
        <div className="mb-12 p-6 text-xl rounded-2xl shadow-lg border border-[#a11010] hover:shadow-xl transition-all duration-300 bg-white font-bold text-[#7B1C1C]">73% of people lose valuable items monthly, spending 12+ hours searching</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mb-6">
          {valuableItemsCards.map((card) => (
            <div key={card.id} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#fdf2f2] mb-6">
                <img src={card.icon} alt={card.title} className="w-8 h-8 object-contain" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#520000]">{card.title}</h3>
              <p className="text-gray-600 leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2 - How It Works */}
      <section id="how-it-works" className="flex flex-col p-20 items-center justify-center bg-white">
        <h2 className="text-4xl text-black font-extrabold mb-16 text-center">How Our System Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl px-5 mx-auto">
          {systemCards.map((card) => (
            <div key={card.id} className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 flex items-center justify-center rounded-3xl bg-[#f8fafc] mb-6 group-hover:bg-[#f1f5f9] transition-colors">
                <img src={card.icon} alt={card.title} className="w-10 h-10 object-contain" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">{card.title}</h3>
              <p className="text-slate-600 leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION - Why BALIK */}
      <section id="about-us" className="py-24 bg-[#FFF5F5] text-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-[#520000]">Why Choose BALIK?</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">Designed specifically for the PUP community with cutting-edge technology.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyBalikData.map((item, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-white border border-red-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
                  <item.icon className="text-[#7B1C1C]" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#520000]">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION - Security */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900">Your Security is Our Priority</h2>
              <p className="text-slate-600 text-lg mb-10 leading-relaxed">We implement industry-standard protocols to ensure every reunion is safe, verified, and private.</p>
              <div className="space-y-6">
                {securityData.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-[#7B1C1C]">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-500 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {securityData.slice(3).map((item, i) => (
                <div key={i} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all">
                  <item.icon className="text-[#7B1C1C] mb-4" size={32} />
                  <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - Recently Found */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl text-black font-extrabold mb-4">Recently Found Items</h2>
          <p className="text-gray-500 text-lg">Admin-verified items waiting to be reunited with their owners</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {ALL_CATEGORIES.map((cat, index) => (
            <button 
              key={index} 
              onClick={() => setActiveCategory(cat)} 
              className={`cursor-pointer px-8 py-3 rounded-full text-sm font-bold transition-all border-2 ${
                cat === activeCategory 
                  ? "bg-[#B45309] border-[#B45309] text-white shadow-lg scale-105" 
                  : "bg-white text-gray-600 border-gray-100 hover:border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        {displayedFoundItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedFoundItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col h-full hover:shadow-lg transition-all border border-gray-100">
                <div className="relative">
                  <img src={item.image_url || "https://images.unsplash.com/photo-1544391439-1dfdc422e178?auto=format&fit=crop&q=80&w=400"} alt={item.title} className="w-full h-64 object-cover" />
                  <span className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm">✓ Verified</span>
                </div>
                <div className="p-6 flex flex-1 flex-col">
                  <h3 className="font-bold text-xl mb-2 text-slate-900">{item.title}</h3>
                  <span className="inline-block bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full mb-4 w-fit font-bold">{item.category}</span>
                  <p className="text-sm text-slate-600 mb-6 line-clamp-2">{item.description}</p>
                  <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-50">
                    <span className="text-xs text-slate-400 font-medium truncate max-w-[150px]">📍 {item.location}</span>
                    <button onClick={() => setSelectedItem(item)} className="cursor-pointer bg-[#B45309] text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-[#92400e] transition-all">Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium italic">No recently found items reported yet.</p>
          </div>
        )}
      </section>

      {/* SECTION 4 - Report Form */}
      <section className="py-28 bg-gray-50 flex justify-center px-4" id="report">
        <div className="w-full max-w-5xl" ref={formRef}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-black font-extrabold mb-4">Report Found Item</h2>
            <p className="text-gray-500 text-lg">Help your community by reporting items you've found on campus.</p>
          </div>
          <form onSubmit={handleSubmit} className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-2xl space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col gap-3">
                <label className="font-bold text-slate-700 text-lg">Report Type <span className="text-red-500">*</span></label>
                <input type="text" value="Found Item" readOnly className="w-full p-5 rounded-2xl border border-slate-200 bg-slate-100 font-bold text-slate-600" />
              </div>
              <div className="flex flex-col gap-3">
                <label className="font-bold text-slate-700 text-lg">What was Found <span className="text-red-500">*</span></label>
                <input type="text" name="whatWasFound" value={formData.whatWasFound} onChange={handleInputChange} placeholder="e.g. Blue Backpack" className="w-full p-5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-red-50 outline-none transition-all" required />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col gap-3">
                <label className="font-bold text-slate-700 text-lg">Category <span className="text-red-500">*</span></label>
                <select name="itemCategory" value={formData.itemCategory} onChange={handleInputChange} className="w-full p-5 rounded-2xl border border-slate-200 bg-slate-50 outline-none cursor-pointer" required>
                  <option value="">Select category</option>
                  {ALL_CATEGORIES.filter(c => c !== "All Items").map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-3">
                <label className="font-bold text-slate-700 text-lg">Date Found <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    type="date" 
                    name="dateFound" 
                    min="2025-01-01"
                    max={new Date().toISOString().split("T")[0]}
                    value={formData.dateFound} 
                    onChange={handleInputChange} 
                    onClick={(e) => e.target.showPicker?.()}
                    className="w-full p-5 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:bg-white transition-all pr-12 appearance-none date-input-field" 
                    required 
                  />
                  <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={24} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col gap-3">
                <label className="font-bold text-slate-700 text-lg">Brand</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="e.g. Nike" className="w-full p-5 rounded-2xl border border-slate-200 bg-slate-50 outline-none" />
              </div>
              <div className="flex flex-col gap-3">
                <label className="font-bold text-slate-700 text-lg text-left">Location <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="location"
                    value={formData.location} 
                    onChange={handleInputChange}
                    placeholder="Enter location or use map pin..." 
                    className="w-full p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white transition-all outline-none pr-12"
                    required 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowMap(true)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all cursor-pointer z-10"
                    title="Pick on map"
                  >
                    <MapPin size={24} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col gap-3">
                <ColorPicker 
                  value={formData.color} 
                  onChange={handleInputChange} 
                  label="Item Color"
                />
                {formData.color === "Other" && (
                  <input 
                    name="customColor"
                    type="text" 
                    placeholder="Please specify color..." 
                    className="mt-2 w-full p-5 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-4 focus:ring-red-50"
                    value={formData.customColor || ""}
                    onChange={handleInputChange}
                  />
                )}
              </div>
              <div className="flex flex-col gap-3">
                <label className="font-bold text-slate-700 text-lg">Photo (Optional)</label>
                <div className="relative">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="font-bold text-slate-700 text-lg">Additional Details</label>
              <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleInputChange} rows={4} className="w-full p-5 border border-slate-200 rounded-2xl outline-none bg-slate-50 focus:bg-white focus:ring-4 focus:ring-red-50 transition-all" placeholder="Any specific markings or content inside..." />
            </div>

            <div className="pt-10 border-t border-slate-100">
              <h3 className="text-3xl font-black text-slate-800 mb-8">Reporter's Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" name="reporterName" value={formData.reporterName} onChange={handleInputChange} placeholder="Your Name" className="w-full p-4 border border-slate-200 rounded-xl" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mobile <span className="text-red-500">*</span></label>
                  <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} placeholder="09XX-XXX-XXXX" className="w-full p-4 border border-slate-200 rounded-xl" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email <span className="text-red-500">*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="email@example.com" className="w-full p-4 border border-slate-200 rounded-xl" required />
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <button type="submit" disabled={isSubmitting} className="bg-[#02D44F] text-white font-black py-5 px-16 rounded-full shadow-xl hover:bg-[#02b844] hover:-translate-y-1 transition-all active:scale-95 uppercase tracking-widest text-lg">
                {isSubmitting ? "Submitting..." : "Submit Found Report"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* SECTION - Success Stories */}
      <section id="success-stories" className="w-full py-28 px-6 bg-gray-50/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900">Success Stories</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">Real people, real reunions, real impact. See how BALIK is making a difference.</p>
          </div>

          {story ? (
            <div className="relative bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100">
              <div className="w-24 h-24 mx-auto rounded-full bg-slate-100 mb-8 flex items-center justify-center border-4 border-[#FDF2F2]">
                 <Users className="text-[#7B1C1C]" size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-1">{story.name}</h3>
              <p className="text-slate-500 font-bold mb-4 uppercase tracking-widest text-xs">{story.role}</p>
              
              <div className="flex justify-center gap-1 mb-10">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < story.rating
                        ? "text-yellow-400 text-2xl"
                        : "text-slate-200 text-2xl"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>

              <p className="italic text-xl md:text-2xl text-slate-800 max-w-3xl mx-auto mb-12 leading-relaxed font-['Lora']">
                "{story.quote}"
              </p>

              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-green-50 text-green-700 font-bold text-sm mb-16 border border-green-100">
                <Check size={18} />
                Reunited: {story.reunitedItem}
              </div>

              <div className="flex justify-between items-center max-w-3xl mx-auto">
                <button
                  onClick={prevStory}
                  className="cursor-pointer w-14 h-14 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-[#7B1C1C] hover:bg-[#FDF2F2] transition-all group shadow-sm"
                >
                  <span className="text-3xl font-light group-hover:scale-125 transition-transform">‹</span>
                </button>
                
                <div className="flex gap-3">
                  {successStories.map((_, i) => (
                    <button
                      key={i}
                      className={`h-2 rounded-full transition-all duration-300 ${i === index
                        ? "w-10 bg-[#7B1C1C]"
                        : "w-2 bg-slate-200 hover:bg-slate-300"
                        }`}
                      onClick={() => setIndex(i)}
                    />
                  ))}
                </div>

                <button
                  onClick={nextStory}
                  className="cursor-pointer w-14 h-14 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-[#7B1C1C] hover:bg-[#FDF2F2] transition-all group shadow-sm"
                >
                  <span className="text-3xl font-light group-hover:scale-125 transition-transform">›</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-medium italic">Success stories will be shared by our community members soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION - FAQ */}
      <section className="py-24 bg-white" id="faq">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900">Frequently Asked Questions</h2>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search questions..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-red-50 outline-none transition-all"
              />
            </div>
          </div>
          <div className="space-y-4">
            {filteredFAQs.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-900">{faq.question}</span>
                  {openFaqIndex === i ? <ChevronUp size={20} className="text-[#7B1C1C]" /> : <ChevronDown size={20} className="text-slate-400" />}
                </button>
                {openFaqIndex === i && (
                  <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-40 bg-white text-center px-6">
        <h2 className="text-5xl md:text-6xl font-black mb-10 text-slate-900">Ready to help others?</h2>
        <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto font-medium">Join our community of students helping students. Every report matters.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-8">
          <Link to="/signup" className="bg-[#02D44F] text-white px-16 py-6 rounded-full font-bold text-xl hover:bg-[#02b844] shadow-lg hover:shadow-xl transition-all">Get Started</Link>
          <Link to="/login" className="border-2 border-[#02D44F] text-[#02D44F] px-16 py-6 rounded-full font-bold text-xl hover:bg-green-50 transition-all">Sign In</Link>
        </div>
      </section>

      {/* Success Modal */}
      {submitted.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-[3rem] max-w-lg w-full p-12 text-center shadow-2xl relative">
            <div className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center bg-green-500 shadow-lg shadow-green-200">
              <Check className="text-white" size={48} />
            </div>
            <h3 className="text-3xl font-black mb-4 text-slate-900">Thank You!</h3>
            <p className="text-slate-600 mb-10 text-lg leading-relaxed font-medium">Your report has been submitted. Our team will review it and notify you if a match is found.</p>
            <button onClick={() => setSubmitted({ show: false, mode: "found" })} className="w-full py-5 bg-[#B45309] text-white rounded-full font-bold uppercase tracking-widest hover:bg-[#92400e] transition-all shadow-lg">Great!</button>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-4xl h-[80vh] rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-8 border-b border-slate-100 bg-white z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <MapPin className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Select Location</h3>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Pin where the item was found</p>
                </div>
              </div>
              <button 
                onClick={() => setShowMap(false)}
                className="p-3 hover:bg-slate-100 rounded-2xl transition-all group"
              >
                <X size={24} className="text-slate-400 group-hover:rotate-90 transition-transform" />
              </button>
            </div>
            
            <div className="flex-1 p-8 overflow-hidden">
              <MapPicker 
                onSelect={(addr) => handleInputChange({ target: { name: 'location', value: addr } })}
                onClose={() => setShowMap(false)}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Home;