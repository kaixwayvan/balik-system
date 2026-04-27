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
import { Search, ChevronDown, Users, UserPlus, LogIn, X, Brain } from "lucide-react";
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
  const categories = ["Electronics", "ID & Documents", "Wallets & Bags", "Clothing & Accessories", "Personal Items", "Others"];
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

  const [step, setStep] = useState(1)
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

  // Placeholder navigation logic for legacy support if needed
  const nextStep = () => { }
  const prevStep = () => { }

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
  const [showErrorsStep, setShowErrorsStep] = useState(null)

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
  const [createdItemId, setCreatedItemId] = useState(null);



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
    setStep(1)
    // animate the form briefly, then scroll into view
    setFormAnimate(true)
    scrollToForm()
    setTimeout(() => setFormAnimate(false), 700)
  }

  function handleHeaderReportLost() {
    // Redirect to login page instead of showing the form
    navigate("/login")
  }

  function handleInputChange(e) {
    const { name, value, type, checked } = e.target

    // STRICT VALIDATION: Only allow letters and spaces for these fields
    const textOnlyFields = [
      "brand",
      "whatWasFound",
      "reporterName"
    ];

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
    // validate form
    if (!validateForm()) {
      // alert("Please fill all required fields before submitting.") // Replaced by success modal logic
      setSubmitted({ show: true, mode: 'found', isError: true, message: "Please fill all required fields before submitting." });
      return
    }

    // Allow non-logged-in users to submit (they will have user_id: null)
    setIsSubmitting(true)
    try {
      // 1. Upload image to Supabase Storage
      let imageUrl = null
      if (formData.imageFile) {
        imageUrl = await itemService.uploadItemImage(formData.imageFile)
      }

      // 2. Prepare data for Supabase
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
          },
          is_anonymous: false
        }
      }

      // 2.5 Only attach user_id if logged in
      if (user?.id) {
        mappedData.user_id = user.id;
      }

      // 3. Generate embedding for smart matching
      let currentEmbedding = null;
      try {
        const searchText = `${formData.itemCategory} ${formData.whatWasFound} ${formData.brand} ${formData.color} ${formData.location} ${formData.additionalInfo}`;
        currentEmbedding = await nlpService.generateEmbedding(searchText);
        if (currentEmbedding) {
          mappedData.description_embedding = currentEmbedding;
        }
      } catch (nlpError) {
        console.warn("Embedding generation failed:", nlpError);
      }

      // 4. Submit to Supabase Items table
      const createdItem = await itemService.reportItem(mappedData);
      setCreatedItemId(createdItem?.id || null);

      // 5. Smart Matching Phase
      setIsMatching(true);

      // Reset form immediately after successful DB submission
      const submittedFormData = { ...formData }; // Keep a copy for matching search
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

      if (currentEmbedding) {
        try {
          const matches = await itemService.getSmartMatches(
            currentEmbedding,
            'lost',
            0.5,
            4,
            {
              category: submittedFormData.itemCategory,
              color: submittedFormData.color,
              location: submittedFormData.location,
              date: submittedFormData.dateFound
            }
          );
          if (matches && matches.length > 0) {
            setMatchedItems(matches);
            setShowMatchModal(true);
            setIsMatching(false);

            // Refresh items list in background and ensure visibility
            const data = await itemService.getRecentItems('found', 6);
            setRecentSupabaseItems(data);
            setActiveCategory("All Items");
            return;
          }
        } catch (matchError) {
          console.error("Smart matching error:", matchError);
        }
      }
      setIsMatching(false);
      setSubmitted({
        show: true,
        mode: 'found',
        isError: false
      });

      // Refresh the local items list and reset filter to show new item
      const data = await itemService.getRecentItems('found', 6);
      setRecentSupabaseItems(data);
      setActiveCategory("All Items");

    } catch (err) {
      console.error("Submission Error:", err);
      setSubmitted({
        show: true,
        mode: 'found',
        isError: true,
        message: err.message || "Something went wrong. Please try again."
      });
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
        {/* Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#F5E6E6]/20 to-[#ffdac9]/90"></div>

        {/* Left Content */}
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

        {/* Right Content (Buttons) */}
        <div className="relative z-20 flex flex-col md:flex-row gap-4 items-center">
          <button type="button" onClick={handleHeaderReportLost} className="cursor-pointer bg-[#E30000] text-white font-bold w-60 py-4 rounded-3xl shadow-lg border border-[#a11010] hover:bg-[#b00000] hover:shadow-2xl transition-all duration-300">
            Report Lost Item
          </button>

          <button type="button" onClick={handleHeaderReportFound} className="cursor-pointer bg-[#02D44F] text-white font-bold w-60 py-4 rounded-3xl shadow-lg border border-[#2eb857] hover:bg-[#02b844] hover:shadow-2xl transition-all duration-300">
            Report Found Item
          </button>
        </div>
      </div>

      {/* SECTION 1*/}
      <section className="flex flex-col p-12 items-center justify-center bg-[#f7e6dc] shadow-[inset_0_1px_12px_rgba(0,0,0,0.12),_inset_0_-0.5px_12px_rgba(0,0,0,0.10)]">
        <h2 className="text-5xl font-extrabold mb-5 text-center">
          The Frustration of Losing Valuable Items
        </h2>

        <p className="mb-10 text-center max-w-2xl">
          Every day, thousands of people experience the stress and anxiety of
          losing important belongings.
        </p>

        {/* Stat Card */}
        <div className="mb-12 p-4 text-xl rounded-2xl shadow-lg border border-[#a11010] hover:shadow-xl transition-all duration-300 bg-white">
          73% of people lose valuable items monthly, spending 12+ hours
          searching
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mb-6">
          {valuableItemsCards.length > 0 ? (
            valuableItemsCards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 mb-4">
                  <img
                    src={card.icon}
                    alt={`${card.title} icon`}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-gray-500">No items found.</div>
          )}
        </div>
      </section>

      {/* SECTION 2*/}
      <section id="how-it-works" className="flex flex-col p-12 items-center justify-center">
        <h2 className="text-3xl text-black font-extrabold mb-10 text-center">
          How Our System Works
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl px-5 mx-auto">
          {systemCards.length > 0 ? (
            systemCards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-xl p-6 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                  <img
                    src={card.icon}
                    alt={`${card.title} icon`}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-4">{card.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-gray-500">System information coming soon.</div>
          )}
        </div>
      </section>

      <div className="w-250 h-px bg-gray-500 mt-2 mx-auto"></div>

      {/* SECTION 3*/}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-[2.8rem] text-black font-extrabold mb-2">
            Recently Found Items
          </h2>
          <p className="text-gray-500 text-lg">
            Admin-verified items waiting to be reunited with their owners
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {ALL_CATEGORIES.map((cat, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(cat)}
              className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${cat === activeCategory
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {itemsLoading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-gray-100">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-500 font-medium">Loading recently found items...</p>
            </div>
          ) : displayedFoundItems.length > 0 ? (
            displayedFoundItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={item.image_url || "https://images.unsplash.com/photo-1544391439-1dfdc422e178?auto=format&fit=crop&q=80&w=400"}
                    alt={item.title}
                    className="w-full h-56 object-cover bg-gray-100"
                  />
                  <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow-sm">
                    ✓ Verified
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-semibold text-lg mb-1 truncate">{item.title}</h3>
                  <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded mb-2 w-fit">
                    {item.category}
                  </span>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                  <div className="mt-auto">
                    <div className="flex justify-between text-xs text-gray-500 mb-4">
                      <span className="truncate max-w-[150px]">{item.location}</span>
                      <span>{new Date(item.date_found || item.date_reported).toLocaleDateString()}</span>
                    </div>
                    <button onClick={() => setSelectedItem(item)} className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      View details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-lg font-medium mb-2">No recently found items</p>
              <p className="text-gray-400 text-sm">Be the first to report a found item!</p>
            </div>
          )}
        </div>
      </section>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-0 relative shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <button
              onClick={() => setSelectedItem(null)}
              className="cursor-pointer absolute top-4 right-4 text-white bg-black/30 hover:bg-black/50 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10"
            >
              ×
            </button>

            <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-1/2">
                <img
                  src={selectedItem.image_url || "https://images.unsplash.com/photo-1544391439-1dfdc422e178?auto=format&fit=crop&q=80&w=400"}
                  alt={selectedItem.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>

              <div className="md:w-1/2 p-8 flex flex-col">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-medium uppercase tracking-wider">
                      {selectedItem.category}
                    </span>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-medium">
                      Admin Verified
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">{selectedItem.title}</h3>
                  <div className="space-y-3 text-gray-700 mb-6">
                    <div className="flex gap-2">
                      <span className="font-bold min-w-[80px]">Location:</span>
                      <span>{selectedItem.location}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold min-w-[80px]">Date:</span>
                      <span>{new Date(selectedItem.date_found || selectedItem.date_reported).toLocaleDateString()}</span>
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {selectedItem.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-3">
                  <button
                    onClick={() => { setSelectedItem(null); navigate("/login"); }}
                    className="cursor-pointer w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all"
                  >
                    Login to Claim Item
                  </button>
                  <p className="text-xs text-center text-gray-400">
                    You must be a registered member to claim items
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forms (Report) Section 4 */}
      <section className="min-h-screen py-24 bg-gray-50 flex justify-center px-4">
        <div className="w-full max-w-5xl" ref={formRef}>
          <div className="text-center mb-12">
            <h2 className="text-[2.8rem] text-black font-extrabold mb-3">Report Found Item</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Help your community by reporting items you've found on campus.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl space-y-10">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-[#7B1C1C] text-lg">Report Type <span className="text-red-500">*</span></label>
                  <input type="text" value="Found Item" readOnly className="w-full p-4 rounded-xl border border-slate-200 bg-slate-100 text-gray-700 font-semibold cursor-not-allowed outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-[#7B1C1C] text-lg">What was Found <span className="text-red-500">*</span></label>
                  <p className="text-[11px] text-gray-400 -mt-1 font-medium">(Pen, Jacket, Smartphone, Wallet, etc.)</p>
                  <input type="text" name="whatWasFound" value={formData.whatWasFound} onChange={handleInputChange} placeholder="Enter item name" className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-100 transition-all outline-none" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-[#7B1C1C] text-lg">Item Category <span className="text-red-500">*</span></label>
                  <select name="itemCategory" value={formData.itemCategory} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-100 transition-all outline-none" required>
                    <option value="">Select category</option>
                    {ALL_CATEGORIES.filter(c => c !== "All Items").map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-[#7B1C1C] text-lg">Date Found <span className="text-red-500">*</span></label>
                  <p className="text-[11px] text-gray-400 -mt-1 font-medium">Approximate date of when the item was found.</p>
                  <input 
                    type="date" 
                    name="dateFound" 
                    value={formData.dateFound} 
                    onChange={handleInputChange} 
                    min="2025-01-01"
                    max={new Date().toISOString().split("T")[0]} 
                    className="date-input-visible w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-100 transition-all outline-none" 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-[#7B1C1C] text-lg">Brand</label>
                  <p className="text-[11px] text-gray-400 -mt-1 font-medium invisible">Placeholder</p>
                  <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="e.g. Samsung" className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-100 transition-all outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-[#7B1C1C] text-lg">Color</label>
                  <p className="text-[11px] text-gray-400 -mt-1 font-medium invisible">Placeholder</p>
                  <select name="color" value={formData.color} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-100 transition-all outline-none">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-[#7B1C1C] text-lg">Location <span className="text-red-500">*</span></label>
                  <p className="text-[11px] text-gray-400 -mt-1 font-medium">Specific area where the item was found.</p>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g. Library" className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-100 transition-all outline-none" required />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-[#7B1C1C] text-lg">Photo (Optional)</label>
                  <p className="text-[11px] text-gray-400 -mt-1 font-medium">Upload a clear photo of the found item.</p>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer bg-red-50 hover:bg-red-100 text-red-700 px-6 py-[0.9rem] rounded-xl text-sm border-2 border-dashed border-red-200 transition-all flex-1 text-center font-bold">
                      {formData.imageFile ? formData.imageFile.name : "Choose Image File"}
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                    {imagePreview && (
                      <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-[#7B1C1C] text-lg">Additional Information</label>
                <p className="text-[11px] text-gray-400 -mt-1 font-medium">Any identifying marks or features?</p>
                <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleInputChange} rows={3} className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-100 transition-all outline-none resize-none" placeholder="Provide more details..." />
              </div>

              <div className="pt-8 border-t border-slate-100 flex flex-col items-center">
                <div className="w-full">
                  <h3 className="text-2xl font-extrabold text-[#7B1C1C] mb-8 flex items-center gap-3 text-left">
                    <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm">2</span>
                    Reporter's Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-2">
                      <label className="font-bold text-[#7B1C1C] text-lg text-left">Name <span className="text-red-500">*</span></label>
                      <input type="text" name="reporterName" value={formData.reporterName} onChange={handleInputChange} placeholder="Full Name" className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-100 transition-all outline-none" required />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-bold text-[#7B1C1C] text-lg text-left">Mobile Number <span className="text-red-500">*</span></label>
                      <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} placeholder="e.g. 09123456789" className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-100 transition-all outline-none" required />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-bold text-[#7B1C1C] text-lg text-left">Email <span className="text-red-500">*</span></label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="your@email.com" className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-100 transition-all outline-none" required />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting || isMatching}
                    className={`w-full max-w-xs bg-[#00C853] hover:bg-[#00ad48] text-white font-bold text-lg py-4 px-10 rounded-2xl shadow-xl shadow-green-100/50 transition-all active:scale-[0.98] flex items-center justify-center gap-3
                      ${(isSubmitting || isMatching) ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : isMatching ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Finding Matches...
                      </div>
                    ) : (
                      "Submit Report"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Success Modal */}
      {submitted.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#FFF9E1] rounded-[2.5rem] max-w-lg w-full p-10 relative mx-4 shadow-2xl border border-yellow-100/50 animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setSubmitted({ show: false, mode: formMode })}
              className="cursor-pointer absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors bg-white/50 w-10 h-10 rounded-full flex items-center justify-center"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className={`w-24 h-24 rounded-full border-[6px] ${submitted.isError ? 'border-red-500/20' : 'border-green-500/20'} flex items-center justify-center bg-white mb-6`}>
                <div className={`w-16 h-16 rounded-full ${submitted.isError ? 'bg-red-500' : 'bg-green-500'} flex items-center justify-center shadow-sm`}>
                  {submitted.isError ? (
                    <X className="h-10 w-10 text-white" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879A1 1 0 003.293 9.293l4 4a1 1 0 001.414 0l8-8z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>

              <h3 className={`text-3xl font-black ${submitted.isError ? 'text-red-600' : 'text-[#374151]'} mb-6 leading-tight`}>
                {submitted.isError ? 'Submission Failed' : 'Report Submitted Successfully'}
              </h3>

              <div className="space-y-1 text-[#4B5563] text-[1.05rem] leading-relaxed mb-8 font-medium">
                {submitted.isError ? (
                  <p>{submitted.message || "An unexpected error occurred while submitting your report."}</p>
                ) : (
                  <>
                    <p>Thank you for providing your information.</p>
                    <p>No immediate matches were found, but our AI is now constantly monitoring new reports for you.</p>
                    <p>We'll notify you the moment a potential match appears!</p>

                    <div className="mt-8 bg-white/50 p-6 rounded-[2rem] border border-yellow-200/50 shadow-sm">
                      <p className="mb-2">Your report is now live in the <span className="font-bold text-blue-600">Recently Found Items</span> section.</p>
                      {user ? (
                        <p>It's also been added to your <span className="font-bold text-[#7B1C1C]">Dashboard</span> for easy tracking.</p>
                      ) : (
                        <p className="text-sm italic">Tip: <Link to="/login" className="text-blue-600 font-bold hover:underline">Log in</Link> so you can manage this report from your personal dashboard.</p>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <button
                  onClick={() => setSubmitted({ show: false, mode: formMode })}
                  className="cursor-pointer flex-1 max-w-[200px] bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-600 py-4 rounded-2xl font-black transition-all active:scale-[0.98] text-lg"
                >
                  {submitted.isError ? 'TRY AGAIN' : 'OK'}
                </button>
                {user && (
                  <button
                    onClick={() => navigate("/dashboard/found")}
                    className="cursor-pointer flex-1 max-w-[200px] bg-[#1D4ED8] hover:bg-[#1E40AF] text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] text-lg"
                  >
                    GO TO DASHBOARD
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Smart Match Modal */}
      {showMatchModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] max-w-4xl w-full max-h-[90vh] overflow-hidden relative mx-4 shadow-2xl border border-blue-100 animate-in zoom-in-95 duration-300 flex flex-col">

            <div className="p-10 pb-6 text-center border-b border-slate-50 relative">
              <button
                onClick={() => setShowMatchModal(false)}
                className="cursor-pointer absolute top-8 right-10 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={32} />
              </button>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full font-black text-sm uppercase tracking-widest mb-4 animate-pulse">
                <Brain size={18} className="animate-bounce" />
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
                      <p className="text-slate-500 text-sm font-medium mb-4 line-clamp-2">
                        {item.description}
                      </p>
                      <button
                        onClick={() => { setShowMatchModal(false); setSelectedItem(item); }}
                        className="cursor-pointer w-full py-3 bg-slate-900 text-white rounded-xl font-black text-sm hover:bg-blue-600 transition-all active:scale-[0.98]"
                      >
                        VIEW DETAILS
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-white border-t border-slate-50 text-center">
              <button
                onClick={() => setShowMatchModal(false)}
                className="cursor-pointer text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase tracking-widest text-sm"
              >
                None of these match my report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5 - Why Choose BALIK */}
      <section className="w-full py-28 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-[3.2rem] text-black font-black mb-4 tracking-tight">Why Choose BALIK?</h2>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto mb-20 font-medium">
            The most advanced lost and found platform powered by AI and community trust.
          </p>

          <div className="grid gap-12 md:grid-cols-3">
            {whyBalikData.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex flex-col items-center p-8 rounded-[2.5rem] bg-slate-50 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                  <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-8 group-hover:scale-110 transition-transform">
                    <Icon size={40} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black mb-4">{item.title}</h3>
                  <p className="text-gray-500 text-lg leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 6 - Top Contributors */}
      <section className="w-full py-28 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-[3.2rem] text-black font-black mb-4 tracking-tight">Community Heroes</h2>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto mb-20 font-medium">
            Celebrating those who make reunions possible.
          </p>

          <div className="bg-white rounded-[3rem] shadow-2xl p-10 border border-slate-100">
            <div className="flex flex-col gap-6">
              {topContributors.map((user) => (
                <div key={user.rank} className="flex items-center justify-between p-6 rounded-3xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-blue-600 text-white text-xl font-black">
                      #{user.rank}
                    </div>
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xl border-4 border-white shadow-sm">
                      {user.initials}
                    </div>
                    <div className="text-left">
                      <p className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{user.name}</p>
                      <p className="text-slate-500 font-bold">{user.items} ITEMS RETURNED</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-blue-600">{user.points.toLocaleString()}</p>
                    <p className="text-sm font-bold text-slate-400">POINTS</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 - Success Stories */}
      <section id="success-stories" className="w-full py-28 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[3.2rem] text-black font-black mb-4 tracking-tight">Success Stories</h2>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto mb-20 font-medium">
            Real people, real reunions, real impact.
          </p>

          {story ? (
            <div className="relative bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-blue-600 text-white flex items-center justify-center text-4xl font-black mb-8 shadow-lg">
                {story.name.charAt(0)}
              </div>
              <h3 className="text-2xl font-black mb-1 uppercase tracking-tight">{story.name}</h3>
              <p className="text-blue-600 font-bold mb-6">{story.role}</p>

              <p className="italic text-2xl text-slate-700 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
                "{story.quote}"
              </p>

              <div className="flex justify-center items-center gap-3 text-green-600 font-black mb-12 bg-green-50 py-3 px-6 rounded-2xl inline-flex text-lg">
                <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
                REUNITED: {story.reunitedItem}
              </div>

              <div className="flex justify-between items-center max-w-lg mx-auto">
                <button onClick={prevStory} className="cursor-pointer w-16 h-16 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white transition-all text-2xl font-black">‹</button>
                <div className="flex gap-3">
                  {successStories.map((_, i) => (
                    <div
                      key={i}
                      className={`h-3 rounded-full transition-all cursor-pointer ${i === index ? "w-10 bg-blue-600" : "w-3 bg-slate-200 hover:bg-slate-300"}`}
                      onClick={() => setIndex(i)}
                    />
                  ))}
                </div>
                <button onClick={nextStory} className="cursor-pointer w-16 h-16 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white transition-all text-2xl font-black">›</button>
              </div>
            </div>
          ) : (
            <div className="py-20 bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
              <p className="text-slate-400 font-bold text-xl uppercase tracking-widest">Stories coming soon</p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 8 - Security */}
      <section className="py-28 bg-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-[3.2rem] text-black font-black mb-4 tracking-tight">Your Security is Our Priority</h2>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto mb-20 font-medium">Multiple layers of protection ensure safe and trustworthy reunions.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {securityData.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 text-left hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                  <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 mb-8 group-hover:scale-110 transition-transform">
                    <Icon size={32} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h3>
                  <p className="text-slate-500 text-lg leading-relaxed font-medium">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 9 - FAQ */}
      <section id="faq" className="py-28 bg-slate-50 whitespace-pre-wrap">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-[3.2rem] text-black font-black mb-4 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-gray-500 text-xl max-w-2xl mx-auto font-medium">Everything you need to know about the BALIK platform.</p>
          </div>

          <div className="relative mb-16">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border-2 border-slate-100 rounded-3xl pl-16 pr-8 py-6 text-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all font-medium placeholder:text-slate-300 shadow-sm"
            />
          </div>

          <div className="space-y-6">
            {filteredFAQs.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-10 py-8 flex items-center justify-between text-left group"
                >
                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                    {item.question}
                  </h3>
                  <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center transition-transform duration-300 ${openIndex === index ? "rotate-180 bg-blue-600 text-white" : "text-slate-400"}`}>
                    <ChevronDown size={24} />
                  </div>
                </button>
                <div className={`transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="px-10 pb-10">
                    <p className="text-lg text-slate-500 font-medium leading-relaxed border-t border-slate-50 pt-8">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10 - Footer CTA */}
      <section className="py-32 bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full -mr-64 -mt-64 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-50 rounded-full -ml-64 -mb-64 blur-3xl opacity-50"></div>

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-50 text-green-700 font-black rounded-full mb-10 border border-green-100 animate-bounce">
            <Users size={24} />
            Join 1,200+ members today
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter">
            Ready to help others?
          </h2>
          <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-16 font-medium leading-relaxed">
            Be part of the movement reuniting people with their belongings.
            Join our growing community today.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/signup" className="group relative inline-flex items-center justify-center gap-3 bg-blue-600 text-white px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-200 transition-all active:scale-95 overflow-hidden">
              <span className="relative z-10 flex items-center gap-3">
                <UserPlus size={24} />
                Get Started Now
              </span>
            </Link>

            <Link to="/login" className="inline-flex items-center justify-center gap-3 border-4 border-slate-100 text-slate-900 px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95">
              <LogIn size={24} />
              Sign In
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

export default Home;
