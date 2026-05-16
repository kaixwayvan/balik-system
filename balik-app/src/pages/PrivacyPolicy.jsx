import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  Lock,
  Eye,
  Users,
  Database,
  FileText,
  Settings,
  Bell,
  HelpCircle,
  ChevronRight,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../shared/components/partials/Header";
import Footer from "../shared/components/partials/Footer";
import BALIKLogo from "../assets/BALIK.png";

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy - BALIK";
  }, []);

  const [activeSection, setActiveSection] = useState("scope");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sections = [
    { id: "scope", title: "Scope of This Policy", icon: Eye },
    { id: "collection", title: "Information We Collect", icon: Database },
    { id: "usage", title: "How We Use Your Information", icon: Settings },
    { id: "legal", title: "Legal Basis for Processing", icon: ShieldCheck },
    { id: "sharing", title: "Data Sharing and Disclosure", icon: Users },
    { id: "retention", title: "Data Retention Policy", icon: Lock },
    { id: "security", title: "Data Security Measures", icon: ShieldCheck },
    { id: "rights", title: "User Rights and Control", icon: Settings },
    { id: "cookies", title: "Cookies and Tracking", icon: FileText },
    { id: "gamification", title: "Gamification & Automation", icon: Settings },
    { id: "thirdparty", title: "Third-Party Services", icon: Users },
    { id: "liability", title: "Limitations of Liability", icon: ShieldCheck },
    { id: "updates", title: "Updates to This Policy", icon: Bell },
    { id: "contact", title: "Contact Information", icon: HelpCircle },
  ];

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
    window.scrollTo({ top: 0, behavior: "smooth" });
    const handleScroll = () => {
      const sectionElements = sections.map((s) =>
        document.getElementById(s.id),
      );
      const scrollPosition = window.scrollY + 200;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && scrollPosition >= el.offsetTop) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDF8F5] font-sans text-slate-900 selection:bg-[#F2E4DC] selection:text-[#520000] overflow-x-hidden relative">
      <Header />
      {/* Top Header Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[100px] sm:h-[120px] md:h-[125px] lg:h-[130px] bg-white border-b border-[#B0570C]/40 overflow-hidden pointer-events-none z-40">
        <div className="absolute -top-10 left-[10%] w-[400px] h-[400px] bg-[#F2E4DC]/40 rounded-full blur-3xl"></div>

        <div className="absolute top-[-50px] right-[20%] w-[300px] h-[300px] bg-[#520000]/5 rounded-full blur-3xl"></div>

        {/* Polka dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(#520000 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }}
        ></div>
      </div>

      {/* HERO SECTION */}
      <div
        className="relative w-full h-[400px] bg-white/20 backdrop-blur-2xl overflow-hidden flex flex-col items-center justify-center pt-20 border-b border-gray-200"
        style={{
          backgroundColor: "#f4dcdc",
          backgroundImage: `
            radial-gradient(at 0% 0%, rgba(246, 143, 111, 0.56) 0px, transparent 50%), 
            radial-gradient(at 100% 0%, rgba(245, 167, 104, 0.26) 0px, transparent 50%),
            radial-gradient(at 50% 100%, rgb(250, 231, 213) 0px, transparent 80%),
            radial-gradient(at 100% 100%, rgba(252, 232, 220, 0.84) 0px, transparent 50%)
          `,
        }}
      >
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Top Left Shape */}
          <div
            className="absolute top-[-10px] left-[-20px] md:left-[-40px] lg:w-[600px] md:w-[500px] h-[300px] bg-[#F0D5C9] rounded-[50px] rotate-[-10deg] md:rotate-[-5deg] shadow-inner"
            style={{ clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)" }}
          ></div>

          {/* Bottom Right Shape */}
          <div
            className="absolute bottom-[-90px] md:bottom-[-150px] right-[-50px] lg:w-[600px] md:w-[500px]  h-[300px] bg-[#F2DBD0] rounded-[60px] shadow-inner opacity-90"
            style={{
              clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)",
              transform: "rotate(193deg)",
            }}
          ></div>

          {/* Background Text "LOST" */}
          <div className="font-['Zalando_Sans_Expanded'] absolute top-[80px] md:top-[130px] left-[10%] md:left-[6%] lg:left-[6%] text-[100px] font-black text-[#F0CFC2] transform rotate-0 md:-rotate-4 lg:-rotate-5 opacity-90 select-none tracking-tighter">
            LOST
          </div>

          {/* Background Text "FOUND" */}
          <div
            className="font-['Zalando_Sans_Expanded'] absolute bottom-[-2px] md:bottom-[-10px] lg:bottom-[-10px] right-[4%] lg:right-[10%] md:right-[1%] -rotate-13 md:-rotate-2 lg:-rotate-0 text-[80px] lg:text-[110px] md:text-[90px] font-black text-[#F0CFC2] opacity-50 select-none tracking-tighter"
            style={{
              transform: "rotate(13deg)",
            }}
          >
            FOUND
          </div>
        </div>

        {/* CONTENT */}
        <div className="relative z-10 text-center mt-4 md:mt-20 lg:mt-20 bg-white/10 backdrop-blur-2xl py-8 px-10 mx-12 lg:mx-0 md:mx-0 md:px-14 rounded-[3rem] border border-white/20 shadow-2xl shadow-black/10">
          <h1 className="font-['Zalando_Sans_Expanded'] text-5xl md:text-[54px] font-black tracking-tight text-[#333333] mb-3">
            Privacy Policy
          </h1>
          <p className="font-['Plus_Jakarta_Sans'] text-[13px] lg:text-[19px] md:text-[19px] text-[#4a4a4a] max-w-2xl mx-auto font-normal">
            Keeping Your Information Safe and Secure
          </p>
        </div>
      </div>

      {/* MOBILE TOC BUTTON */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="cursor-pointer lg:hidden fixed bottom-6 right-6 z-99 bg-[#520000] text-white p-4 rounded-full shadow-2xl shadow-[#520000]/30 hover:scale-105 transition-all"
      >
        <Menu size={24} />
      </button>

      <div className="font-['Plus_Jakarta_Sans'] container mx-auto px-6 py-12 relative">
        <div className="flex flex-col lg:flex-row gap-16 relative">
          {/* FULL HEIGHT SIDEBAR (LEFT SIDE) */}
          <div
            onClick={() => setSidebarOpen(false)}
            className={`lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-100 transition-all duration-300 ${
              sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          />

          {/* SIDEBAR */}
          <aside
            className={`
              fixed lg:sticky
              top-0 lg:top-32
              left-0
              h-screen lg:h-fit
              w-[85%] max-w-[340px] lg:w-80
              z-101
              bg-[#FDF8F5]/95
              backdrop-blur-2xl
              border-r lg:border border-[#DBC9C0]/40
              shadow-2xl lg:shadow-xl
              overflow-y-auto
              transition-transform duration-500 ease-out
              rounded-r-[2rem] lg:rounded-[2rem]
              p-2 pr-5
              overflow-x-hidden
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
          >
            {/* HEADER */}
            <div className="p-6 pb-3 flex items-center justify-between">
              <p className="text-[10px] font-black text-[#520000]/40 uppercase tracking-[0.2em]">
                On this page
              </p>

              <button
                onClick={() => setSidebarOpen(false)}
                className="cursor-pointer lg:hidden w-8 h-8 rounded-full hover:bg-[#520000]/10 flex items-center justify-center text-[#520000] transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* NAVIGATION */}
            <nav className="space-y-1 px-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    scrollToSection(section.id);
                    setSidebarOpen(false);
                  }}
                  className={`cursor-pointer w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 transform ${
                    activeSection === section.id
                      ? "bg-[#520000] text-white shadow-lg shadow-[#520000]/20 translate-x-2"
                      : "text-gray-600 hover:text-[#520000] hover:bg-white hover:translate-x-1"
                  }`}
                >
                  <section.icon
                    size={16}
                    className={
                      activeSection === section.id
                        ? "opacity-100"
                        : "opacity-40"
                    }
                  />

                  <span className="text-left leading-tight">
                    {section.title}
                  </span>
                </button>
              ))}
            </nav>

            {/* FOOTER CARD */}
            <div className="mt-6 p-6 pt-7 border-t border-[#F2E4DC]">
              <div className="bg-white p-4 rounded-2xl border border-[#DBC9C0]/30">
                <p className="text-[10px] font-semibold text-[#520000]/40 uppercase tracking-widest mb-2">
                  Protocol Status
                </p>

                <div className="flex items-center gap-2 text-green-700 font-bold text-xs uppercase">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <strong className="font-['Zalando_Sans_Expanded'] text-md animate-pulse">
                    Live & Protected
                  </strong>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <article className="flex-1 max-w-4xl space-y-24 pb-32">
            {/* INTRODUCTION CARD */}
            <section className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-[#DBC9C0]/30">
              <h2 className="text-3xl md:text-4xl text-[#520000] mb-8 leading-tight">
                <strong className="font-black">BALIK</strong>: Belongings
                Assistance Lost Item Keeper
              </h2>
              <div className="space-y-6 text-lg leading-relaxed text-gray-700">
                <p>
                  BALIK <em>(Belongings Assistance Lost Item Keeper)</em> is a
                  university-based lost and found management system designed to
                  assist students, faculty, and staff in reporting, tracking,
                  and recovering lost items. The platform utilizes technologies
                  such as natural language processing (NLP), smart matching
                  algorithms, and gamification features to improve the
                  efficiency and user experience of the lost and found process.
                </p>
                <p>
                  This Privacy Policy outlines how BALIK collects, uses, stores,
                  and protects user information in compliance with applicable
                  data protection standards and university policies.
                </p>
              </div>
              <div className="mt-12 pt-10 border-t border-[#F2E4DC]/50 flex items-center justify-between">
                <div className="text-sm font-bold text-gray-400">
                  Effective Date : 2026
                </div>
                <div className="flex items-center gap-2 text-[#520000] font-bold text-sm">
                  <CheckCircle2 size={18} /> Verified Secure
                </div>
              </div>
            </section>

            {/* 1. SCOPE */}
            <section id="scope" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">
                1. Scope of This Policy
              </h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 leading-relaxed space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <p>This Privacy Policy applies to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    All users of the BALIK platform (students, faculty, staff,
                    and administrators)
                  </li>
                  <li>
                    All data collected through the BALIK website or system
                  </li>
                  <li>
                    All interactions including reporting, claiming, matching,
                    and communication
                  </li>
                </ul>
                <p className="font-medium text-[#520000]">
                  By accessing or using BALIK, you agree to the terms outlined
                  in this policy.
                </p>
              </div>
            </section>

            {/* 2. COLLECTION */}
            <section id="collection" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">
                2. Information We Collect
              </h3>
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 shadow-sm">
                  <h4 className="font-bold text-[#520000] mb-2">
                    a. Personal Identification Information
                  </h4>
                  <p className="text-gray-700 mb-2">We may collect:</p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Full name (optional)</li>
                    <li>Email address (optional)</li>
                    <li>Contact number (optional)</li>
                    <li>User role (e.g., student, faculty, staff)</li>
                  </ul>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 shadow-sm">
                  <h4 className="font-bold text-[#520000] mb-2">
                    b. Lost and Found Submission Data
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Item descriptions (text input processed via NLP)</li>
                    <li>Uploaded photos or media files</li>
                    <li>Date, time, and location of loss or discovery</li>
                    <li>Category and tags associated with items</li>
                  </ul>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 shadow-sm">
                  <h4 className="font-bold text-[#520000] mb-2">
                    c. System and Technical Data
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>IP address</li>
                    <li>Device type and browser information</li>
                    <li>
                      Log data (timestamps, access logs, system interactions)
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 shadow-sm">
                  <h4 className="font-bold text-[#520000] mb-2">
                    d. Generated and Derived Data
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>
                      Matching results generated by smart matching algorithms
                    </li>
                    <li>Confidence scores or similarity metrics</li>
                    <li>
                      Gamification data (points, badges, activity history)
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 3. USAGE */}
            <section id="usage" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">
                3. How We Use Your Information
              </h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 space-y-6 shadow-sm">
                <p>BALIK uses collected data for the following purposes:</p>
                <div>
                  <h4 className="font-bold text-[#520000] mb-2">
                    a. Core Functionality
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      To match lost and found items using NLP and intelligent
                      algorithms
                    </li>
                    <li>To verify ownership of items before release</li>
                    <li>
                      To manage item reports, claims, and resolution processes
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-[#520000] mb-2">
                    b. Communication
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>To notify users about potential matches</li>
                    <li>To send updates regarding claims or item status</li>
                    <li>To respond to user inquiries and support requests</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-[#520000] mb-2">
                    c. System Improvement
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      To enhance matching accuracy and algorithm performance
                    </li>
                    <li>To analyze user behavior for system optimization</li>
                    <li>To improve user interface and overall experience</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-[#520000] mb-2">
                    d. Engagement and Gamification
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      To award points, badges, or recognition for participation
                    </li>
                    <li>
                      To encourage responsible reporting and claiming behavior
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 4. LEGAL BASIS */}
            <section id="legal" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">
                4. Legal Basis for Processing
              </h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <p className="mb-2">Data is processed based on:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>User consent upon using the platform</li>
                  <li>
                    Legitimate interest in maintaining a secure and functional
                    lost and found system
                  </li>
                  <li>
                    Compliance with university regulations and administrative
                    requirements
                  </li>
                </ul>
              </div>
            </section>

            {/* 5. SHARING */}
            <section id="sharing" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">
                5. Data Sharing and Disclosure
              </h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 space-y-6 shadow-sm">
                <p>
                  BALIK does not sell or commercially distribute personal data.
                  Data may be shared under the following conditions:
                </p>
                <div>
                  <h4 className="font-bold text-[#520000] mb-2">
                    a. Internal Access
                  </h4>
                  <p>
                    Authorized BALIK administrators and university personnel
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-[#520000] mb-2">
                    b. Limited User Sharing
                  </h4>
                  <p>
                    Necessary details shared between users for verification of
                    item ownership
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-[#520000] mb-2">
                    c. Legal Obligations
                  </h4>
                  <p>
                    When required by law, regulation, or official university
                    request
                  </p>
                </div>
              </div>
            </section>

            {/* 6. RETENTION */}
            <section id="retention" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">
                6. Data Retention Policy
              </h3>
              <div className="bg-[#520000] p-10 rounded-[2.5rem] text-white shadow-xl shadow-[#520000]/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2E4DC]/10 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3" />
                <div className="relative z-10">
                  <p className="mb-6 text-gray-200">
                    BALIK retains data only for as long as necessary:
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-[#F2E4DC]" />
                      <p>
                        <strong className="text-[#F2E4DC]">
                          Unclaimed item reports:
                        </strong>{" "}
                        retained for [3–6 months or as defined]
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-[#F2E4DC]" />
                      <p>
                        <strong className="text-[#F2E4DC]">
                          Claimed item records:
                        </strong>{" "}
                        archived for documentation and audit purposes
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-[#F2E4DC]" />
                      <p>
                        <strong className="text-[#F2E4DC]">System logs:</strong>{" "}
                        retained for security and monitoring
                      </p>
                    </li>
                  </ul>
                  <p className="mt-8 text-sm text-gray-300 italic pt-4 border-t border-white/20">
                    Data may be deleted, anonymized, or archived after the
                    retention period.
                  </p>
                </div>
              </div>
            </section>

            {/* 7. SECURITY */}
            <section id="security" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">
                7. Data Security Measures
              </h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <p className="mb-4">
                  We implement reasonable safeguards, including:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>
                    Secure servers and encrypted data transmission (if
                    applicable)
                  </li>
                  <li>Access control and role-based permissions</li>
                  <li>Regular system monitoring and updates</li>
                </ul>
                <p className="text-sm italic">
                  Despite these measures, users acknowledge that no digital
                  system is completely secure.
                </p>
              </div>
            </section>

            {/* 8. RIGHTS */}
            <section id="rights" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">
                8. User Rights and Control
              </h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <p className="mb-4">Users have the right to:</p>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>Access their personal data stored in the system</li>
                  <li>Request correction of inaccurate or incomplete data</li>
                  <li>
                    Request deletion of their data, subject to system and policy
                    limitations
                  </li>
                  <li>Withdraw consent where applicable</li>
                </ul>
                <p className="font-medium text-[#520000]">
                  Requests may be submitted through the BALIK support channel.
                </p>
              </div>
            </section>

            {/* 9. COOKIES */}
            <section id="cookies" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">
                9. Cookies and Tracking Technologies
              </h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <p className="mb-4">
                  BALIK may use cookies or similar technologies to:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>Maintain login sessions</li>
                  <li>Track system usage and analytics</li>
                  <li>Improve platform performance</li>
                </ul>
                <p>
                  Users may disable cookies through browser settings, though
                  some features may be affected.
                </p>
              </div>
            </section>

            {/* 10. GAMIFICATION */}
            <section id="gamification" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">
                10. Gamification and Automated Processing
              </h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <p className="mb-4">
                  BALIK incorporates gamification and automated systems:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>
                    Points and badges are awarded based on participation and
                    activity
                  </li>
                  <li>
                    Automated matching is performed using NLP and smart
                    algorithms
                  </li>
                  <li>
                    These systems assist decision-making but do not replace
                    administrative verification
                  </li>
                </ul>
                <p className="font-medium text-[#520000]">
                  Gamification does not impact academic evaluation or official
                  university records.
                </p>
              </div>
            </section>

            {/* 11. THIRD-PARTY */}
            <section id="thirdparty" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">
                11. Third-Party Services
              </h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <p className="mb-4">
                  BALIK may utilize third-party services such as:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>Cloud hosting providers</li>
                  <li>Analytics tools</li>
                  <li>Communication platforms</li>
                </ul>
                <p>
                  These providers are required to follow appropriate data
                  protection standards.
                </p>
              </div>
            </section>

            {/* 12. LIABILITY */}
            <section id="liability" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">
                12. Limitations of Liability
              </h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 space-y-4 shadow-sm">
                <p>
                  BALIK serves as a facilitation platform and incorporates
                  advanced technologies to improve reliability:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Utilizes Natural Language Processing (NLP) and smart
                    matching algorithms to significantly reduce the risk of
                    misclaimed items
                  </li>
                  <li>
                    Implements verification processes and confidence-based
                    matching to support accurate item ownership validation
                  </li>
                  <li>
                    Provides administrative oversight to review and confirm
                    claims when necessary
                  </li>
                </ul>
                <p className="font-bold mt-4">
                  While BALIK is designed to be highly reliable and to minimize
                  errors, absolute guarantees cannot be ensured in all cases.
                  Users are still expected to provide accurate and honest
                  information when reporting or claiming items.
                </p>
              </div>
            </section>

            {/* 13. UPDATES */}
            <section id="updates" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">
                13. Updates to This Privacy Policy
              </h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <p>
                  BALIK reserves the right to modify this Privacy Policy at any
                  time. Updates will be posted within the platform, and
                  continued use signifies acceptance of the revised terms.
                </p>
              </div>
            </section>

            {/* 14. CONTACT */}
            <section id="contact" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">
                14. Contact Information
              </h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 font-medium text-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <p>
                  For any concerns, requests, or questions regarding your data:
                </p>
                <div className="bg-gray-50/80 p-6 rounded-2xl max-w-md mx-auto text-left mt-8 mb-8 border border-gray-100">
                  <p className="font-black text-[#520000] mb-2">
                    BALIK Support Team
                  </p>
                  <p className="text-gray-600">
                    Email:{" "}
                    <a
                      href="mailto:[lostandfound@university.edu]"
                      className="text-[#b89060] font-bold hover:underline"
                    >
                      lostandfound@university.edu
                    </a>
                  </p>
                  <p className="text-gray-600 mt-1">
                    University: Polytechnic University of the Philippines - Main
                    Campus
                  </p>
                </div>
                <p className="italic text-center font-bold text-[#520000]">
                  By using BALIK, you acknowledge that you have read,
                  understood, and agreed to this Privacy Policy.
                </p>
              </div>
            </section>
          </article>
        </div>
      </div>

      {/* FOOTER IMPORTED FROM PARTIALS */}
      <Footer />

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        /* Smooth overlay scrollbar */
        html {
          overflow-y: overlay;
        }

        /* Webkit browsers */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(82, 0, 0, 0.22);
          border-radius: 999px;
          border: 3px solid transparent;
          background-clip: content-box;
          transition: all 0.3s ease;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(82, 0, 0, 0.45);
          background-clip: content-box;
        }

        /* Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(82, 0, 0, 0.25) transparent;
        }
      `}</style>
    </div>
  );
}

// Sub-components
function UserPen({ size, className }) {
  return <Database size={size} className={className} />;
}
function Package({ size, className }) {
  return <FileText size={size} className={className} />;
}
function Monitor({ size, className }) {
  return <Settings size={size} className={className} />;
}
function Zap({ size, className }) {
  return <Bell size={size} className={className} />;
}