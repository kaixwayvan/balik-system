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
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../shared/components/partials/Header";
import Footer from "../shared/components/partials/Footer";
import BALIKLogo from "../assets/BALIK.png";

export default function TermsOfUse() {
  useEffect(() => {
    document.title = "Terms of Service - BALIK";
  }, []);

  const [activeSection, setActiveSection] = useState("acceptance");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sections = [
    { id: "acceptance", title: "Acceptance of Terms", icon: ShieldCheck },
    { id: "purpose", title: "Purpose of Platform", icon: Eye },
    { id: "responsibilities", title: "User Responsibilities", icon: Users },
    { id: "verification", title: "Item Claiming & Verification", icon: Lock },
    { id: "accuracy", title: "System Accuracy", icon: Database },
    { id: "gamification", title: "Gamification Features", icon: Settings },
    { id: "account", title: "Account and Access", icon: Lock },
    { id: "liability", title: "Limitation of Liability", icon: ShieldCheck },
    { id: "prohibited", title: "Prohibited Activities", icon: Eye },
    { id: "termination", title: "Termination of Access", icon: Lock },
    { id: "changes", title: "Changes to Terms", icon: Bell },
    { id: "governing", title: "Governing Rules", icon: FileText },
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
          <div className="font-['Zalando_Sans_Expanded'] absolute top-[90px] md:top-[130px] left-[3%] md:left-[6%] lg:left-[2%] text-[75px] md:text-[100px] lg:text-[100px] font-black text-[#F0CFC2] transform rotate-0 md:-rotate-4 lg:-rotate-5 opacity-90 select-none tracking-tighter">
            TERMS
          </div>

          {/* Background Text "FOUND" */}
          <div
            className="font-['Zalando_Sans_Expanded'] absolute bottom-[-2px] md:bottom-[-10px] lg:bottom-[-10px] right-[4%] lg:right-[4%] md:right-[1%] -rotate-13 md:-rotate-2 lg:-rotate-0 text-[80px] lg:text-[110px] md:text-[90px] font-black text-[#F0CFC2] opacity-50 select-none tracking-tighter"
            style={{
              transform: "rotate(13deg)",
            }}
          >
            RULES
          </div>
        </div>

        {/* CONTENT */}
        <div className="relative z-10 text-center mt-4 md:mt-20 lg:mt-20 bg-white/10 backdrop-blur-2xl py-8 px-10 mx-12 lg:mx-0 md:mx-0 md:px-14 rounded-[3rem] border border-white/20 shadow-2xl shadow-black/10">
          <h1 className="font-['Zalando_Sans_Expanded'] text-5xl md:text-[54px] font-black tracking-tight text-[#333333] mb-3">
            Terms of Use
          </h1>
          <p className="font-['Plus_Jakarta_Sans'] text-[13px] lg:text-[19px] md:text-[19px] text-[#4a4a4a] max-w-2xl mx-auto font-normal">
            Rules and Guidelines for the BALIK Platform
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
                <X size={16}/>
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
                  <strong className="font-['Zalando_Sans_Expanded'] text-md animate-pulse">Live & Protected</strong>
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
                  Welcome to BALIK (Belongings Assistance Lost Item Keeper). By
                  accessing or using this platform, you agree to comply with and
                  be bound by the following Terms of Use.
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

            {/* 1. ACCEPTANCE OF TERMS */}
            <section id="acceptance" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">
                1. Acceptance of Terms
              </h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 leading-relaxed space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <p>By using BALIK, you confirm that you:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Are a member of the university (student, faculty, or staff),
                    or authorized user
                  </li>
                  <li>
                    Agree to follow all applicable university rules and
                    regulations
                  </li>
                  <li>Accept these Terms of Use in full</li>
                </ul>
                <p className="font-medium text-[#520000]">
                  If you do not agree, you must not use the platform.
                </p>
              </div>
            </section>

            {/* 2. PURPOSE OF PLATFORM */}
            <section id="purpose" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">
                2. Purpose of the Platform
              </h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <p className="mb-4">BALIK is designed to:</p>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>Assist users in reporting lost or found items</li>
                  <li>
                    Facilitate item recovery through smart matching and NLP
                  </li>
                  <li>
                    Promote responsible participation through gamification
                  </li>
                </ul>
                <p className="font-bold text-[#520000]">
                  BALIK serves as a facilitation tool, not a guarantee of item
                  recovery.
                </p>
              </div>
            </section>

            {/* 3. USER RESPONSIBILITIES */}
            <section id="responsibilities" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">
                3. User Responsibilities
              </h3>
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 shadow-sm">
                  <h4 className="font-bold text-[#520000] mb-2">
                    By using BALIK, you agree to:
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>
                      Provide accurate and truthful information when reporting
                      or claiming items
                    </li>
                    <li>Upload clear and appropriate descriptions or images</li>
                    <li>
                      Use the platform only for legitimate lost and found
                      purposes
                    </li>
                    <li>Respect other users and avoid misuse of the system</li>
                  </ul>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 shadow-sm">
                  <h4 className="font-bold text-red-700 mb-2">You must NOT:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Submit false claims or misleading information</li>
                    <li>Attempt to claim items that are not yours</li>
                    <li>
                      Use the system for fraudulent, harmful, or abusive
                      purposes
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 4. VERIFICATION */}
            <section id="verification" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">
                4. Item Claiming and Verification
              </h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 space-y-6 shadow-sm">
                <div>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      BALIK uses NLP and smart matching to suggest possible
                      matches
                    </li>
                    <li>
                      Users may be required to provide additional proof of
                      ownership
                    </li>
                    <li>Final verification may involve administrator review</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-[#DBC9C0]/30">
                  <p className="font-bold text-[#520000] mb-2">
                    BALIK reserves the right to:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Reject or cancel suspicious or unverifiable claims</li>
                    <li>
                      Request additional information before releasing items
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 5. ACCURACY */}
            <section id="accuracy" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">
                5. System Accuracy and Reliability
              </h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 space-y-6 shadow-sm">
                <div>
                  <p className="font-bold text-[#520000] mb-2">
                    BALIK utilizes advanced technologies, including:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Natural Language Processing (NLP)</li>
                    <li>Smart matching algorithms</li>
                    <li>Confidence scoring mechanisms</li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-[#520000] mb-2">
                    These are designed to:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Improve accuracy in matching lost and found items</li>
                    <li>Reduce the risk of incorrect claims</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-[#DBC9C0]/30">
                  <p className="font-bold text-[#520000] mb-2">However:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Matches are system-generated suggestions and may not
                      always be 100% accurate
                    </li>
                    <li>
                      Final decisions may still require human verification
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 6. GAMIFICATION */}
            <section id="gamification" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">
                6. Gamification Features
              </h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 space-y-6 shadow-sm">
                <div>
                  <p className="font-bold text-[#520000] mb-2">
                    BALIK may include:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Points, badges, or rewards for participation</li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-[#520000] mb-2">
                    These features:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Are intended for engagement purposes only</li>
                    <li>Do not carry monetary value</li>
                    <li>
                      Do not affect academic or official university records
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 7. ACCOUNT */}
            <section id="account" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">
                7. Account and Access
              </h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>
                    Users may be required to log in using university credentials
                  </li>
                  <li>
                    You are responsible for maintaining the confidentiality of
                    your account
                  </li>
                  <li>
                    Any activity under your account is your responsibility
                  </li>
                </ul>
                <p className="font-medium text-[#520000]">
                  BALIK may suspend or restrict access if misuse is detected.
                </p>
              </div>
            </section>

            {/* 8. LIABILITY */}
            <section id="liability" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">
                8. Limitation of Liability
              </h3>
              <div className="bg-[#520000] p-10 rounded-[2.5rem] text-white shadow-xl shadow-[#520000]/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2E4DC]/10 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3" />
                <div className="relative z-10">
                  <p className="mb-6 text-gray-200">
                    While BALIK strives to provide a reliable and efficient
                    system:
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-[#F2E4DC]" />
                      <p>BALIK does not guarantee the recovery of lost items</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-[#F2E4DC]" />
                      <p>
                        BALIK is not responsible for loss, damage, or incorrect
                        claims resulting from user actions
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-[#F2E4DC]" />
                      <p>
                        The system relies on user honesty and accurate reporting
                      </p>
                    </li>
                  </ul>
                  <p className="mt-8 text-sm text-gray-300 italic pt-4 border-t border-white/20">
                    However, BALIK implements safeguards (e.g., NLP matching and
                    verification processes) to minimize such risks.
                  </p>
                </div>
              </div>
            </section>

            {/* 9. PROHIBITED */}
            <section id="prohibited" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">
                9. Prohibited Activities
              </h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 space-y-6 shadow-sm">
                <div>
                  <p className="font-bold text-[#520000] mb-2">
                    Users are strictly prohibited from:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Attempting to hack, disrupt, or damage the system</li>
                    <li>Uploading harmful or inappropriate content</li>
                    <li>Impersonating another person</li>
                    <li>Exploiting system features for personal gain</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-[#DBC9C0]/30">
                  <p className="font-bold text-red-700 mb-2">
                    Violations may result in:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Account suspension</li>
                    <li>Reporting to university authorities</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 10. TERMINATION */}
            <section id="termination" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">
                10. Termination of Access
              </h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <p className="font-bold text-[#520000] mb-2">
                  BALIK reserves the right to:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Suspend or terminate user access for violations</li>
                  <li>Remove any content that violates these Terms</li>
                </ul>
              </div>
            </section>

            {/* 11. CHANGES */}
            <section id="changes" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">
                11. Changes to Terms
              </h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <p>
                  BALIK may update these Terms of Use at any time. Continued use
                  of the platform after updates means you accept the revised
                  terms.
                </p>
              </div>
            </section>

            {/* 12. GOVERNING */}
            <section id="governing" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">
                12. Governing Rules
              </h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <p className="font-bold text-[#520000] mb-2">
                  These Terms are subject to:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>University policies and regulations</li>
                  <li>Applicable local laws and data protection standards</li>
                </ul>
              </div>
            </section>

            {/* 13. CONTACT */}
            <section id="contact" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">
                13. Contact Information
              </h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 font-medium text-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <p>
                  For any concerns, requests, or questions regarding the site:
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