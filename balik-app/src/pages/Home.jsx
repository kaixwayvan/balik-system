import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./ScrollReveal"; // Adjusted path
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
  MapPin,
  X,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import ColorPicker from "../shared/components/ColorPicker";
import MapPicker from "../shared/components/MapPicker";

// Slide transitions
const sliderVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 120 : -120,
    opacity: 0,
    filter: "blur(4px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      x: { type: "spring", stiffness: 260, damping: 28 },
      opacity: { duration: 0.25 },
      filter: { duration: 0.2 },
    },
  },
  exit: (direction) => ({
    x: direction < 0 ? 120 : -120,
    opacity: 0,
    filter: "blur(4px)",
    transition: {
      x: { type: "spring", stiffness: 260, damping: 28 },
      opacity: { duration: 0.2 },
      filter: { duration: 0.2 },
    },
  }),
};

// Container variants for scroll-triggered sequential steps
const systemTimelineContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
    },
  },
};

// Individual item slide up variant
const systemTimelineItemVariants = {
  hidden: { opacity: 0, y: 35, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15, duration: 0.5 },
  },
};

function Home() {
  useEffect(() => {
    document.title = "BALIK — Lost & Found System";
  }, []);

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

  const [[page, direction], setPage] = useState([0, 0]);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");

  const index =
    ((page % successStories.length) + successStories.length) %
    successStories.length;
  const story = successStories[index];

  const navigateStory = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  const jumpToStory = (targetIndex) => {
    const moveDirection = targetIndex > index ? 1 : -1;
    setPage([targetIndex, moveDirection]);
  };

  const [search, setSearch] = useState("");
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

  return (
    <main className="overflow-x-hidden bg-[#FAF6F0]" id="home">
      {/* Header Hero */}
      <div className="relative w-full min-h-[600px] md:h-[660px] lg:h-[650px] flex flex-col md:flex-row items-center justify-between gap-6 px-6 md:px-24 pt-32 md:pt-24 text-white overflow-hidden">
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

        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#F7E3CD]/50 to-[#ffdac9]/10"></div>

        {/* Left Content Header */}
        <div className="relative z-20 flex flex-col justify-center w-full lg:w-[55%] xl:w-[60%] font-['Plus_Jakarta_Sans'] text-center md:text-left pt-8 lg:pt-0 group/hero">
          {/* Accent Badge */}
          <ScrollReveal direction="up" delay={0.05}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-white/40 border border-[#520000]/10 w-fit mx-auto md:mx-0 backdrop-blur-md shadow-[0_2px_12px_-3px_rgba(82,0,0,0.05)] transition-all duration-300 hover:border-[#520000]/30 hover:shadow-[0_2px_20px_-3px_rgba(82,0,0,0.1)] cursor-pointer">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#520000] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#520000]"></span>
              </span>
              <span className="text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-[#520000] to-[#331e0c] bg-clip-text text-transparent">
                Campus Lost & Found
              </span>
            </div>
          </ScrollReveal>

          {/* Main Headline */}
          <h2 className="leading-[1.1] text-5xl sm:text-6xl md:text-5xl xl:text-7xl mb-6 font-black leading-none tracking-tight break-words select-none">
            {/* Line 1 */}
            <div className="relative overflow-hidden inline-block w-full h-auto leading-tight">
              <ScrollReveal direction="up" delay={0.15}>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#520000] to-[#6a1b1b] transition-transform duration-500 group-hover/hero:-translate-y-1">
                  Lost Something
                </span>
              </ScrollReveal>
            </div>

            {/* Line 2 */}
            <div className="relative block">
              <ScrollReveal direction="up" delay={0.25}>
                <span className="block text-[#4D2401] italic transition-all duration-700 ease-out filter blur-[0.2px] hover:blur-[0.4px] group-hover/hero:blur-0 opacity-90 group-hover/hero:opacity-100 group-hover/hero:tracking-normal tracking-tight">
                  On Campus?
                </span>
              </ScrollReveal>
            </div>

            {/* Line 3 */}
            <div className="relative mt-5 overflow-hidden leading-tight">
              <ScrollReveal direction="up" delay={0.35}>
                <span className="inline-block text-2xl sm:text-4xl md:text-4xl font-extrabold text-[#6E4007] italic font-['Lora'] tracking-normal transition-all duration-500 group-hover/hero:text-[#520000] group-hover/hero:translate-x-2">
                  Let’s help you find it.
                </span>
              </ScrollReveal>
              <div className="absolute bottom-0 left-0 h-[2px] w-12 bg-[#520000]/20 transition-all duration-500 group-hover/hero:w-32 group-hover/hero:bg-[#520000]/60 hidden md:block" />
            </div>
          </h2>

          {/* Subtitle */}
          <ScrollReveal direction="up" delay={0.45}>
            <p className="text-sm sm:text-base md:text-[15px] font-medium leading-relaxed text-[#331e0c]/70 max-w-xl mx-auto md:mx-0 balance transition-colors duration-500 group-hover/hero:text-[#331e0c]/90">
              Looked everywhere? Don’t stress. Report, search, or claim lost
              items in minutes.{" "}
              <span className="relative inline-block font-black text-[#520000] cursor-pointer group/brand px-1">
                BALIK
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#520000] to-[#331e0c] transform scale-x-0 transition-transform duration-300 origin-left group-hover/brand:scale-x-100" />
                <span className="absolute -inset-1 rounded bg-[#520000]/5 scale-75 opacity-0 transition-all group-hover/brand:scale-100 -z-10" />
              </span>{" "}
              helps you reconnect with what matters most.
            </p>
          </ScrollReveal>
        </div>

        {/* Right Content Buttons */}
        <div className="relative z-20 w-full lg:w-[45%] xl:w-[40%] flex items-center justify-center mb-10 lg:mt-0 px-2">
          <div
            className="
            w-full
            max-w-xl
            md:max-w-2xl
            lg:max-w-md
            md:h-[230px]
            lg:h-auto
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-2
            lg:grid-cols-1
            gap-4
            md:gap-5
            p-3
            md:p-4
            bg-gradient-to-b
            from-white/10
            via-white/[0.06]
            to-white/[0.02]
            border border-white/20
            rounded-[28px]
            backdrop-blur-2xl
            shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]
            group/deck
          "
          >
            {/* Lost */}
            <ScrollReveal direction="left" delay={0.4} className="w-full">
              <Link
                to="/login"
                className="group/lost relative flex flex-col justify-between w-full h-[125px] sm:h-[140px] md:h-[195px] lg:h-[130px] p-5 rounded-[22px] bg-[#E30000]/15 border border-[#E30000]/30 overflow-hidden transition-all duration-500 ease-out hover:scale-[1.03] hover:bg-[#E30000]/25 hover:border-[#E30000]/60 hover:shadow-[0_0_30px_rgba(227,0,0,0.3)]"
              >
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                <div className="absolute -inset-px bg-gradient-to-tr from-[#E30000]/20 via-transparent to-transparent opacity-50 group-hover/lost:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Top Tray */}
                <div className="flex items-center justify-between w-full">
                  <div className="w-10 h-10 md:w-12 md:h-12 lg:w-10 lg:h-10 rounded-full bg-[#E30000]/80 border border-white/20 flex items-center justify-center shadow-[0_4px_12px_rgba(227,0,0,0.3)] transition-all duration-500 group-hover/lost:bg-[#E30000] group-hover/lost:scale-110 group-hover/lost:shadow-[0_0_20px_rgba(227,0,0,0.6)]">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>

                  <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 transition-all duration-500 group-hover/lost:text-white group-hover/lost:font-bold group-hover/lost:bg-white/10 group-hover/lost:translate-x-0.5">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Bottom Tray */}
                <div className="text-left mt-auto select-none">
                  <h3 className="font-['Plus_Jakarta_Sans'] text-lg sm:text-lg md:text-lg lg:text-2xl font-black tracking-wide text-white group-hover/lost:text-[#781F1C] transition-colors duration-300">
                    Report Lost Item
                  </h3>
                  <p className="text-[11px] sm:text-xs text-white/60 font-medium mt-0.5 transition-colors group-hover/lost:text-white">
                    I lost my wallet, keys, phone, etc.
                  </p>
                </div>
              </Link>
            </ScrollReveal>

            {/* Found */}
            <ScrollReveal direction="left" delay={0.55} className="w-full">
              <HashLink
                smooth
                to="/#report"
                className="group/found relative flex flex-col justify-between w-full h-[125px] sm:h-[140px] md:h-[195px] lg:h-[130px] p-5 rounded-[22px] bg-[#02D44F]/10 border border-[#02D44F]/25 overflow-hidden transition-all duration-500 ease-out hover:scale-[1.03] hover:bg-[#02D44F]/20 hover:border-[#02D44F]/50 hover:shadow-[0_0_30px_rgba(2,212,79,0.25)]"
              >
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                <div className="absolute -inset-px bg-gradient-to-tr from-[#02D44F]/10 via-transparent to-transparent opacity-50 group-hover/found:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Top Tray */}
                <div className="flex items-center justify-between w-full">
                  <div className="w-10 h-10 md:w-12 md:h-12 lg:w-10 lg:h-10 rounded-full bg-[#02D44F]/80 border border-white/20 flex items-center justify-center shadow-[0_4px_12px_rgba(2,212,79,0.2)] transition-all duration-500 group-hover/found:bg-[#02D44F] group-hover/found:scale-110 group-hover/found:shadow-[0_0_20px_rgba(2,212,79,0.5)]">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>

                  <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 transition-all duration-500 group-hover/found:text-white group-hover/lost:font-bold group-hover/found:bg-white/10 group-hover/found:translate-x-0.5">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Bottom Tray */}
                <div className="text-left mt-auto select-none">
                  <h3 className="font-['Plus_Jakarta_Sans'] text-lg sm:text-lg md:text-lg lg:text-2xl font-black tracking-wide text-white group-hover/found:text-[#015420] transition-colors duration-300">
                    Report Found Item
                  </h3>
                  <p className="text-[11px] sm:text-xs text-white/60 font-medium mt-0.5 transition-colors group-hover/found:text-white">
                    I found an item on campus grounds
                  </p>
                </div>
              </HashLink>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* SECTION 1 - The Problem */}
      <section className="relative flex flex-col py-24 px-10 md:px-16 items-center justify-center bg-gradient-to-b from-[#FAF6F0] via-[#FDF1EB] to-[#F5E2D6] overflow-hidden shadow-[inset_0_1px_12px_rgba(0,0,0,0.42),_inset_0_-0.5px_12px_rgba(0,0,0,0.10)]">
        <div className="absolute inset-0 opacity-[0.3] pointer-events-none mix-blend-multiply">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="dotPattern1"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1.5" fill="#EBD2C4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotPattern1)" />
          </svg>
        </div>
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-[#FCE4EC]/60 to-transparent rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-6xl">
          <ScrollReveal direction="up">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-5 text-center text-[#331e0c] leading-tight tracking-tight">
              The Frustration of Losing Valuable Items
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.15}>
            <p className="mb-12 text-center max-w-3xl mx-auto text-base text-[#614e41] font-medium">
              Every day, thousands of people experience the stress and anxiety
              of losing important belongings.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.25}>
            <div className="max-w-3xl mx-auto mb-16 px-8 py-5 text-md md:text-xl rounded-full shadow-xl border border-[#a11010] bg-white/80 backdrop-blur-xl text-center text-[#520000] font-bold tracking-tight">
              73% of people lose valuable items monthly, spending 12+ hours
              searching
            </div>
          </ScrollReveal>

          <StaggerContainer speed={0.12}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {valuableItemsCards.map((card) => (
                <StaggerItem key={card.id}>
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-7 border border-white shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col justify-between group">
                    <div>
                      <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[#FFF5F0] border border-[#FCE4EC] mb-5 shadow-sm group-hover:scale-105 transition-transform duration-300">
                        {card.icon && (
                          <card.icon className="w-7 h-7 text-[#AD5D18]" />
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-[#331e0c] mb-3">
                        {card.title}
                      </h3>
                      <p className="text-[#614e41] text-sm leading-relaxed font-medium">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* SECTION 2 - How It Works */}
      <section
        className="relative py-24 px-10 md:px-16 bg-[#F5E2D6] overflow-hidden"
        id="how-it-works"
      >
        <motion.div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
                        linear-gradient(#520000 1px, transparent 1px),
                        linear-gradient(90deg, #520000 1px, transparent 1px)
                      `,
            backgroundSize: "40px 40px",
          }}
          animate={{
            backgroundPosition: ["0px 0px", "200px 0px"],
          }}
          transition={{
            duration: 10,
            ease: "linear",
            repeat: Infinity,
          }}
        />

        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#F5E2D6]/20 to-[#F5E2D6]/80"></div>

        <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-start">
          {/* Sticky Left Layout Column */}
          <div className="w-full lg:w-2/5 lg:sticky lg:top-32">
            <ScrollReveal direction="up">
              <span className="text-xs font-bold uppercase tracking-widest text-[#E30000] bg-white/60 px-3 py-1.5 rounded-full border border-white">
                Simple & Automated
              </span>
              <h2 className="text-4xl md:text-5xl text-[#331e0c] font-black mt-5 mb-6 leading-tight tracking-tight">
                How Our System Works
              </h2>
              <p className="text-[#614e41] text-base leading-relaxed font-medium">
                We've automated the classic campus lost-and-found bulletin
                structure. Our verification pipeline safeguards genuine claims
                and expedites reunions.
              </p>
            </ScrollReveal>
          </div>

          {/* Right Column */}
          <motion.div
            className="w-full lg:w-3/5 flex flex-col gap-6"
            variants={systemTimelineContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {systemCards.map((card, idx) => (
              <motion.div
                key={card.id}
                variants={systemTimelineItemVariants}
                className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 flex flex-col sm:flex-row gap-6 items-start border border-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#FAF6F0] to-[#EBD2C4] shadow-sm text-[#331e0c] font-black text-xl">
                  0{idx + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#331e0c] tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-[#614e41] text-sm leading-relaxed font-medium">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full flex justify-center bg-[#F5E2D6]">
        <div className="w-[200px] sm:w-[300px] md:w-[550px] lg:w-[700px] h-[2px] bg-gradient-to-r from-transparent via-[#520000]/50 to-transparent"></div>
      </div>

      {/* SECTION 3 - Recently Found Items */}
      <section className="relative bg-gradient-to-b from-[#F5E2D6] via-[#FAF6F0] to-white py-24 pt-20 overflow-hidden">
        <div className="absolute inset-y-0 right-1/4 w-px bg-gradient-to-b from-transparent via-[#EBD2C4]/40 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 left-1/3 w-px bg-gradient-to-b from-transparent via-[#EBD2C4]/40 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-10 relative z-10">
          <ScrollReveal direction="up">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="text-left">
                <h2 className="text-4xl md:text-5xl text-[#331e0c] font-extrabold mb-3 leading-tight tracking-tight">
                  Recently Found Items
                </h2>
                <p className="text-[#614e41] text-base font-medium">
                  Admin-verified items waiting to be reunited with their owners
                </p>
              </div>

              <div className="flex justify-start items-center overflow-x-auto gap-2.5 pb-2 no-scrollbar">
                {categories.map((cat, index) => (
                  <button
                    key={index}
                    className={`whitespace-nowrap cursor-pointer px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                      cat === "All Items"
                        ? "bg-[#331e0c] text-white border-[#331e0c] shadow-md"
                        : "bg-white/80 text-[#614e41] hover:bg-white border-[#EBD2C4]/60 shadow-sm"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <StaggerContainer speed={0.15}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {foundItems.map((item) => (
                <StaggerItem key={item.id}>
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#EBD2C4]/30 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                    <div className="relative overflow-hidden bg-[#FAF6F0]">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 md:h-56 object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                      <span className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full shadow-sm">
                        Verified
                      </span>
                    </div>
                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div>
                        <span className="inline-block bg-[#FAF6F0] text-[#614e41] text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md mb-3 border border-[#EBD2C4]/40">
                          {item.tag}
                        </span>
                        <h3 className="font-extrabold text-xl text-[#331e0c] mb-2 tracking-tight">
                          {item.title}
                        </h3>
                        <p className="text-sm text-[#614e41] mb-6 leading-relaxed font-medium">
                          {item.description}
                        </p>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-semibold text-gray-400 mb-5 pt-4 border-t border-gray-50">
                          <span className="flex items-center gap-1 text-gray-500">
                            <MapPin size={13} /> {item.location}
                          </span>
                          <span>{item.date}</span>
                        </div>
                        <button className="cursor-pointer w-full bg-[#331e0c] hover:bg-[#1f1207] text-white py-3 rounded-xl text-xs uppercase tracking-widest font-bold shadow-sm transition-all flex items-center justify-center gap-2">
                          View details <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* SECTION 4 - Report Form */}
      <section
        className="py-24 md:py-32 bg-[#FDF1EB] flex justify-center px-4 relative overflow-hidden"
        id="report"
      >
        {/* Grid Pattern background */}
        <div className="absolute inset-0 opacity-[0.2] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="formGrid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#EBD2C4"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#formGrid)" />
          </svg>
        </div>
        <div className="absolute top-1/4 right-[-5%] w-[450px] h-[450px] bg-white/60 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-[-5%] w-[450px] h-[450px] bg-[#EBD2C4]/30 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-5xl relative z-10">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#331e0c] bg-white/80 px-4 py-2 rounded-full border border-[#EBD2C4]/50 shadow-sm">
                Secure Submission
              </span>
              <h2 className="text-4xl md:text-5xl text-[#331e0c] font-extrabold mt-6 mb-4 tracking-tight">
                Report Found Item
              </h2>
              <p className="mx-auto max-w-2xl text-sm md:text-base text-[#614e41] leading-relaxed font-medium">
                Help your community by reporting items you've found on campus.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.15}>
            <form
              onSubmit={handleSubmit}
              className="bg-white/90 backdrop-blur-xl p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-xl space-y-8 md:space-y-10 border border-white"
            >
              {/* Row 1: Type & Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div className="flex flex-col gap-3">
                  <label className="font-bold text-slate-700 text-base">
                    Report Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value="Found Item"
                    readOnly
                    className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-100 font-bold text-slate-600 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="font-bold text-slate-700 text-base">
                    What was Found <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="whatWasFound"
                    value={formData.whatWasFound}
                    onChange={handleInputChange}
                    placeholder="e.g. Blue Backpack"
                    className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-rose-50/50 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Category & Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div className="flex flex-col gap-3">
                  <label className="font-bold text-slate-700 text-base">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="itemCategory"
                    value={formData.itemCategory}
                    onChange={handleInputChange}
                    className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-rose-50/50"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Bags">Bags</option>
                  </select>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="font-bold text-slate-700 text-base">
                    Date Found <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateFound"
                    value={formData.dateFound}
                    onChange={handleInputChange}
                    className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-rose-50/50 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Row 3: Brand & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div className="flex flex-col gap-3">
                  <label className="font-bold text-slate-700 text-base">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g. Nike"
                    className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:bg-white"
                  />
                </div>
                <div className="flex flex-col gap-3 relative">
                  <label className="font-bold text-slate-700 text-base">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={selectedLocation}
                    readOnly
                    onClick={() => setShowMap(true)}
                    placeholder="Click to select on map..."
                    className="w-full p-4 pr-12 rounded-2xl border border-slate-200 bg-slate-50 outline-none cursor-pointer focus:bg-white focus:ring-4 focus:ring-rose-50/50 transition-all"
                    required
                  />
                  <MapPin
                    className="absolute right-4 bottom-5 text-slate-400 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>

              {/* Row 4: ColorPicker & Photo */}
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
                        className="w-full p-4 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-4 focus:ring-rose-50/50 transition-all shadow-sm"
                        value={formData.customColor || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <label className="font-bold text-slate-700 text-base">
                    Photo (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full p-3.5 border border-slate-200 rounded-2xl bg-slate-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 cursor-pointer"
                  />
                </div>
              </div>

              {/* Additional Details */}
              <div className="flex flex-col gap-3">
                <label className="font-bold text-slate-700 text-base">
                  Additional Details
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full p-4 border border-slate-200 rounded-2xl outline-none bg-slate-50 focus:bg-white focus:ring-4 focus:ring-rose-50/50 transition-all"
                  placeholder="Any specific markings..."
                />
              </div>

              {/* Contact Section */}
              <div className="pt-8 md:pt-10 border-t border-slate-100">
                <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-6 tracking-tight">
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
                      className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-100"
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
                      className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-100"
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
                      className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-100"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="cursor-pointer w-full md:w-auto bg-[#02D44F] text-white font-black py-4.5 px-16 rounded-full shadow-lg hover:bg-[#02b844] hover:-translate-y-1 transition-all active:scale-95 uppercase tracking-widest text-sm shadow-green-100"
                >
                  Submit Found Report
                </button>
              </div>
            </form>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 5 - Why BALIK */}
      <section className="w-full py-24 px-6 bg-[#FAF6F0] relative overflow-hidden shadow-[inset_0_1px_12px_rgba(0,0,0,0.22),_inset_0_-0.5px_12px_rgba(0,0,0,0.10)]">
        <motion.div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "radial-gradient(#520000 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }}
          animate={{
            backgroundPosition: ["0px 0px", "120px 120px"],
          }}
          transition={{
            duration: 25,
            ease: "linear",
            repeat: Infinity,
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <ScrollReveal direction="up">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl text-[#331e0c] font-extrabold mb-4 leading-tight tracking-tight">
                Why Choose BALIK?
              </h2>
              <p className="text-[#614e41] text-base font-medium">
                The most advanced lost and found platform powered by AI and
                community trust
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer speed={0.12}>
            <div className="flex flex-col gap-8">
              {whyBalikData.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <StaggerItem key={idx}>
                    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-[#EBD2C4]/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow duration-300">
                      {/* Module Badge */}
                      <div className="order-1 md:order-2 text-xs uppercase tracking-widest font-black text-[#614e41] bg-[#FAF6F0] px-4 py-2 rounded-full border border-[#6E0000]/30 shrink-0">
                        Module 0{idx + 1}
                      </div>

                      {/* Content */}
                      <div className="order-2 md:order-1 flex items-center gap-6">
                        <div className="p-4 bg-[#FDF1EB] rounded-2xl text-[#331e0c] border border-[#FCE4EC]">
                          <Icon className="w-7 h-7" />
                        </div>

                        <div className="text-left max-w-xl">
                          <h3 className="text-xl font-bold text-[#331e0c] mb-1 tracking-tight">
                            {item.title}
                          </h3>

                          <p className="text-gray-500 text-sm leading-relaxed font-medium">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* SECTION 6 - Rewards */}
      <section className="w-full py-24 px-6 bg-gradient-to-tr from-[#FAF6F0] via-[#FDF1EB] to-[#F5E2D6] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.1] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="diagonalPattern4"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="40"
                  stroke="#331e0c"
                  strokeWidth="1.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diagonalPattern4)" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal direction="up">
            <h2 className="text-4xl md:text-[2.8rem] text-[#331e0c] font-extrabold mb-4 leading-tight tracking-tight">
              Earn Rewards for Helping Others
            </h2>
            <p className="text-[#614e41] text-base max-w-xl mx-auto mb-16 font-medium">
              Calculate your potential earnings and see top community
              contributors
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6 md:p-10 border border-white">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#FAF6F0]">
                <h3 className="text-2xl text-left font-black text-[#331e0c] tracking-tight">
                  Top Contributors
                </h3>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-500 bg-rose-50 px-3 py-1 rounded-full">
                  Live Rankings
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {topContributors.map((user) => (
                  <div
                    key={user.rank}
                    className="flex flex-wrap sm:flex-nowrap items-center justify-between p-5 rounded-2xl bg-white border border-[#EBD2C4]/30 transition-all hover:shadow-md hover:border-[#EBD2C4] gap-3"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#331e0c] text-white font-bold text-sm shadow-sm">
                        {user.rank}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-[#FAF6F0] flex items-center justify-center font-bold text-xs text-[#331e0c] border border-[#EBD2C4]/60">
                        {user.initials}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-slate-900 leading-tight text-sm md:text-base">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">
                          {user.items} items reunited
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-auto sm:ml-0 bg-[#FDF1EB] px-5 py-2 rounded-xl border border-[#FCE4EC]">
                      <p className="text-[#331e0c] font-black text-sm md:text-base">
                        {user.points.toLocaleString()}
                      </p>
                      <p className="text-[9px] uppercase font-bold tracking-widest text-gray-400">
                        points
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 7 - Success Stories */}
      <section
        className="w-full py-24 px-6 bg-white overflow-hidden relative"
        id="success-stories"
      >
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal direction="up">
            <h2 className="text-3xl md:text-[2.8rem] text-[#331e0c] font-extrabold mb-3 leading-tight tracking-tight">
              Success Stories
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto mb-16 font-medium">
              Real people, real reunions, real impact
            </p>
          </ScrollReveal>

          <ScrollReveal direction="fade" delay={0.2}>
            <div className="relative px-2 min-h-[440px] sm:min-h-[400px] flex flex-col justify-between">
              <div className="relative flex-1 flex items-center justify-center overflow-hidden w-full">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={page}
                    custom={direction}
                    variants={sliderVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="w-full flex flex-col items-center"
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full bg-gradient-to-tr from-[#FAF6F0] to-[#EBD2C4] mb-6 shadow-inner border-4 border-white" />
                    <h3 className="text-xl font-bold text-gray-900">
                      {story.name}
                    </h3>
                    <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                      {story.role}
                    </p>
                    <div className="flex justify-center gap-1 mb-6">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < story.rating
                              ? "text-yellow-400 text-xl"
                              : "text-gray-200 text-xl"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="italic text-base md:text-xl text-gray-700 font-['Lora'] max-w-2xl mx-auto mb-8 leading-relaxed px-4">
                      “{story.quote}”
                    </p>
                    <div className="flex justify-center items-center gap-2 bg-[#FDF1EB] text-[#331e0c] font-bold px-4 py-2 rounded-full border border-[#FCE4EC] mb-8 text-xs uppercase tracking-wider shadow-sm">
                      Reunited: {story.reunitedItem}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Nav Controller Links */}
              <div className="flex justify-between items-center max-w-3xl mx-auto w-full pt-6">
                <button
                  onClick={() => navigateStory(-1)}
                  className="w-22 h-22 flex items-center justify-center rounded-full text-gray-400 hover:bg-[#FAF6F0] hover:text-gray-700 active:scale-95 transition-all cursor-pointer border border-transparent hover:border-gray-200"
                >
                  <ChevronLeft size={22} />
                </button>
                <div className="flex gap-2.5">
                  {successStories.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => jumpToStory(i)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === index ? "w-8 bg-[#331e0c]" : "w-2 bg-gray-200 hover:bg-gray-300"}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => navigateStory(1)}
                  className="w-22 h-22 flex items-center justify-center rounded-full text-gray-400 hover:bg-[#FAF6F0] hover:text-gray-700 active:scale-95 transition-all cursor-pointer border border-transparent hover:border-gray-200"
                >
                  <ChevronRight size={22} />
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full flex justify-center bg-none">
        <div className="w-[300px] sm:w-[200px] md:w-[550px] lg:w-[600px] h-[2px] bg-gradient-to-r from-transparent via-[#520000]/30 to-transparent"></div>
      </div>

      {/* SECTION 8 - Security */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-white via-[#FAF6F0] to-[#F5E2D6] text-[#331e0c] relative overflow-hidden">
        {/* Array grid canvas layout layer */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.25] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="securityDots"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1" fill="#EBD2C4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#securityDots)" />
          </svg>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#EBD2C4]/30 to-transparent rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <ScrollReveal direction="up">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF5F0] rounded-full border border-[#EBD2C4] mb-4 text-xs font-bold uppercase tracking-wider text-stone-600">
              <ShieldCheck size={14} className="text-emerald-600" /> Fully
              Encrypted Protocol
            </div>
            <h2 className="text-4xl md:text-[2.8rem] text-[#331e0c] font-extrabold mb-3 leading-tight tracking-tight">
              Your Security is Our Priority
            </h2>
            <p className="text-[#614e41] text-base max-w-xl mx-auto mb-20 font-medium">
              Multiple layers of protection ensure safe and trustworthy reunions
            </p>
          </ScrollReveal>

          <StaggerContainer speed={0.15}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {securityData.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <StaggerItem key={idx}>
                    <div className="bg-white/80 backdrop-blur-md border border-[#EBD2C4]/40 rounded-[2rem] p-10 text-left shadow-md hover:shadow-xl hover:border-[#EBD2C4] hover:-translate-y-1.5 transition-all duration-500 group h-full flex flex-col">
                      <div className="w-14 h-14 rounded-2xl bg-[#FDF1EB] flex items-center justify-center mb-6 border border-[#FCE4EC] group-hover:scale-105 transition-transform duration-300">
                        <Icon size={24} className="text-[#331e0c]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#331e0c] mb-3 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-sm md:text-base text-[#614e41] leading-relaxed font-medium">
                        {item.description}
                      </p>
                    </div>
                  </StaggerItem>
                );
              })}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full flex justify-center bg-[#F5E2D6]">
        <div className="w-[300px] sm:w-[200px] md:w-[550px] lg:w-[600px] h-[2px] bg-gradient-to-r from-transparent via-[#520000]/30 to-transparent"></div>
      </div>

      {/* SECTION 9 - FAQ */}
      <section
        className="py-24 md:py-32 bg-gradient-to-b from-[#F5E2D6] via-[#FAF6F0] to-[#FAF6F0] relative overflow-hidden"
        id="faqs"
      >
        <div className="relative w-full max-w-4xl mx-auto px-8 z-10">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 leading-tight tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-500 text-base max-w-xl mx-auto mb-10 font-medium">
                Everything you need to know about the BALIK platform.
              </p>
              <div className="relative max-w-2xl mx-auto">
                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 md:pl-12 pr-4 py-3 md:py-5 bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-md text-lg md:text-base outline-none focus:ring-2 focus:ring-green-100 transition-all"
                />
              </div>
            </div>
          </ScrollReveal>

          <StaggerContainer speed={0.1}>
            <div className="space-y-6">
              {filteredFAQs.map((faq, i) => (
                <StaggerItem key={i}>
                  <div className="bg-[#FFFFFF] rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-in-out">
                    <button
                      onClick={() =>
                        setOpenFaqIndex(openFaqIndex === i ? null : i)
                      }
                      className="w-full px-5 py-6 md:px-8 md:py-7 rounded-xl md:rounded-2xl flex items-center justify-between text-left hover:bg-slate-50 transition-colors group"
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
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        transition={{ duration: 0.25 }}
                        className="px-5 pb-5 md:px-8 md:pb-6 text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-200/50 pt-4"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full flex justify-center bg-none">
        <div className="w-[300px] sm:w-[200px] md:w-[550px] lg:w-[600px] h-[2px] bg-gradient-to-r from-transparent via-[#520000]/30 to-transparent"></div>
      </div>

      {/* Call to Action */}
      <section className="py-24 bg-white text-center px-6 relative overflow-hidden">
        <ScrollReveal direction="up" className="relative z-10">
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#FDF1EB] text-[#331e0c] font-bold rounded-full mb-8 border border-[#FCE4EC] shadow-sm text-sm lg:text-lg"
          >
            <Users className="w-6 h-6" />
            Join 1,200+ new members this week
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-slate-900 leading-tight tracking-tight">
            Ready to help others?
          </h2>
          <p className="text-base md:text-lg text-slate-500 mb-12 max-w-xl mx-auto font-medium">
            Join our community of students helping students. Every report
            matters.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="flex items-center justify-center bg-[#02D44F] text-white px-10 py-4.5 rounded-full font-bold text-lg hover:bg-[#02b844] hover:-translate-y-0.5 shadow-lg shadow-green-100 transition-all"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center border-2 border-slate-200 text-slate-700 px-10 py-4.5 rounded-full font-bold text-lg hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 transition-all"
            >
              Sign In
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Global Responsive Styles */}
      <style>{`
        .input { width: 100%; padding: 12px 14px; border-radius: 10px; border: 1px solid #e5e7eb; outline: none; background-color: white; }
        .input:focus { border-color: #EBD2C4; box-shadow: 0 0 0 4px rgba(235, 210, 196, 0.15); }
        .input-group { display: flex; flex-direction: column; gap: 6px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white w-full max-w-4xl h-[85vh] rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col border border-slate-100"
          >
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <MapPin className="text-blue-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-black uppercase text-slate-900 tracking-tight">
                    Pin Location
                  </h3>
                  <p className="text-slate-400 text-sm mt-0.5">
                    Search or click on the map to mark the location.
                  </p>
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
          </motion.div>
        </div>
      )}
    </main>
  );
}

export default Home;
