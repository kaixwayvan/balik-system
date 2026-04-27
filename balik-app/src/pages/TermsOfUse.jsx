import React, { useEffect, useState } from 'react';
import { ShieldCheck, Lock, Eye, Users, Database, FileText, Settings, Bell, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Link } from "react-router-dom";
import Footer from '../shared/components/partials/Footer';
import BALIKLogo from '../assets/BALIK.png';

export default function TermsOfUse() {
  const [activeSection, setActiveSection] = useState('acceptance');

  const sections = [
    { id: 'acceptance', title: 'Acceptance of Terms', icon: ShieldCheck },
    { id: 'purpose', title: 'Purpose of Platform', icon: Eye },
    { id: 'responsibilities', title: 'User Responsibilities', icon: Users },
    { id: 'verification', title: 'Item Claiming & Verification', icon: Lock },
    { id: 'accuracy', title: 'System Accuracy', icon: Database },
    { id: 'gamification', title: 'Gamification Features', icon: Settings },
    { id: 'account', title: 'Account and Access', icon: Lock },
    { id: 'liability', title: 'Limitation of Liability', icon: ShieldCheck },
    { id: 'prohibited', title: 'Prohibited Activities', icon: Eye },
    { id: 'termination', title: 'Termination of Access', icon: Lock },
    { id: 'changes', title: 'Changes to Terms', icon: Bell },
    { id: 'governing', title: 'Governing Rules', icon: FileText },
    { id: 'contact', title: 'Contact Information', icon: HelpCircle },
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
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const handleScroll = () => {
      const sectionElements = sections.map(s => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && scrollPosition >= el.offsetTop) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDF8F5] font-sans text-slate-900 selection:bg-[#F2E4DC] selection:text-[#520000] overflow-x-hidden relative">

      {/* CUSTOM HEADER FOR TERMS OF USE */}
      <header className="absolute top-0 left-0 w-full z-50">
        <nav className="w-full flex items-center justify-between px-10 py-5 border-b border-gray-400 bg-transparent">
          {/* Logo */}
          <Link to="/">
            <img src={BALIKLogo} alt="BALIK Logo" className="h-30 hover:opacity-80 transition-opacity" />
          </Link>

          {/* Links + Button */}
          <div className="flex items-center gap-10">
            <Link
              to="/"
              className="text-[14px] font-black text-[#2a2a2a] hover:text-[#b89060] transition-colors tracking-[0.1em]"
            >
              HOME
            </Link>
            <Link
              to="/comingsoon"
              className="text-[14px] font-black text-[#2a2a2a] hover:text-[#b89060] transition-colors tracking-[0.1em]"
            >
              ABOUT
            </Link>
            <Link
              to="/#footer"
              className="text-[14px] font-black text-[#2a2a2a] hover:text-[#b89060] transition-colors tracking-[0.1em]"
            >
              CONTACT
            </Link>
            <Link
              to="/#faq"
              className="text-[14px] font-black text-[#2a2a2a] hover:text-[#b89060] transition-colors tracking-[0.1em]"
            >
              LEARN MORE
            </Link>
            <Link
              to="/login"
              className="text-[14px] font-bold text-[#b89060] border-[1.5px] border-[#b89060] px-7 py-2 rounded-full hover:bg-[#b89060] hover:text-white transition-all tracking-[0.1em] ml-2"
            >
              LOG IN
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO SECTION */}
      <div className="relative w-full h-[350px] overflow-hidden flex flex-col items-center justify-center pt-20 z-10 bg-white border-b border-gray-300">

        {/* Decorative Background Elements (Mimicking Puzzle Image) */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Top Left Puzzle Piece / Shape */}
          <div className="absolute top-[-50px] left-[-20px] w-[600px] h-[300px] bg-[#d9d4f0] rounded-[50px] rotate-[-10deg] shadow-inner opacity-80" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0% 100%)' }}></div>

          {/* Bottom Right Puzzle Piece / Shape */}
          <div className="absolute bottom-[-100px] right-[-50px] w-[700px] h-[300px] bg-[#d9d4f0] rounded-[60px] shadow-inner opacity-80" style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0% 100%)' }}></div>

          {/* Additional subtle white shapes for depth */}
          <div className="absolute top-[20px] right-[10%] w-[300px] h-[150px] bg-white rounded-full opacity-50 shadow-md"></div>

          {/* Background Text "TERMS" */}
          <div className="absolute top-[40px] left-[15%] text-[100px] font-black text-white transform -rotate-12 opacity-90 drop-shadow-md select-none tracking-tighter">
            TERMS
          </div>

          {/* Background Text "RULES" */}
          <div className="absolute bottom-[20px] right-[15%] text-[110px] font-black text-white opacity-90 drop-shadow-md select-none tracking-tighter">
            RULES
          </div>
        </div>

        <div className="relative z-10 text-center px-6 mt-12 bg-white/40 backdrop-blur-[2px] py-6 px-12 rounded-3xl">
          <h1 className="text-5xl md:text-[54px] font-black tracking-tight text-[#333333] mb-3 drop-shadow-sm">
            Terms of Use
          </h1>
          <p className="text-[19px] text-[#4a4a4a] max-w-2xl mx-auto font-normal">
            Rules and Guidelines for the BALIK Platform
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 relative">

          {/* MAIN CONTENT AREA */}
          <article className="flex-1 max-w-4xl space-y-24 pb-32">

            {/* INTRODUCTION CARD */}
            <section className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-[#DBC9C0]/30">
              <h2 className="text-3xl md:text-4xl font-black text-[#520000] mb-8 leading-tight italic">
                BALIK: Belongings Assistance Lost Item Keeper
              </h2>
              <div className="space-y-6 text-lg leading-relaxed text-gray-700">
                <p>
                  Welcome to BALIK (Belongings Assistance Lost Item Keeper). By accessing or using this platform, you agree to comply with and be bound by the following Terms of Use.
                </p>
              </div>
              <div className="mt-12 pt-10 border-t border-[#F2E4DC]/50 flex items-center justify-between">
                <div className="text-sm font-bold text-gray-400">Effective Date : 2026</div>
                <div className="flex items-center gap-2 text-[#520000] font-bold text-sm">
                  <CheckCircle2 size={18} /> Verified Secure
                </div>
              </div>
            </section>

            {/* 1. ACCEPTANCE OF TERMS */}
            <section id="acceptance" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">1. Acceptance of Terms</h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 leading-relaxed space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <p>By using BALIK, you confirm that you:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Are a member of the university (student, faculty, or staff), or authorized user</li>
                  <li>Agree to follow all applicable university rules and regulations</li>
                  <li>Accept these Terms of Use in full</li>
                </ul>
                <p className="font-medium text-[#520000]">If you do not agree, you must not use the platform.</p>
              </div>
            </section>

            {/* 2. PURPOSE OF PLATFORM */}
            <section id="purpose" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">2. Purpose of the Platform</h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <p className="mb-4">BALIK is designed to:</p>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>Assist users in reporting lost or found items</li>
                  <li>Facilitate item recovery through smart matching and NLP</li>
                  <li>Promote responsible participation through gamification</li>
                </ul>
                <p className="font-bold text-[#520000]">BALIK serves as a facilitation tool, not a guarantee of item recovery.</p>
              </div>
            </section>

            {/* 3. USER RESPONSIBILITIES */}
            <section id="responsibilities" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">3. User Responsibilities</h3>
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 shadow-sm">
                  <h4 className="font-bold text-[#520000] mb-2">By using BALIK, you agree to:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Provide accurate and truthful information when reporting or claiming items</li>
                    <li>Upload clear and appropriate descriptions or images</li>
                    <li>Use the platform only for legitimate lost and found purposes</li>
                    <li>Respect other users and avoid misuse of the system</li>
                  </ul>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 shadow-sm">
                  <h4 className="font-bold text-red-700 mb-2">You must NOT:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Submit false claims or misleading information</li>
                    <li>Attempt to claim items that are not yours</li>
                    <li>Use the system for fraudulent, harmful, or abusive purposes</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 4. VERIFICATION */}
            <section id="verification" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">4. Item Claiming and Verification</h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 space-y-6 shadow-sm">
                <div>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>BALIK uses NLP and smart matching to suggest possible matches</li>
                    <li>Users may be required to provide additional proof of ownership</li>
                    <li>Final verification may involve administrator review</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-[#DBC9C0]/30">
                  <p className="font-bold text-[#520000] mb-2">BALIK reserves the right to:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Reject or cancel suspicious or unverifiable claims</li>
                    <li>Request additional information before releasing items</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 5. ACCURACY */}
            <section id="accuracy" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">5. System Accuracy and Reliability</h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 space-y-6 shadow-sm">
                <div>
                  <p className="font-bold text-[#520000] mb-2">BALIK utilizes advanced technologies, including:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Natural Language Processing (NLP)</li>
                    <li>Smart matching algorithms</li>
                    <li>Confidence scoring mechanisms</li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-[#520000] mb-2">These are designed to:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Improve accuracy in matching lost and found items</li>
                    <li>Reduce the risk of incorrect claims</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-[#DBC9C0]/30">
                  <p className="font-bold text-[#520000] mb-2">However:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Matches are system-generated suggestions and may not always be 100% accurate</li>
                    <li>Final decisions may still require human verification</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 6. GAMIFICATION */}
            <section id="gamification" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">6. Gamification Features</h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 space-y-6 shadow-sm">
                <div>
                  <p className="font-bold text-[#520000] mb-2">BALIK may include:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Points, badges, or rewards for participation</li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-[#520000] mb-2">These features:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Are intended for engagement purposes only</li>
                    <li>Do not carry monetary value</li>
                    <li>Do not affect academic or official university records</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 7. ACCOUNT */}
            <section id="account" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">7. Account and Access</h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>Users may be required to log in using university credentials</li>
                  <li>You are responsible for maintaining the confidentiality of your account</li>
                  <li>Any activity under your account is your responsibility</li>
                </ul>
                <p className="font-medium text-[#520000]">BALIK may suspend or restrict access if misuse is detected.</p>
              </div>
            </section>

            {/* 8. LIABILITY */}
            <section id="liability" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">8. Limitation of Liability</h3>
              <div className="bg-[#520000] p-10 rounded-[2.5rem] text-white shadow-xl shadow-[#520000]/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2E4DC]/10 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3" />
                <div className="relative z-10">
                  <p className="mb-6 text-gray-200">While BALIK strives to provide a reliable and efficient system:</p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-[#F2E4DC]" />
                      <p>BALIK does not guarantee the recovery of lost items</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-[#F2E4DC]" />
                      <p>BALIK is not responsible for loss, damage, or incorrect claims resulting from user actions</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-[#F2E4DC]" />
                      <p>The system relies on user honesty and accurate reporting</p>
                    </li>
                  </ul>
                  <p className="mt-8 text-sm text-gray-300 italic pt-4 border-t border-white/20">However, BALIK implements safeguards (e.g., NLP matching and verification processes) to minimize such risks.</p>
                </div>
              </div>
            </section>

            {/* 9. PROHIBITED */}
            <section id="prohibited" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">9. Prohibited Activities</h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 space-y-6 shadow-sm">
                <div>
                  <p className="font-bold text-[#520000] mb-2">Users are strictly prohibited from:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Attempting to hack, disrupt, or damage the system</li>
                    <li>Uploading harmful or inappropriate content</li>
                    <li>Impersonating another person</li>
                    <li>Exploiting system features for personal gain</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-[#DBC9C0]/30">
                  <p className="font-bold text-red-700 mb-2">Violations may result in:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Account suspension</li>
                    <li>Reporting to university authorities</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 10. TERMINATION */}
            <section id="termination" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">10. Termination of Access</h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <p className="font-bold text-[#520000] mb-2">BALIK reserves the right to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Suspend or terminate user access for violations</li>
                  <li>Remove any content that violates these Terms</li>
                </ul>
              </div>
            </section>

            {/* 11. CHANGES */}
            <section id="changes" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">11. Changes to Terms</h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <p>BALIK may update these Terms of Use at any time. Continued use of the platform after updates means you accept the revised terms.</p>
              </div>
            </section>

            {/* 12. GOVERNING */}
            <section id="governing" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">12. Governing Rules</h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <p className="font-bold text-[#520000] mb-2">These Terms are subject to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>University policies and regulations</li>
                  <li>Applicable local laws and data protection standards</li>
                </ul>
              </div>
            </section>

            {/* 13. CONTACT */}
            <section id="contact" className="scroll-mt-32">
              <div className="bg-white rounded-[2.5rem] p-12 text-center border border-[#DBC9C0]/20 shadow-xl shadow-[#520000]/[0.03] relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#F2E4DC]/50 rounded-full blur-3xl opacity-50" />
                <h3 className="text-3xl font-black text-[#520000] mb-6">13. Contact Information</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-8 font-medium text-lg leading-relaxed">
                  For questions or concerns:
                </p>
                <div className="bg-gray-50/80 p-6 rounded-2xl max-w-md mx-auto text-left mb-8 border border-gray-100">
                  <p className="font-black text-[#520000] mb-2">BALIK Support Team</p>
                  <p className="text-gray-600">Email: <a href="mailto:[lostandfound@university.edu]" className="text-[#b89060] font-bold hover:underline">lostandfound@university.edu</a></p>
                  <p className="text-gray-600 mt-1">University: Polytechnic University of the Philippines - Main Campus</p>
                </div>
                <p className="italic font-bold text-[#520000]">By using BALIK, you acknowledge that you have read, understood, and agreed to these Terms of Use.</p>
              </div>
            </section>

          </article>

          {/* STICKY SIDEBAR */}
          <aside className="lg:w-80 flex-shrink-0 lg:sticky lg:top-32 h-fit order-first lg:order-last">
            <div className="bg-[#F2E4DC]/40 backdrop-blur-md rounded-[2rem] border border-[#F2E4DC] p-2 shadow-xl shadow-slate-200/30">
              <div className="p-6 pb-2">
                <p className="text-[10px] font-black text-[#520000]/40 uppercase tracking-[0.2em] mb-4">On this page</p>
              </div>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${activeSection === section.id
                      ? 'bg-[#520000] text-white shadow-lg shadow-[#520000]/20 translate-x-1'
                      : 'text-gray-600 hover:text-[#520000] hover:bg-white/50'
                      }`}
                  >
                    <section.icon size={16} className={`${activeSection === section.id ? 'opacity-100' : 'opacity-40'}`} />
                    {section.title}
                  </button>
                ))}
              </nav>
              <div className="mt-6 p-6 pt-4 border-t border-[#F2E4DC]">
                <div className="bg-white/50 p-4 rounded-2xl border border-[#DBC9C0]/30">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Protocol Status</p>
                  <div className="flex items-center gap-2 text-green-700 font-bold text-xs uppercase">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live & Enforced
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* FOOTER IMPORTED FROM PARTIALS */}
      <Footer />

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #FDF8F5;
        }
        ::-webkit-scrollbar-thumb {
          background: #DBC9C0;
          border-radius: 10px;
          border: 2px solid #FDF8F5;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #cbb5aa;
        }
      `}</style>
    </div>
  );
}
