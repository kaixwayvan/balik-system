import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  BookOpen,
  PlusCircle,
  CheckSquare,
  CheckCircle2,
  Sparkles,
  Trophy,
  User,
  HelpCircle,
  MessageSquare,
  ChevronRight,
  Menu,
  X,
  LifeBuoy,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../shared/components/partials/Header";
import Footer from "../shared/components/partials/Footer";

const ARTICLE_SECTIONS = [
  {
    id: "getting-started",
    category: "Getting Started",
    title: "BALIK: Belongings Assistance Lost Item Keeper",
    content: "We are dedicated to helping you recover what matters. Use our Help Center to browse guides, track your reports, and connect with our support team to ensure a smooth experience with our Belongings Assistance platform.",
    subCards: [
      {
        title: "I lost an item",
        text: "Submit a detailed report of what you lost and where you think you lost it."
      },
      {
        title: "I found an item",
        text: "Help a fellow student out. Upload a photo and drop it off at the designated station."
      }
    ]
  },
  {
    id: "report-lost",
    category: "Reporting Lost Items",
    title: "Reporting Lost Items Steps",
    content: "Losing something can be stressful, but our system is designed to make recovery as fast as possible. Follow these steps:",
    steps: [
      { num: "1", label: "Navigate to 'Report Lost Item'", text: "Click the prominently displayed button on your dashboard." },
      { num: "2", label: "Be Descriptive", text: "Mention colors, brands, identifying marks, and exactly where you last saw it. Our AI relies on this text." },
      { num: "3", label: "Submit and Wait for Matches", text: "You will be notified immediately if our system detects a high-confidence match." }
    ]
  },
  {
    id: "claim-found",
    category: "Claiming Found Items",
    title: "How to Claim an Item Found by the Community",
    content: "When an item matches your description or you see your missing item in the recently reported dashboard, follow this pipeline to initiate verification:",
    steps: [
      { num: "1", label: "Submit a Claim Request", text: "Click on the found item card and provide a verification answer to prove it's yours." },
      { num: "2", label: "Await Claim Approval", text: "Administrators or the founder will review your claim credentials and approve the match." },
      { num: "3", label: "In-Person Pick up", text: "Head to the designated campus vault with your valid student ID card to secure your item." }
    ]
  },
  {
    id: "smart-match",
    category: "Smart Matching (NLP)",
    title: "How Smart Matching Works",
    content: "BALIK doesn't just rely on manual searching. We use Natural Language Processing (NLP) to read your item descriptions and automatically compare them against everything handed into the system.",
    features: [
      { label: "Synonym Recognition:", text: "If you say 'hydroflask' and someone reports a 'blue water bottle', our system knows they might be the same." },
      { label: "Confidence Scoring:", text: "You'll see a percentage (e.g., 85% Match) indicating how likely the found item is yours." }
    ]
  },
  {
    id: "gamification",
    category: "Points & Badges",
    title: "Points, Badges & Rewards",
    content: "We believe in rewarding honesty. To encourage a culture of returning items, BALIK features a built-in gamification system.",
    badges: [
      { name: "Good Samaritan", desc: "Awarded for returning 5+ items", type: "trophy" },
      { name: "Quick Match", desc: "Claimed an item within 24 hours", type: "check" },
      { name: "Top Contributor", desc: "Rank on the monthly campus leaderboard", type: "star" }
    ]
  },
  {
    id: "account",
    category: "Account & Profile",
    title: "Managing Your Settings & Credentials",
    content: "Keep your workspace configuration accurate so you never miss a real-time match notification message matrix.",
    features: [
      { label: "University ID Integration:", text: "Verify your enrollment information to auto-populate report signatures securely." },
      { label: "Alert Configurations:", text: "Enable or disable desktop push prompts and notification digests." }
    ]
  },
  {
    id: "faqs",
    category: "Common FAQs",
    title: "Frequently Asked Questions",
    isFaqBlock: true
  },
  {
    id: "contact",
    category: "Contact Support",
    title: "Still need help?",
    content: "Contact the Admin Team. If you’re experiencing technical issues or have a dispute regarding a claimed item, reach out to us directly.",
    email: "support@balik.pup.edu.ph",
    office: "Office of the Student Services"
  }
];

export default function HelpCenter() {
  useEffect(() => {
    document.title = "Help Center - BALIK";
  }, []);

  const [openIndex, setOpenIndex] = useState(null);
  const [activeSection, setActiveSection] = useState("getting-started");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      q: "Do I need to verify my identity to claim an item?",
      a: "Yes. For security purposes, you must present your valid University ID to the BALIK administrator when physically claiming an item.",
    },
    {
      q: "How long are found items kept?",
      a: "Items are typically held at the main office for 3-6 months depending on the value of the item, as outlined in our Privacy Policy.",
    },
    {
      q: "What if the NLP matching doesn't find my item?",
      a: "You can always browse the general 'Found Items' directory manually. Sometimes descriptions differ too vastly for the AI to catch.",
    },
  ];

  const sidebarSections = [
    { id: "getting-started", title: "Getting Started", icon: BookOpen },
    { id: "report-lost", title: "Reporting Lost Items", icon: PlusCircle },
    { id: "claim-found", title: "Claiming Found Items", icon: CheckSquare },
    { id: "smart-match", title: "Smart Matching (NLP)", icon: Sparkles },
    { id: "gamification", title: "Points & Badges", icon: Trophy },
    { id: "account", title: "Account & Profile", icon: User },
    { id: "faqs", title: "Common FAQs", icon: HelpCircle },
    { id: "contact", title: "Contact Support", icon: MessageSquare },
  ];

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return ARTICLE_SECTIONS;

    return ARTICLE_SECTIONS.filter((section) => {
      const matchCategory = section.category?.toLowerCase().includes(query);
      const matchTitle = section.title?.toLowerCase().includes(query);
      const matchContent = section.content?.toLowerCase().includes(query);

      let matchSubData = false;
      if (section.subCards) {
        matchSubData = section.subCards.some(c => c.title.toLowerCase().includes(query) || c.text.toLowerCase().includes(query));
      }
      if (section.steps) {
        matchSubData = section.steps.some(s => s.label.toLowerCase().includes(query) || s.text.toLowerCase().includes(query));
      }
      if (section.features) {
        matchSubData = section.features.some(f => f.label.toLowerCase().includes(query) || f.text.toLowerCase().includes(query));
      }
      if (section.badges) {
        matchSubData = section.badges.some(b => b.name.toLowerCase().includes(query) || b.desc.toLowerCase().includes(query));
      }
      if (section.isFaqBlock) {
        matchSubData = faqs.some(f => f.q.toLowerCase().includes(query) || f.a.toLowerCase().includes(query));
      }

      return matchCategory || matchTitle || matchContent || matchSubData;
    });
  }, [searchQuery]);

  const filteredFaqs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return faqs;
    return faqs.filter(f => f.q.toLowerCase().includes(query) || f.a.toLowerCase().includes(query));
  }, [searchQuery, faqs]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const visibleSections = filteredArticles.map((s) => document.getElementById(s.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 200;

      for (let i = visibleSections.length - 1; i >= 0; i--) {
        const el = visibleSections[i];
        if (el && scrollPosition >= el.offsetTop) {
          setActiveSection(el.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredArticles]);

  return (
    <div className="min-h-screen bg-[#FDF8F5] font-sans text-slate-900 selection:bg-[#F2E4DC] selection:text-[#520000] overflow-x-hidden relative">
      <Header />

      {/* Header Pattern Backgrounds */}
      <div className="absolute top-0 left-0 w-full h-[120px] sm:h-[130px] md:h-[150px] bg-white border-b border-[#B0570C]/40 overflow-hidden pointer-events-none z-40">
        <div className="absolute -top-10 left-[5%] sm:left-[10%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-[#F2E4DC]/40 rounded-full blur-3xl"></div>
        <div className="absolute top-[-50px] right-[10%] sm:right-[20%] w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-[#520000]/5 rounded-full blur-3xl"></div>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#520000 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }}
        ></div>
      </div>

      {/* Hero Search Section */}
      <div
        className="relative w-full mt-10 min-h-[380px] sm:min-h-[440px] overflow-hidden flex flex-col items-center justify-center pt-30 pb-11 sm:pt-35 md:pt-30 sm:pb-0 border-b border-[#DBC9C0]/40"
        style={{
          backgroundColor: "#FDF8F5",
          backgroundImage: `
            radial-gradient(rgba(176, 87, 12, 0.08) 1.5px, transparent 1.5px),
            radial-gradient(at 0% 0%, rgba(246, 143, 111, 0.56) 0px, transparent 50%), 
            radial-gradient(at 100% 0%, rgba(245, 167, 104, 0.26) 0px, transparent 50%),
            radial-gradient(at 50% 100%, rgb(250, 231, 213) 0px, transparent 80%),
            radial-gradient(at 100% 100%, rgba(252, 232, 220, 0.84) 0px, transparent 50%)
          `,
          backgroundSize: "32px 32px, 100% 100%, 100% 100%, 100% 100%, 100% 100%",
        }}
      >
        <style>{`
          @keyframes radar-spin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
          @keyframes radar-spin-reverse { from { transform: translate(-50%, -50%) rotate(360deg); } to { transform: translate(-50%, -50%) rotate(0deg); } }
          .spin-slow { animation: radar-spin 35s linear infinite; }
          .spin-reverse { animation: radar-spin-reverse 65s linear infinite; }
          @keyframes float-ui { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
          .animate-float-ui { animation: float-ui 6s ease-in-out infinite; }
          @keyframes flash-pulse { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
          .animate-flash { animation: flash-pulse 2s ease-in-out infinite; }
        `}</style>

        <div className="absolute top-1/2 left-1/2 w-full h-full pointer-events-none z-0 opacity-70">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] border-[1.5px] border-[#B0570C]/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 spin-slow w-[450px] h-[450px] sm:w-[650px] sm:h-[650px] border-[1.5px] border-dashed border-[#B0570C]/40 rounded-full flex items-start justify-center">
            <div className="w-2 h-2 rounded-full bg-[#520000] shadow-[0_0_12px_2px_#520000] -translate-x-15 animate-flash"></div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] sm:w-[850px] sm:h-[850px] border-[1.5px] border-[#520000]/10 rounded-full"></div>
        </div>

        <div className="relative z-10 text-center w-full max-w-4xl px-4 sm:px-8 md:px-12 animate-float-ui">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/60 backdrop-blur-xl border border-white/80 text-[#520000] font-bold text-xs sm:text-sm mb-4 sm:mb-6 shadow-sm">
            <LifeBuoy size={14} className="sm:w-4 sm:h-4" /> Help & Support
          </div>

          <h1 className="font-['Zalando_Sans_Expanded'] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#333333] mb-5 sm:mb-8 leading-tight drop-shadow-sm">
            How can we help you?
          </h1>

          <div className="relative w-full group max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-5 sm:pl-7 flex items-center z-10 pointer-events-none text-[#520000]/80 group-focus-within:text-[#520000] transition-colors">
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <input
              type="text"
              className="font-['Plus_Jakarta_Sans'] w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-4 sm:py-5 md:py-6 bg-white/70 backdrop-blur-2xl border border-white/90 rounded-full text-base sm:text-lg text-gray-800 placeholder-gray-500/80 shadow-lg focus:outline-none focus:ring-4 focus:ring-[#520000]/15 focus:bg-white/95 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300"
              placeholder="Search for answers, guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu Action Float */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="cursor-pointer lg:hidden fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[98] bg-[#520000] text-white p-3.5 sm:p-4 rounded-full shadow-2xl shadow-[#520000]/30 hover:scale-105 transition-transform"
      >
        <Menu size={24} />
      </button>

      <div className="font-['Plus_Jakarta_Sans'] container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16 relative">
          
          <div
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-all duration-300 opacity-0 invisible"
            style={{ opacity: sidebarOpen ? 1 : 0, visibility: sidebarOpen ? "visible" : "hidden" }}
          />

          {/* Sidebar Nav Category Block */}
          <aside
            className={`
              fixed lg:sticky top-0 lg:top-32 left-0 h-[100dvh] lg:h-fit w-[85%] max-w-[340px] lg:w-72 xl:w-80
              z-[101] bg-[#FDF8F5]/95 backdrop-blur-2xl border-r lg:border border-[#DBC9C0]/40
              shadow-2xl lg:shadow-xl overflow-y-auto transition-transform duration-500 ease-out
              rounded-r-[2rem] lg:rounded-[2rem] p-2 pr-4 sm:pr-5
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
          >
            <div className="p-5 sm:p-6 pb-3 flex items-center justify-between">
              <p className="text-[10px] sm:text-xs font-black text-[#520000]/40 uppercase tracking-[0.2em]">
                Categories
              </p>
              <button
                onClick={() => setSidebarOpen(false)}
                className="cursor-pointer lg:hidden w-8 h-8 rounded-full hover:bg-[#520000]/10 flex items-center justify-center text-[#520000] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="space-y-1 px-2">
              {sidebarSections.map((section) => {
                const isAvailable = filteredArticles.some(a => a.id === section.id);
                return (
                  <button
                    key={section.id}
                    disabled={!isAvailable}
                    onClick={() => {
                      scrollToSection(section.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 transform ${
                      !isAvailable 
                        ? "opacity-20 cursor-not-allowed" 
                        : activeSection === section.id
                          ? "bg-[#520000] text-white shadow-lg shadow-[#520000]/20 translate-x-2 cursor-pointer"
                          : "text-gray-600 hover:text-[#520000] hover:bg-white hover:translate-x-1 cursor-pointer"
                    }`}
                  >
                    <section.icon
                      size={18}
                      className={activeSection === section.id ? "opacity-100" : "opacity-40"}
                    />
                    <span className="text-left leading-tight">{section.title}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-4 sm:mt-6 p-4 sm:p-6 pt-5 sm:pt-7 border-t border-[#F2E4DC]">
              <div className="bg-gradient-to-br from-white to-[#FDF8F5] p-4 sm:p-5 rounded-2xl border border-[#DBC9C0]/30 shadow-sm">
                <p className="text-xs sm:text-sm font-bold text-slate-800 mb-1.5 sm:mb-2">
                  Need immediate help?
                </p>
                <p className="text-[11px] sm:text-xs text-gray-500 mb-3 sm:mb-4 leading-relaxed">
                  Our campus support team is available during university hours.
                </p>
                <a 
                  href="mailto:support@balik.pup.edu.ph?subject=Inquiry%20regarding%20BALIK%20Platform"
                  className="cursor-pointer w-full py-2.5 bg-[#F2E4DC]/50 hover:bg-[#F2E4DC] text-[#520000] font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 border border-[#DBC9C0]/50">
                  <MessageSquare size={14} /> Contact Admin
                </a>
                
              </div>
            </div>
          </aside>

          {/* Core Content Layout Area */}
          <article className="flex-1 w-full max-w-[100%] lg:max-w-4xl space-y-16 sm:space-y-20 lg:space-y-24 pb-20 sm:pb-32">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => {
                
                // Block 1
                if (article.id === "getting-started") {
                  return (
                    <section
                      key={article.id}
                      id={article.id}
                      className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-[#DBC9C0]/30 scroll-mt-24 sm:scroll-mt-32 animate-fade-in"
                    >
                      <h2 className="text-3xl md:text-4xl text-[#520000] mb-8 leading-tight">
                        <strong className="font-black">BALIK</strong>: Belongings Assistance Lost Item Keeper
                      </h2>
                      <div className="space-y-6 text-lg leading-relaxed text-gray-700">
                        <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto font-['Plus_Jakarta_Sans']">
                          We are dedicated to helping you{" "}
                          <span className="font-bold text-[#520000] underline decoration-[#520000]/30 underline-offset-4">
                            recover what matters
                          </span>
                          . Use our{" "}
                          <span className="font-semibold text-[#520000]">Help Center</span> to browse guides, track your reports, and connect with our support team to ensure a{" "}
                          <span className="italic text-[#520000]">smooth experience</span> with our{" "}
                          <span className="font-bold text-[#520000]">Belongings Assistance platform</span>.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-10">
                        {article.subCards.map((card, idx) => (
                          <div key={idx} className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#FDF8F5] border border-[#DBC9C0]/20 hover:border-[#B0570C]/30 transition-colors group">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center text-[#520000] shadow-sm mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                              {idx === 0 ? <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6" /> : <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6" />}
                            </div>
                            <h4 className="font-bold text-lg text-[#520000] mb-1.5 sm:mb-2">{card.title}</h4>
                            <p className="text-sm text-gray-600">{card.text}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-12 pt-10 border-t border-[#F2E4DC]/50 flex items-center justify-between">
                        <div className="text-sm font-bold text-gray-400">Effective Date : 2026</div>
                        <div className="flex items-center gap-2 text-[#520000] font-bold text-sm">
                          <CheckCircle2 size={18} /> Verified Secure
                        </div>
                      </div>
                    </section>
                  );
                }

                // Block 2
                if (article.id === "report-lost") {
                  return (
                    <section key={article.id} id={article.id} className="scroll-mt-24 sm:scroll-mt-32 animate-fade-in">
                      <h3 className="font-['Zalando_Sans_Expanded'] text-2xl sm:text-3xl font-black text-[#520000] mb-3 sm:mb-4">
                        {article.category}
                      </h3>
                      <div className="bg-white p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-[#DBC9C0]/20 text-gray-700 shadow-sm">
                        <p className="text-md mb-5 sm:mb-6">{article.content}</p>
                        <ol className="space-y-4 sm:space-y-5">
                          {article.steps.map((step, i) => (
                            <li key={i} className="flex gap-3 sm:gap-4">
                              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#520000] text-white flex items-center justify-center font-bold text-xs sm:text-sm">
                                {step.num}
                              </div>
                              <div>
                                <strong className="text-lg text-[#520000] block mb-0.5 sm:mb-1">{step.label}</strong>
                                <span className="text-xs sm:text-sm text-gray-600">{step.text}</span>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </section>
                  );
                }

                // Block 3
                if (article.id === "claim-found") {
                  return (
                    <section key={article.id} id={article.id} className="scroll-mt-24 sm:scroll-mt-32 animate-fade-in">
                      <h3 className="font-['Zalando_Sans_Expanded'] text-2xl sm:text-3xl font-black text-[#520000] mb-3 sm:mb-4">
                        {article.category}
                      </h3>
                      <div className="bg-white p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-[#DBC9C0]/20 text-gray-700 shadow-sm">
                        <p className="text-md mb-5 sm:mb-6">{article.content}</p>
                        <ol className="space-y-4 sm:space-y-5">
                          {article.steps.map((step, i) => (
                            <li key={i} className="flex gap-3 sm:gap-4">
                              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#520000] text-white flex items-center justify-center font-bold text-xs sm:text-sm">
                                {step.num}
                              </div>
                              <div>
                                <strong className="text-lg text-[#520000] block mb-0.5 sm:mb-1">{step.label}</strong>
                                <span className="text-xs sm:text-sm text-gray-600">{step.text}</span>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </section>
                  );
                }

                // Block 4
                if (article.id === "smart-match") {
                  return (
                    <section key={article.id} id={article.id} className="scroll-mt-24 sm:scroll-mt-32 animate-fade-in">
                      <h3 className="font-['Zalando_Sans_Expanded'] text-2xl sm:text-3xl font-black text-[#520000] mb-3 sm:mb-4">
                        {article.title}
                      </h3>
                      <div className="bg-[#520000] p-6 sm:p-8 md:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] text-white shadow-xl shadow-[#520000]/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-[#F2E4DC]/10 blur-[60px] sm:blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3" />
                        <div className="relative z-10">
                          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                            <Sparkles className="text-[#F2E4DC] w-6 h-6 sm:w-7 sm:h-7" />
                            <h4 className="text-lg sm:text-xl font-bold text-white">Powered by AI</h4>
                          </div>
                          <p className="mb-5 sm:mb-6 text-base text-gray-200 leading-relaxed">
                            {article.content}
                          </p>
                          <ul className="space-y-3 sm:space-y-4">
                            {article.features.map((feat, i) => (
                              <li key={i} className="flex items-start gap-2 sm:gap-3">
                                <div className="flex-shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 mt-1.5 sm:mt-2 rounded-full bg-[#F2E4DC]" />
                                <p className="text-sm">
                                  <strong className="text-[#F2E4DC]">{feat.label}</strong> {feat.text}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </section>
                  );
                }

                // Block 5
                if (article.id === "gamification") {
                  return (
                    <section key={article.id} id={article.id} className="scroll-mt-24 sm:scroll-mt-32 animate-fade-in">
                      <h3 className="font-['Zalando_Sans_Expanded'] text-2xl sm:text-3xl font-black text-[#520000] mb-3 sm:mb-4">
                        {article.title}
                      </h3>
                      <div className="bg-white p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-[#DBC9C0]/20 text-gray-700 shadow-sm">
                        <p className="text-base mb-5 sm:mb-6">{article.content}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          {article.badges.map((badge, i) => (
                            <div key={i} className={`flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl border ${
                              badge.type === 'trophy' ? 'bg-orange-50 border-orange-100 text-orange-600' :
                              badge.type === 'check' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-purple-50 border-purple-100 text-purple-600'
                            }`}>
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 sm:mb-3 ${
                                badge.type === 'trophy' ? 'bg-orange-100' : badge.type === 'check' ? 'bg-blue-100' : 'bg-purple-100'
                              }`}>
                                {badge.type === 'trophy' && <Trophy size={18} />}
                                {badge.type === 'check' && <CheckSquare size={18} />}
                                {badge.type === 'star' && <Star size={18} />}
                              </div>
                              <strong className="text-md text-slate-800">{badge.name}</strong>
                              <span className="text-xs text-gray-600 mt-1">{badge.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  );
                }

                // Block 6
                if (article.id === "account") {
                  return (
                    <section key={article.id} id={article.id} className="scroll-mt-24 sm:scroll-mt-32 animate-fade-in">
                      <h3 className="font-['Zalando_Sans_Expanded'] text-2xl sm:text-3xl font-black text-[#520000] mb-3 sm:mb-4">
                        {article.category}
                      </h3>
                      <div className="bg-white p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-[#DBC9C0]/20 text-gray-700 shadow-sm">
                        <p className="text-base mb-5 sm:mb-6">{article.content}</p>
                        <ul className="space-y-3 sm:space-y-4">
                          {article.features.map((feat, i) => (
                            <li key={i} className="flex items-start gap-2 sm:gap-3">
                              <div className="flex-shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 mt-1.5 sm:mt-2 rounded-full bg-[#520000]" />
                              <p className="text-sm">
                                <strong className="text-slate-800 block mb-0.5">{feat.label}</strong> {feat.text}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </section>
                  );
                }

                // Block 7
                if (article.id === "faqs") {
                  return (
                    <section key={article.id} id={article.id} className="scroll-mt-24 sm:scroll-mt-32 animate-fade-in">
                      <h3 className="font-['Zalando_Sans_Expanded'] text-2xl sm:text-3xl font-black text-[#520000] mb-3 sm:mb-4">
                        {article.title}
                      </h3>
                      <div className="space-y-6">
                        {filteredFaqs.map((faq, idx) => (
                          <div
                            key={idx}
                            className="bg-white/50 backdrop-blur-sm p-1 rounded-4xl border border-[#DBC9C0]/30 transition-all duration-300 shadow-md hover:shadow-lg hover:border-[#DBC9C0]/60"
                          >
                            <button
                              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                              className="cursor-pointer w-full p-4 sm:p-5 flex items-center justify-between text-left focus:outline-none"
                              aria-expanded={openIndex === idx}
                            >
                              <span className="font-bold text-lg sm:text-lg text-[#520000] pr-4">{faq.q}</span>
                              <ChevronRight
                                size={20}
                                className={`flex-shrink-0 text-[#B0570C] transition-transform duration-300 ${
                                  openIndex === idx ? "rotate-90" : "rotate-0"
                                }`}
                              />
                            </button>
                            <div className={`grid transition-all duration-300 ease-in-out ${openIndex === idx ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                              <div className="overflow-hidden">
                                <p className="px-5 pb-5 text-sm sm:text-base text-gray-800 leading-relaxed">{faq.a}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  );
                }

                // Block 8
                if (article.id === "contact") {
                  return (
                    <section key={article.id} id={article.id} className="scroll-mt-24 sm:scroll-mt-32 animate-fade-in">
                      <h3 className="font-['Zalando_Sans_Expanded'] text-2xl sm:text-3xl font-black text-[#520000] mb-3 sm:mb-4">
                        {article.title}
                      </h3>
                      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] border border-[#DBC9C0]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8 shadow-sm">
                        <div className="w-full md:w-auto">
                          <h4 className="font-bold text-xl sm:text-xl text-slate-800 mb-2">Contact the Admin Team</h4>
                          <p className="text-gray-600 text-sm sm:text-base mb-5 sm:mb-6 md:max-w-sm">{article.content}</p>
                          <div className="space-y-2.5 sm:space-y-3">
                            <p className="flex items-center gap-2.5 sm:gap-3 text-sm sm:text-base text-orange-800 break-all">
                              <MessageSquare size={16} className="flex-shrink-0 text-[#B0570C]" /> {article.email}
                            </p>
                            <p className="flex items-center gap-2.5 sm:gap-3 text-sm sm:text-base text-orange-800">
                              <BookOpen size={16} className="flex-shrink-0 text-[#B0570C]" /> {article.office}
                            </p>
                          </div>
                        </div>
                        <a
                          href={`mailto:${article.email}?subject=Inquiry%20regarding%20BALIK%20Platform`}
                          className="inline-block cursor-pointer w-full md:w-auto px-6 sm:px-15 py-3.5 sm:py-4 bg-[#520000] hover:bg-[#3a0000] text-white text-center rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base shadow-xl shadow-[#520000]/20 transition-all hover:-translate-y-1"
                        >
                          Send a Message
                        </a>
                      </div>
                    </section>
                  );
                }

                return null;
              })
            ) : (
              <div className="bg-white rounded-[2.5rem] p-12 text-center border border-[#DBC9C0]/30 shadow-sm animate-fade-in">
                <div className="w-16 h-16 bg-orange-50 border border-orange-100 text-[#520000] flex items-center justify-center rounded-full mx-auto mb-4">
                  <HelpCircle size={28} />
                </div>
                <h4 className="font-bold text-xl text-slate-800 mb-2">No results matched your search</h4>
                <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                  We couldn't find any guides or FAQs matching "{searchQuery}". Try using different keywords or reset the track parameters.
                </p>
                <button 
                  onClick={() => setSearchQuery("")}
                  className="px-6 py-2.5 bg-[#520000] hover:bg-[#3a0000] text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Clear Search Keywords
                </button>
              </div>
            )}
          </article>
        </div>
      </div>

      <Footer />

      <style>{`
        html { overflow-y: overlay; }
        ::-webkit-scrollbar { width: 8px; }
        @media (min-width: 640px) { ::-webkit-scrollbar { width: 10px; } }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb {
          background: rgba(82, 0, 0, 0.22);
          border-radius: 999px;
          border: 2px solid transparent;
          background-clip: content-box;
          transition: all 0.3s ease;
        }
        ::-webkit-scrollbar-thumb:hover { background: rgba(82, 0, 0, 0.45); background-clip: content-box; }
        * { scrollbar-width: thin; scrollbar-color: rgba(82, 0, 0, 0.25) transparent; }
        
        .animate-fade-in {
          animation: fadeIn 0.35s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function Star({ size, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  );
}