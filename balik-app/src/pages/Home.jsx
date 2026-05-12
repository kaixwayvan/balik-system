import { useState } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { motion } from "framer-motion";
import { valuableItemsCards, systemCards } from "./data/cards";
import { categories, foundItems } from "./data/recentlyFoundData";
import bgLanding from "../assets/home-assets/bg-landing.mp4";
import { whyBalikData } from "./data/whyBalikData";
import { topContributors } from "./data/topContributorsData";
import { successStories } from "./data/successStoriesData";
import { securityData } from "./data/securityData";
import { faqData } from "./data/faqData";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Users,
  UserPlus,
  LogIn,
  MapPin,
  X,
} from "lucide-react";
import { joinFeaturesData } from "./data/joinFeaturesData";
import ColorPicker from "../shared/components/ColorPicker";
import MapPicker from "../shared/components/MapPicker";

function Home() {
  const [formData, setFormData] = useState({
    whatWasFound: "",
    itemCategory: "",
    dateFound: "",
    brand: "",
    color: "",
    customColor: "",
    location: "",
    additionalInfo: "",
    reporterName: "",
    reporterMobile: "",
    reporterEmail: "",
    photo: null,
  });

  const [step, setStep] = useState(1);

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const [index, setIndex] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");

  const story = successStories[index];

  const prevStory = () => {
    setIndex((prev) => (prev === 0 ? successStories.length - 1 : prev - 1));
  };

  const nextStory = () => {
    setIndex((prev) => (prev === successStories.length - 1 ? 0 : prev + 1));
  };

  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const filteredFAQs = faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase()),
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      photo: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Report submitted successfully!");
  };

  const handleColorChange = (selectedColor) => {
    setFormData((prev) => ({ ...prev, color: selectedColor }));
  };

  return (
    <main className="overflow-x-hidden" id="home">
      {" "}
      {/* HEADER */}
      <div className="relative w-full min-h-[500px] md:h-[650px] lg:h-[450px] flex flex-col md:flex-row items-center justify-between gap-6 px-6 md:px-24 pt-32 md:pt-24 text-white overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={bgLanding} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#F7E3CD]/50 to-[#ffdac9]/10"></div>

        {/* Left Content */}
        <div className="relative z-20 flex flex-col justify-center w-full max-w-full lg:max-w-3xl font-['Plus_Jakarta_Sans'] text-center md:text-left pt-5 sm:pt-15 md:pb-15 lg:pt-15 lg:pt-0">
          <h2 className="leading-tight text-3xl sm:text-4xl md:text-5xl mb-4 text-[#520000] font-extrabold break-words">
            Lost Something On Campus? <br className="hidden md:block" />
            Let’s Help You Find It.
          </h2>

          <p className="text-sm sm:text-base md:text-sm font-bold font-['Lora'] mb-6 text-[#331e0c] max-w-prose mx-auto md:mx-0">
            Looked everywhere on campus? Don’t stress!{" "}
            <br className="hidden sm:block" />
            Report, search, or claim lost items in minutes.{" "}
            <br className="hidden sm:block" />
            BALIK helps you reconnect with what matters.
          </p>
        </div>

        {/* Right Content (Buttons) */}
        <div className="items-center justify-center relative z-20 flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4 pb-34 md:pb-0 w-full lg:w-auto">
          <motion.div
            className="w-full sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Link
              to="/login"
              className="block text-center whitespace-nowrap cursor-pointer md:-translate-y-2 lg:-translate-y-12 md:translate-x-0 lg:translate-x-5 bg-[#E30000] text-white text-base md:text-sm lg:text-lg font-bold px-10 lg:px-15 py-4 rounded-full shadow-lg border border-[#a11010] hover:bg-[#230000de] hover:shadow-2xl transition-all duration-300 w-full"
            >
              Report Lost Item
            </Link>
          </motion.div>

          <motion.div
            className="w-full sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <HashLink
              smooth
              to="/#report"
              className="block text-center whitespace-nowrap cursor-pointer md:translate-y-2 lg:translate-y-10 md:translate-x-0 lg:-translate-x-10 bg-[#02D44F] text-white text-base md:text-lg font-bold px-10 lg:px-15 py-4 rounded-full shadow-lg border border-[#2eb857] hover:bg-[#0e361a] hover:shadow-2xl transition-all duration-300 w-full"
            >
              Report Found Item
            </HashLink>
          </motion.div>
        </div>
      </div>
      {/* SECTION 1*/}
      <section className="flex flex-col p-16 md:p-16 items-center justify-center bg-[#f7e6dc] shadow-[inset_0_1px_12px_rgba(0,0,0,0.12),_inset_0_-0.5px_12px_rgba(0,0,0,0.10)]">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-5 text-center leading-tight">
          The Frustration of Losing Valuable Items
        </h2>

        <p className="mb-10 text-center max-w-4xl text-sm md:text-base">
          Every day, thousands of people experience the stress and anxiety of
          losing important belongings.
        </p>

        {/* Stat Card */}
        <div className="mb-12 px-6 py-4 md:p-6 text-lg md:text-xl rounded-full shadow-lg border border-[#a11010] hover:-translate-y-2 hover:shadow-xl animate-bounce transition-all duration-300 bg-white text-center">
          73% of people lose valuable items monthly, spending 12+ hours
          searching
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mb-6">
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
      <section
        className="flex flex-col p-8 md:p-12 items-center justify-center"
        id="how-it-works"
      >
        <h2 className="text-2xl md:text-3xl text-black font-extrabold mb-10 text-center pt-5">
          How Our System Works
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl px-4 md:px-5 mx-auto">
          {systemCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-xl p-6 flex flex-col items-center text-center md:border-none"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <img
                  src={card.icon}
                  alt={`${card.title} icon`}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <h3 className="text-xl font-bold mb-4">{card.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>
      <div className="w-full max-w-4xl h-px bg-gray-200 md:bg-gray-300 mt-2 mx-auto"></div>
      {/* SECTION 3 - Recently Found Items */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-[2.8rem] text-black font-extrabold mb-2 leading-tight">
            Recently Found Items
          </h2>
          <p className="text-gray-500 text-base md:text-lg">
            Admin-verified items waiting to be reunited with their owners
          </p>
        </div>

        <div className="flex justify-start md:justify-center items-center overflow-x-auto gap-3 mb-12 pb-2 no-scrollbar">
          {categories.map((cat, index) => (
            <button
              key={index}
              className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-lg text-sm font-medium
              ${
                cat === "All Items"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-8">
          {foundItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 md:h-56 object-cover"
                />
                <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                  ✓ Verified
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                <span className="inline-block bg-gray-100 text-xs px-2 py-1 rounded mb-2">
                  {item.tag}
                </span>
                <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                <div className="flex justify-between text-xs text-gray-500 mb-4">
                  <span>{item.location}</span>
                  <span>{item.date}</span>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium">
                  View details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* SECTION 4 - Report Form */}
      <section
        className="py-20 md:py-28 bg-gray-50 flex justify-center px-4"
        id="report"
      >
        <div className="w-full max-w-5xl px-6 sm:px-16 md:px-0 lg:px-0">
          <div className="flex-1 flex flex-col items-center justify-center text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-5xl text-black font-extrabold mb-4">
              Report Found Item
            </h2>
            <p className="mx-auto max-w-[90%] md:max-w-2xl lg:max-w-4xl text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed">
              Help your community by reporting items you've found on campus.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-slate-200 shadow-2xl space-y-8 md:space-y-10"
          >
            {/* Row 1: Type & Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div className="flex flex-col gap-3">
                <label className="font-bold text-slate-700 text-lg">
                  Report Type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value="Found Item"
                  readOnly
                  className="w-full p-4 md:p-5 rounded-2xl border border-slate-200 bg-slate-100 font-bold text-slate-600 outline-none"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="font-bold text-slate-700 text-lg">
                  What was Found <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="whatWasFound"
                  value={formData.whatWasFound}
                  onChange={handleInputChange}
                  placeholder="e.g. Blue Backpack"
                  className="w-full p-4 md:p-5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-red-50 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Row 2: Category & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div className="flex flex-col gap-3">
                <label className="font-bold text-slate-700 text-lg">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="itemCategory"
                  value={formData.itemCategory}
                  onChange={handleInputChange}
                  className="w-full p-4 md:p-5 rounded-2xl border border-slate-200 bg-slate-50 outline-none"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Bags">Bags</option>
                </select>
              </div>
              <div className="flex flex-col gap-3">
                <label className="font-bold text-slate-700 text-lg">
                  Date Found <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateFound"
                  value={formData.dateFound}
                  onChange={handleInputChange}
                  className="w-full p-4 md:p-5 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Row 3: Brand & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div className="flex flex-col gap-3">
                <label className="font-bold text-slate-700 text-lg">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="e.g. Nike"
                  className="w-full p-4 md:p-5 rounded-2xl border border-slate-200 bg-slate-50 outline-none"
                />
              </div>
              <div className="flex flex-col gap-3 relative">
                <label className="font-bold text-slate-700 text-lg">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={selectedLocation}
                  readOnly
                  onClick={() => setShowMap(true)}
                  placeholder="Click to select on map..."
                  className="w-full p-4 md:p-5 rounded-2xl border border-slate-200 bg-slate-50 outline-none cursor-pointer focus:ring-4 focus:ring-blue-50"
                  required
                />
                <MapPin
                  className="absolute right-4 bottom-5 text-slate-400 pointer-events-none"
                  size={20}
                />
              </div>
            </div>

            {/* Row 4: ColorPicker & Photo (Your requested layout) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col gap-3">
                <ColorPicker
                  value={formData.color}
                  onChange={handleInputChange}
                  label="Item Color"
                />
                {formData.color === "Other" && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <input
                      name="customColor"
                      type="text"
                      placeholder="Please specify color..."
                      className="w-full p-5 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-4 focus:ring-red-50 transition-all shadow-sm"
                      value={formData.customColor || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <label className="font-bold text-slate-700 text-lg">
                  Photo (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 cursor-pointer"
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="flex flex-col gap-3">
              <label className="font-bold text-slate-700 text-lg">
                Additional Details
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                rows={2}
                className="w-full p-4 md:p-5 border border-slate-200 rounded-2xl outline-none bg-slate-50 focus:bg-white focus:ring-4 focus:ring-red-50 transition-all"
                placeholder="Any specific markings..."
              />
            </div>

            {/* Contact Section */}
            <div className="pt-8 md:pt-10 border-t border-slate-100">
              <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-6 md:mb-8">
                Reporter's Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="reporterName"
                    value={formData.reporterName}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    className="w-full p-4 border border-slate-200 rounded-xl outline-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Mobile <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="reporterMobile"
                    value={formData.reporterMobile}
                    onChange={handleInputChange}
                    placeholder="09XX-XXX-XXXX"
                    className="w-full p-4 border border-slate-200 rounded-xl outline-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="reporterEmail"
                    value={formData.reporterEmail}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    className="w-full p-4 border border-slate-200 rounded-xl outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-6 md:pt-8">
              <button
                type="submit"
                className="w-full md:w-auto bg-[#02D44F] text-white font-black py-4 md:py-5 px-8 md:px-16 rounded-full shadow-xl hover:bg-[#02b844] hover:-translate-y-1 transition-all active:scale-95 uppercase tracking-widest text-base md:text-lg"
              >
                Submit Found Report
              </button>
            </div>
          </form>
        </div>
      </section>
      {/* SECTION 5 - Why BALIK */}
      <section className="w-full py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-[2.8rem] text-black font-extrabold mb-2 leading-tight">
            Why Choose BALIK?
          </h2>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto mb-12 md:mb-16">
            The most advanced lost and found platform powered by AI and
            community trust
          </p>
          <div className="grid gap-10 md:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {whyBalikData.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center gap-4 p-4"
                >
                  <Icon className="w-10 h-10 text-blue-600" />
                  <h3 className="text-lg font-extrabold">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* SECTION 6 - Rewards */}
      <section className="w-full py-16 md:py-28 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-[2.8rem] text-black font-extrabold mb-3 leading-tight">
            Earn Rewards for Helping Others
          </h2>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto mb-12 md:mb-16">
            Calculate your potential earnings and see top community contributors
          </p>
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-5 md:p-6 border border-gray-100">
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-left">
              Top Contributors
            </h3>
            <div className="flex flex-col gap-4">
              {topContributors.map((user) => (
                <div
                  key={user.rank}
                  className="flex flex-wrap sm:flex-nowrap items-center justify-between p-4 rounded-xl border border-gray-100 transition-all hover:shadow-md gap-3"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-xs md:text-base">
                      {user.rank}
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-xs md:text-base">
                      {user.initials}
                    </div>
                    <div className="text-left">
                      <p className="font-medium leading-tight text-sm md:text-base">
                        {user.name}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500">
                        {user.items} items reunited
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-auto sm:ml-0">
                    <p className="text-blue-600 font-semibold text-sm md:text-base">
                      {user.points.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* SECTION 7 - Success Stories */}
      <section className="w-full py-16 md:py-25 px-6" id="success-stories">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-[2.8rem] text-black font-extrabold mb-2 leading-tight">
            Success Stories
          </h2>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto mb-12 md:mb-16">
            Real people, real reunions, real impact
          </p>
          <div className="relative px-2">
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full bg-gray-200 mb-6" />
            <h3 className="text-lg md:text-xl font-semibold">{story.name}</h3>
            <p className="text-sm md:text-gray-500 mb-2">{story.role}</p>
            <div className="flex justify-center gap-1 mb-6 md:mb-8">
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
            <p className="italic text-base md:text-lg text-gray-800 max-w-3xl mx-auto mb-8 md:mb-10 leading-relaxed px-4">
              “{story.quote}”
            </p>
            <div className="flex justify-center items-center gap-2 text-blue-600 font-medium mb-10 md:mb-14 text-sm md:text-base">
              <span className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center text-[10px]">
                ✓
              </span>
              Reunited: {story.reunitedItem}
            </div>
            <div className="flex justify-between items-center max-w-3xl mx-auto">
              <button
                onClick={prevStory}
                className="w-20 h-20 md:w-20 md:h-20 flex items-center justify-center rounded-full text-2xl text-gray-400 hover:bg-gray-200 transition cursor-pointer"
              >
                <ChevronLeft />
              </button>
              <div className="flex gap-2">
                {successStories.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 md:h-2 rounded-full transition-all ${i === index ? "w-6 md:w-8 bg-blue-600" : "w-1.5 md:w-2 bg-gray-300"}`}
                  />
                ))}
              </div>
              <button
                onClick={nextStory}
                className="w-20 h-20 md:w-20 md:h-20 flex items-center justify-center rounded-full text-2xl text-gray-400 hover:bg-gray-200 transition cursor-pointer"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* SECTION 8 - Security */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-[2.8rem] text-black font-extrabold mb-2 leading-tight">
            Your Security is Our Priority
          </h2>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto mb-12 md:mb-16">
            Multiple layers of protection ensure safe and trustworthy reunions
          </p>
          <div className="mt-8 md:mt-14 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {securityData.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white bg-slate-50 border border-slate-100 rounded-[1.5rem] p-10 text-left shadow-sm hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
                >
                  <Icon
                    size={35}
                    className="md:w-10 p-1 md:h-10 text-green-500 mb-4 md:mb-6 bg-green-50 rounded-2xl group-hover:scale-110
                    transition-transform"
                  />
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* SECTION 9 - FAQ */}
      <section className="py-16 md:py-24 bg-white" id="faqs">
        <div className="relative w-full max-w-4xl mx-auto px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-2 text-slate-900 leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto mb-10 md:mb-13">
              Everything you need to know about the BALIK platform.
            </p>
            <div className="relative max-w-4xl mx-auto">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-5 rounded-xl md:rounded-2xl border border-gray-200 shadow-md text-lg md:text-base outline-none focus:ring-2 focus:ring-green-100 transition-all"
              />
            </div>
          </div>
          <div className="space-y-8">
            {filteredFAQs.map((faq, i) => (
              <div
                key={i}
                className="bg-slate-100 rounded-xl md:rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 ease-in-out"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  className="w-full px-5 py-6 md:px-8 md:py-7 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group"
                >
                  <span className="font-bold text-slate-900 text-xl md:text-xl group-hover:text-blue-600 transition-colors tracking-tight">
                    {faq.question}
                  </span>
                  {openFaqIndex === i ? (
                    <ChevronUp
                      size={18}
                      className="cursor-pointer text-[#7B1C1C]"
                    />
                  ) : (
                    <ChevronDown
                      size={18}
                      className="cursor-pointer text-slate-400"
                    />
                  )}
                </button>
                {openFaqIndex === i && (
                  <div className="px-5 pb-5 md:px-6 md:pt-6 md:pb-6 text-slate-600 text-sm md:text-base leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* FOOTER CTA */}
      <section className="py-20 md:py-28 bg-white text-center px-6 border-t border-gray-200">
        <div className="inline-flex items-center gap-2 md:gap-3 px-5 py-2 md:px-6 md:py-3 bg-green-50 text-green-700 font-black rounded-full mb-8 md:mb-10 border border-green-100 animate-bounce text-md md:text-lg">
          <Users className="w-4 h-4 md:w-5 md:h-5" /> Join 1,200+ new members
          this week
        </div>
        <h2 className="text-4xl md:text-6xl font-black mb-6 text-slate-900 leading-tight">
          Ready to help others?
        </h2>
        <p className="text-base md:text-lg text-slate-500 mb-10 md:mb-12 max-w-2xl mx-auto font-medium">
          Join our community of students helping students. Every report matters.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-8">
          <Link
            to="/signup"
            className="flex items-center justify-center bg-[#02D44F] text-white px-8 md:px-12 py-4 md:py-5 rounded-full font-bold text-base md:text-lg hover:bg-[#02b844] shadow-md transition-all"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center border-2 border-[#02D44F] text-[#02D44F] px-8 md:px-12 py-4 md:py-5 rounded-full font-bold text-base md:text-lg hover:bg-green-50 transition-all"
          >
            Sign In
          </Link>
        </div>
      </section>
      {/* Global Responsive Styles */}
      <style>
        {`
          .input {
            width: 100%;
            padding: 12px 14px;
            border-radius: 10px;
            border: 1px solid #e5e7eb;
            outline: none;
            background-color: white;
          }
          .input:focus {
            border-color: #22c55e;
            box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.05);
          }
          .input-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white backdrop-blur-xl w-full max-w-4xl h-[85vh] rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col border border-white/20 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50/50 flex items-center justify-center">
                  <MapPin className="text-blue-600" size={24} />
                </div>
                <div className="flex-1 text-slate-400 text-sm">
                  <h3 className="text-xl md:text-2xl font-black uppercase text-slate-900">
                    Pin Location
                  </h3>
                  <p>Search or click on the map to mark the location.</p>
                </div>
              </div>
              <button
                onClick={() => setShowMap(false)}
                className="cursor-pointer p-3 hover:bg-slate-100 rounded-full transition-all"
              >
                <X size={24} className="text-slate-400" />
              </button>
            </div>
            <div className="flex-1 bg-white">
              <MapPicker
                onLocationSelect={(location) => {
                  setSelectedLocation(location);
                  setShowMap(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Home;
