import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom";
import { valuableItemsCards, systemCards } from "./data/cards"
import { categories, foundItems } from "./data/recentlyFoundData"
import headerBg from "../assets/home-assets/bg-header.png"
import { whyBalikData } from "./data/whyBalikData"
import { topContributors } from "./data/topContributorsData"
import { successStories } from "./data/successStoriesData"
import { securityData } from "./data/securityData";
import { faqData } from "./data/faqData";
import { Search, ChevronDown, Users, UserPlus, LogIn } from "lucide-react";
import { joinFeaturesData } from "./data/joinFeaturesData";

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

  const [step, setStep] = useState(1)
  const formRef = useRef(null)
  const [formMode, setFormMode] = useState("found") // 'found' | 'lost'

  const nextStep = () => setStep((s) => Math.min(s + 1, 3))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  const [index, setIndex] = useState(0);
  const story = successStories[index];

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

  // Form state
  const [formData, setFormData] = useState({
    itemType: "",
    category: "",
    brand: "",
    color: "",
    customColor: "",
    dateFound: "",
    location: "",
    time: "",
    additionalInfo: "",
    whereTurned: "",
    anonymous: false,
    fullName: "",
    email: "",
    phone: "",
    phoneCountry: "+63",
    imageFile: null,
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [submitted, setSubmitted] = useState({ show: false, anonymous: false, mode: "found" })
  const [formAnimate, setFormAnimate] = useState(false)

  const filteredFAQs = faqData.filter((item) =>
    item.question.toLowerCase().includes(search.toLowerCase()) ||
    item.answer.toLowerCase().includes(search.toLowerCase())
  );

  const displayedFoundItems =
    activeCategory === "All Items"
      ? foundItems
      : foundItems.filter((it) => it.category === activeCategory)

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
    if (type === "checkbox") {
      // special handling for anonymous: clear contact fields when checked
      if (name === "anonymous") {
        setFormData((s) => ({ ...s, anonymous: checked }))
        setShowErrorsStep(null)
      } else {
        setFormData((s) => ({ ...s, [name]: checked }))
      }
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
    // validate final step
    if (!validateStep(3)) {
      setShowErrorsStep(3)
      alert("Please fill all required fields before submitting.")
      return
    }

    const fullPhone = formData.phone ? `${formData.phoneCountry} ${formData.phone}` : ""

    // Build FormData for file upload
    const fd = new FormData()
    fd.append('mode', formMode)
    Object.keys(formData).forEach((k) => {
      if (k === 'imageFile') {
        if (formData.imageFile) fd.append('imageFile', formData.imageFile)
      } else {
        fd.append(k, formData[k])
      }
    })
    fd.append('fullPhone', fullPhone)

    try {
      const res = await fetch('http://localhost/BALIK/balik-system/balik-app/backend/report.php', { method: 'POST', body: fd })
      const json = await res.json()
      if (res.ok && json.success) {
        setSubmitted({ show: true, anonymous: formData.anonymous, mode: formMode })
        // reset
        setFormData({
          itemType: "",
          category: "",
          brand: "",
          color: "",
          dateFound: "",
          location: "",
          time: "",
          additionalInfo: "",
          whereTurned: "",
          anonymous: false,
          fullName: "",
          email: "",
          phone: "",
          phoneCountry: "+63",
          imageFile: null,
        })
        setImagePreview(null)
        setStep(1)
      } else {
        alert('Submission failed: ' + (json.message || 'Server error'))
      }
    } catch (err) {
      alert('Submission failed: ' + err.message)
    }
  }


  function validateStep(s) {
    if (s === 1) {
      // Brand must be at least 2 characters, letters and spaces only (no numbers or random characters)
      const brandText = formData.brand.trim();
      const brandValid = brandText.length >= 2 && /^[A-Za-z\s]+$/.test(brandText);
      // Color validation: if Other is selected, customColor must be filled
      const colorValid = formData.color.trim() && (formData.color !== "Other" || formData.customColor.trim());
      return (
        formData.itemType.trim() &&
        formData.category.trim() &&
        brandValid &&
        colorValid
      )
    }

    if (s === 2) {
      return (
        formData.dateFound &&
        formData.location.trim() &&
        formData.time
      )
    }

    if (s === 3) {
      const meta = countryCodes.find((c) => c.code === formData.phoneCountry) || { minLength: 6 }
      const digits = (formData.phone || "").replace(/\D/g, "")
      const phoneOk = formData.anonymous ? true : (digits.length >= (meta.minLength || 6))

      const contactOk = formData.anonymous
        ? true
        : (formData.fullName.trim() && formData.email.trim() && phoneOk)

      return (
        formData.additionalInfo.trim() &&
        formData.whereTurned.trim() &&
        formData.imageFile &&
        contactOk
      )
    }

    return true
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
          <button type="button" onClick={handleHeaderReportLost} className="bg-[#E30000] text-white font-bold px-10 py-4 rounded-3xl shadow-lg border border-[#a11010] hover:bg-[#230000de] hover:shadow-2xl transition-all duration-300">
            Report Lost Item
          </button>

          <button type="button" onClick={handleHeaderReportFound} className="bg-[#02D44F] text-white font-bold px-10 py-4 rounded-3xl shadow-lg border border-[#2eb857] hover:bg-[#0e361a] hover:shadow-2xl transition-all duration-300">
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
        <div className="mb-12 p-4 text-xl rounded-2xl shadow-lg border border-[#a11010] hover:-translate-y-2 hover:shadow-xl transition-all duration-300 bg-white">
          73% of people lose valuable items monthly, spending 12+ hours
          searching
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mb-6">
          {valuableItemsCards.map((card) => (
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
          ))}
        </div>
      </section>

      {/* SECTION 2*/}
      <section className="flex flex-col p-12 items-center justify-center">
        <h2 className="text-3xl text-black font-extrabold mb-10 text-center">
          How Our System Works
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl px-5 mx-auto">
          {systemCards.map((card) => (
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
          ))}
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
        <div className="flex justify-center gap-3 mb-12">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${activeCategory === cat ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedFoundItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-56 object-cover"
                />

                <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                  ✓ Verified
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-1">
                  {item.title}
                </h3>

                <span className="inline-block bg-gray-100 text-xs px-2 py-1 rounded mb-2">
                  {item.tag}
                </span>

                <p className="text-sm text-gray-600 mb-4">
                  {item.description}
                </p>

                <div className="flex justify-between text-xs text-gray-500 mb-4">
                  <span>{item.location}</span>
                  <span>{item.date}</span>
                </div>

                <button onClick={() => setSelectedItem(item)} className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium">
                  View details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 relative mx-4">
            <button onClick={() => setSelectedItem(null)} className="absolute top-3 right-3 text-gray-600 text-2xl">×</button>

            <div className="grid md:grid-cols-2 gap-6">
              <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-64 object-cover rounded" />

              <div>
                <h3 className="text-2xl font-bold mb-2">{selectedItem.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{selectedItem.tag}</p>
                <p className="text-gray-700 mb-4">{selectedItem.description}</p>

                <div className="text-sm text-gray-500 mb-2"><strong>Location:</strong> {selectedItem.location}</div>
                <div className="text-sm text-gray-500 mb-2"><strong>Date:</strong> {selectedItem.date}</div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => { setSelectedItem(null); navigate("/login"); }} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded">Claim</button>
            </div>
          </div>
        </div>
      )}

      {/* Forms (Report) Section 4 */}
      <div className="min-h-screen flex justify-center px-4 py-16 bg-gray-50">
        <div className="w-full max-w-2xl bg-transparent">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-[2.8rem] text-black font-extrabold mb-2">{formMode === "found" ? "Report a Found Item" : "Report a Lost Item"}</h1>
            <p className="text-gray-500">
              {formMode === "found" ? "Help us reunite found items with their owners in just a few steps" : "Tell us about the item you lost so we can help locate it"}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium
                    ${step === num ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}
                  `}
                  >
                    {num}
                  </div>
                  {num !== 3 && <div className="w-10 h-1 bg-gray-200" />}
                </div>
              ))}
            </div>

            <span className="text-sm text-gray-500">
              Step {step} of 3
            </span>
          </div>

          {/* Form */}
          <form className="space-y-6" ref={formRef} onSubmit={handleSubmit}>

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="input-group">
                  <label className="font-medium">
                    {formMode === "found" ? "What type of item did you find" : "What type of item did you lose"} <span className="text-red-500">*</span>
                  </label>
                  <select name="itemType" value={formData.itemType} onChange={handleInputChange} className={`input ${showErrorsStep === 1 && !formData.itemType ? 'border-red-500' : ''}`}>
                    <option value="">Select item type</option>
                    <option value="Smartphone">Smartphone</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Wallet">Wallet</option>
                    <option value="Keys">Keys</option>
                    <option value="ID Card">ID Card</option>
                    <option value="Backpack">Backpack</option>
                    <option value="Handbag">Handbag</option>
                    <option value="Watch">Watch</option>
                    <option value="Jewelry">Jewelry</option>
                    <option value="Glasses">Glasses</option>
                    <option value="Headphones">Headphones</option>
                    <option value="Charger">Charger</option>
                    <option value="Book">Book</option>
                    <option value="Notebook">Notebook</option>
                    <option value="Umbrella">Umbrella</option>
                    <option value="Jacket">Jacket</option>
                    <option value="Water Bottle">Water Bottle</option>
                    <option value="USB Drive">USB Drive</option>
                    <option value="Calculator">Calculator</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="font-medium">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className={`input ${showErrorsStep === 1 && !formData.category ? 'border-red-500' : ''}`}>
                    <option value="">Select category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Bags">Bags</option>
                    <option value="Documents">Documents</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="input-group">
                    <label className="font-medium">
                      Brand <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      placeholder="Enter brand name"
                      className={`input ${showErrorsStep === 1 && (formData.brand.trim().length < 2 || !/^[A-Za-z\s]+$/.test(formData.brand.trim())) ? 'border-red-500' : ''}`}
                    />
                    {showErrorsStep === 1 && formData.brand.trim().length > 0 && (formData.brand.trim().length < 2 || !/^[A-Za-z\s]+$/.test(formData.brand.trim())) && (
                      <span className="text-red-500 text-xs">Brand must be at least 2 characters and contain only letters</span>
                    )}
                  </div>

                  <div className="input-group">
                    <label className="font-medium">
                      Color <span className="text-red-500">*</span>
                    </label>
                    <select name="color" value={formData.color} onChange={handleInputChange} className={`input ${showErrorsStep === 1 && !formData.color ? 'border-red-500' : ''}`}>
                      <option value="">Select color</option>
                      <option value="Black">Black</option>
                      <option value="White">White</option>
                      <option value="Red">Red</option>
                      <option value="Blue">Blue</option>
                      <option value="Green">Green</option>
                      <option value="Yellow">Yellow</option>
                      <option value="Orange">Orange</option>
                      <option value="Purple">Purple</option>
                      <option value="Pink">Pink</option>
                      <option value="Brown">Brown</option>
                      <option value="Gray">Gray</option>
                      <option value="Silver">Silver</option>
                      <option value="Gold">Gold</option>
                      <option value="Multicolor">Multicolor</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Custom color input when Other is selected */}
                  {formData.color === "Other" && (
                    <div className="input-group mt-4">
                      <label className="font-medium">
                        Specify Color <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="customColor"
                        value={formData.customColor}
                        onChange={handleInputChange}
                        placeholder="Enter the color"
                        className={`input ${showErrorsStep === 1 && formData.color === "Other" && !formData.customColor.trim() ? 'border-red-500' : ''}`}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="input-group">
                  <label className="font-medium">
                    {formMode === "found" ? "Date Found" : "Date Lost"} <span className="text-red-500">*</span>
                  </label>
                  <input name="dateFound" type="date" value={formData.dateFound} onChange={handleInputChange} onClick={(e) => e.target.showPicker?.()} className={`input cursor-pointer ${showErrorsStep === 2 && !formData.dateFound ? 'border-red-500' : ''}`} />
                </div>

                <div className="input-group">
                  <label className="font-medium">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <select name="location" value={formData.location} onChange={handleInputChange} className={`input ${showErrorsStep === 2 && !formData.location ? 'border-red-500' : ''}`}>
                    <option value="">Select location</option>
                    <option>Main Building</option>
                    <option>Library</option>
                    <option>ITECH</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="font-medium">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <input name="time" type="time" value={formData.time} onChange={handleInputChange} onClick={(e) => e.target.showPicker?.()} className={`input cursor-pointer ${showErrorsStep === 2 && !formData.time ? 'border-red-500' : ''}`} />
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="input-group">
                  <label className="font-medium">
                    Additional Information <span className="text-red-500">*</span>
                  </label>
                  <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleInputChange} className={`input h-28 resize-none ${showErrorsStep === 3 && !formData.additionalInfo ? 'border-red-500' : ''}`} />
                </div>

                <div className="input-group">
                  <label className="font-medium">
                    Upload Image <span className="text-red-500">*</span>
                  </label>
                  <input type="file" onChange={handleFileChange} className={`input ${showErrorsStep === 3 && !formData.imageFile ? 'border-red-500' : ''}`} />
                  {imagePreview && (
                    <img src={imagePreview} alt="preview" className="mt-3 w-40 h-40 object-cover rounded" />
                  )}
                </div>

                <div className="input-group">
                  <label className="font-medium">
                    {formMode === "found" ? "Where did you turn in the item?" : "Where did you lose the item?"} <span className="text-red-500">*</span>
                  </label>
                  <input name="whereTurned" value={formData.whereTurned} onChange={handleInputChange} className={`input ${showErrorsStep === 3 && !formData.whereTurned ? 'border-red-500' : ''}`} />
                </div>

                <div className="flex items-center gap-2">
                  <input name="anonymous" type="checkbox" checked={formData.anonymous} onChange={handleInputChange} />
                  <label className="text-red-600 font-medium">
                    Report Anonymously
                  </label>
                </div>

                <div className="input-group">
                  <label className="font-medium">
                    Full Name {formData.anonymous ? <span className="text-sm text-gray-500">(will be marked anonymous)</span> : <span className="text-red-500">*</span>}
                  </label>
                  <input name="fullName" value={formData.fullName} onChange={handleInputChange} className={`input ${showErrorsStep === 3 && !formData.fullName && !formData.anonymous ? 'border-red-500' : ''}`} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="input-group">
                    <label className="font-medium">
                      Email {formData.anonymous ? <span className="text-sm text-gray-500">(will be marked anonymous)</span> : <span className="text-red-500">*</span>}
                    </label>
                    <input name="email" value={formData.email} onChange={handleInputChange} className={`input ${showErrorsStep === 3 && !formData.email && !formData.anonymous ? 'border-red-500' : ''}`} />
                  </div>

                  <div className="input-group">
                    <label className="font-medium">
                      Phone Number {formData.anonymous ? <span className="text-sm text-gray-500">(will be marked anonymous)</span> : <span className="text-red-500">*</span>}
                    </label>
                    <div className={`flex items-center rounded-lg overflow-hidden ${showErrorsStep === 3 && !formData.phone && !formData.anonymous ? 'border border-red-500' : 'border border-gray-300'}`}>
                      <select
                        name="phoneCountry"
                        value={formData.phoneCountry}
                        onChange={handleInputChange}
                        className="bg-white px-3 py-2 text-sm outline-none appearance-none"
                      >
                        {countryCodes.map((c) => (
                          <option key={c.code + c.name} value={c.code}>{`${c.flag} ${c.code}`}</option>
                        ))}
                      </select>

                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={countryCodes.find(c => c.code === formData.phoneCountry)?.example || "9123456789"}
                        className="flex-1 px-3 py-2 text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium"
                >
                  Back
                </button>
              )}

              {step < 3 && (
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep(step)) {
                      setShowErrorsStep(null)
                      nextStep()
                    } else {
                      setShowErrorsStep(step)
                      // optional focus could be added here
                    }
                  }}
                  className={`flex-1 py-3 rounded-lg font-medium text-white ${validateStep(step) ? 'bg-green-500' : 'bg-green-500/60 cursor-not-allowed'}`}
                >
                  Continue
                </button>
              )}

              {step === 3 && (
                <button
                  type="submit"
                  className="flex-1 bg-green-500 text-white py-3 rounded-lg font-medium"
                >
                  Submit Report
                </button>
              )}
            </div>

          </form>
        </div>

        {/* Small utility styles */}
        <style>
          {`
          .input {
            width: 100%;
            padding: 12px 14px;
            border-radius: 10px;
            border: 1px solid #e5e7eb;
            outline: none;
          }
          .input:focus {
            border-color: #22c55e;
          }
          .input-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
        `}
        </style>
      </div>

      {submitted.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gradient-to-b from-yellow-100 to-yellow-50 rounded-xl max-w-lg w-full p-8 relative mx-4 shadow-xl">
            <button onClick={() => setSubmitted({ show: false, anonymous: false, mode: formMode })} className="absolute top-3 right-3 text-gray-600 text-2xl">×</button>

            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 rounded-full border-4 border-green-200 flex items-center justify-center bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879A1 1 0 003.293 9.293l4 4a1 1 0 001.414 0l8-8z" clipRule="evenodd" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-gray-900">
                {submitted.mode === "found" ? "Found Item Report Submitted" : "Lost Item Report Submitted"}
              </h3>

              <p className="text-gray-700 max-w-md">
                Thank you for providing your information. We have received your submission and our team is currently reviewing your report.
              </p>

              {submitted.anonymous && (
                <p className="text-gray-700 max-w-md">
                  As you reported anonymously, we want to assure you that your details will be kept secure and confidential.
                </p>
              )}

              <p className="text-gray-700 max-w-md">
                We appreciate you taking the time to report this item.
              </p>

              <div className="mt-4">
                <button onClick={() => setSubmitted({ show: false, anonymous: false, mode: formMode })} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium">OK</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5 */}
      <section className="w-full py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Header */}
          <h2 className="text-[2.8rem] text-black font-extrabold mb-2">
            Why Choose BALIK?
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-16">
            The most advanced lost and found platform powered by AI and community trust
          </p>

          {/* Grid inner section */}
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {whyBalikData.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center gap-4"
                >
                  <Icon className="w-10 h-10 text-blue-600" />

                  <h3 className="text-lg font-semibold">
                    {item.title}
                  </h3>

                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 6 */}
      <section className="w-full py-28 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          {/* Heading */}
          <h2 className="text-[2.8rem] text-black font-extrabold mb-3">
            Earn Rewards for Helping Others
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-16">
            Calculate your potential earnings and see top community contributors
          </p>

          {/* Card */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-2xl font-bold mb-6 text-left">
              Top Contributors
            </h3>

            <div className="flex flex-col gap-4">
              {topContributors.map((user) => (
                <div
                  key={user.rank}
                  className="
                  flex items-center justify-between
                  p-4 rounded-xl border border-gray-200
                  transition-all duration-300 ease-out
                  hover:-translate-y-2 hover:shadow-lg
                "
                >
                  {/* Left */}
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                      {user.rank}
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
                      {user.initials}
                    </div>

                    {/* Info */}
                    <div className="text-left">
                      <p className="font-medium leading-tight">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user.items} items reunited
                      </p>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <p className="text-blue-600 font-semibold">
                      {user.points.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      points
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 - success stories */}
      <section className="w-full py-25 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <h2 className="text-[2.8rem] text-black font-extrabold mb-2">
            Success Stories
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-16">
            Real people, real reunions, real impact
          </p>

          {/* Story */}
          <div className="relative">
            {/* Avatar placeholder */}
            <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 mb-6" />

            {/* Name */}
            <h3 className="text-xl font-semibold">
              {story.name}
            </h3>
            <p className="text-gray-500 mb-2">
              {story.role}
            </p>

            {/* Stars */}
            <div className="flex justify-center gap-1 mb-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={
                    i < story.rating
                      ? "text-yellow-400 text-lg"
                      : "text-gray-300 text-lg"
                  }
                >
                  ★
                </span>
              ))}
            </div>

            {/* Quote */}
            <p className="italic text-lg text-gray-800 max-w-3xl mx-auto mb-10 leading-relaxed">
              “{story.quote}”
            </p>

            {/* Reunited item */}
            <div className="flex justify-center items-center gap-2 text-blue-600 font-medium mb-14">
              <span className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center text-xs">
                ✓
              </span>
              Reunited: {story.reunitedItem}
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center max-w-3xl mx-auto">
              <button
                onClick={prevStory}
                className="
                w-20 h-20 flex items-center justify-center
                rounded-full
                text-3xl text-gray-400
                hover:text-gray-700 hover:bg-gray-100
                transition cursor-pointer"
              > ‹
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {successStories.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all ${i === index
                      ? "w-8 bg-blue-600"
                      : "w-2 bg-gray-300"
                      }`}
                  />
                ))}
              </div>

              <button
                onClick={nextStory}
                className="
                w-20 h-20 flex items-center justify-center
                rounded-full
                text-3xl text-gray-400
                hover:text-gray-700 hover:bg-gray-100
                transition cursor-pointer"
              > ›
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-[2.8rem] text-black font-extrabold mb-2">
            Your Security is Our Priority
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-16">
            Multiple layers of protection ensure safe and trustworthy reunions
          </p>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityData.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-8 text-left shadow-sm hover:shadow-lg transition"
                >
                  <Icon className="w-10 h-10 text-green-500 mb-6" />

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 9 - FAQ SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-[2.8rem] text-black font-extrabold mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-10">
              Everything you need to know about BALIK
            </p>
          </div>

          {/* Search */}
          <div className="relative mt-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* FAQ List */}
          <div className="mt-12 space-y-6">
            {filteredFAQs.length === 0 && (
              <p className="text-center text-gray-500">
                No matching questions found.
              </p>
            )}

            {filteredFAQs.map((item, index) => (
              <div
                key={index}
                className="border-b border-gray-300 pb-6 cursor-pointer"
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${openIndex === index ? "rotate-180" : ""
                      }`}
                  />
                </div>

                {openIndex === index && (
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10 */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 border rounded-full text-green-600 font-medium mb-6  hover:-translate-y-2 hover:shadow-xl transition-all duration-300 bg-white">
            <Users className="w-5 h-5" />
            Join 1,200+ new members this week
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Join the BALIK Community Today
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Be part of the movement reuniting people with their belongings
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              <UserPlus className="w-5 h-5" />
              Sign Up for Free
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition"
            >
              <LogIn className="w-5 h-5" />
              Login
            </Link>
          </div>

          {/* Features */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12">
            {joinFeaturesData.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index}>
                  <Icon className="w-7 h-7 mx-auto text-blue-600 mb-8" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-gray-500">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </main>
  );
}

export default Home;
