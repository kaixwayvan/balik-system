import React, { useEffect, useState } from 'react';
import { ShieldCheck, Lock, Eye, Users, Database, FileText, Settings, Bell, HelpCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Link } from "react-router-dom";
import Footer from '../shared/components/partials/Footer';
import BALIKLogo from '../assets/BALIK.png';

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('scope');

  const sections = [
    { id: 'scope', title: 'Scope of This Policy', icon: Eye },
    { id: 'collection', title: 'Information We Collect', icon: Database },
    { id: 'usage', title: 'How We Use Your Information', icon: Settings },
    { id: 'legal', title: 'Legal Basis for Processing', icon: ShieldCheck },
    { id: 'sharing', title: 'Data Sharing and Disclosure', icon: Users },
    { id: 'retention', title: 'Data Retention Policy', icon: Lock },
    { id: 'security', title: 'Data Security Measures', icon: ShieldCheck },
    { id: 'rights', title: 'User Rights and Control', icon: Settings },
    { id: 'cookies', title: 'Cookies and Tracking', icon: FileText },
    { id: 'gamification', title: 'Gamification & Automation', icon: Settings },
    { id: 'thirdparty', title: 'Third-Party Services', icon: Users },
    { id: 'liability', title: 'Limitations of Liability', icon: ShieldCheck },
    { id: 'updates', title: 'Updates to This Policy', icon: Bell },
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

      {/* CUSTOM HEADER FOR PRIVACY POLICY */}
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

          {/* Background Text "LOST" */}
          <div className="absolute top-[40px] left-[15%] text-[100px] font-black text-white transform -rotate-12 opacity-90 drop-shadow-md select-none tracking-tighter">
            LOST
          </div>

          {/* Background Text "FOUND" */}
          <div className="absolute bottom-[20px] right-[15%] text-[110px] font-black text-white opacity-90 drop-shadow-md select-none tracking-tighter">
            FOUND
          </div>
        </div>

        <div className="relative z-10 text-center px-6 mt-12 bg-white/40 backdrop-blur-[2px] py-6 px-12 rounded-3xl">
          <h1 className="text-5xl md:text-[54px] font-black tracking-tight text-[#333333] mb-3 drop-shadow-sm">
            Privacy Policy
          </h1>
          <p className="text-[19px] text-[#4a4a4a] max-w-2xl mx-auto font-normal">
            Keeping Your Information Safe and Secure
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
                  BALIK (Belongings Assistance Lost Item Keeper) is a university-based lost and found management system designed to assist students, faculty, and staff in reporting, tracking, and recovering lost items. The platform utilizes technologies such as natural language processing (NLP), smart matching algorithms, and gamification features to improve the efficiency and user experience of the lost and found process.
                </p>
                <p>
                  This Privacy Policy outlines how BALIK collects, uses, stores, and protects user information in compliance with applicable data protection standards and university policies.
                </p>
              </div>
              <div className="mt-12 pt-10 border-t border-[#F2E4DC]/50 flex items-center justify-between">
                <div className="text-sm font-bold text-gray-400">Effective Date : 2026</div>
                <div className="flex items-center gap-2 text-[#520000] font-bold text-sm">
                  <CheckCircle2 size={18} /> Verified Secure
                </div>
              </div>
            </section>

            {/* 1. SCOPE */}
            <section id="scope" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">1. Scope of This Policy</h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 leading-relaxed space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <p>This Privacy Policy applies to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>All users of the BALIK platform (students, faculty, staff, and administrators)</li>
                  <li>All data collected through the BALIK website or system</li>
                  <li>All interactions including reporting, claiming, matching, and communication</li>
                </ul>
                <p className="font-medium text-[#520000]">By accessing or using BALIK, you agree to the terms outlined in this policy.</p>
              </div>
            </section>

            {/* 2. COLLECTION */}
            <section id="collection" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">2. Information We Collect</h3>
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 shadow-sm">
                  <h4 className="font-bold text-[#520000] mb-2">a. Personal Identification Information</h4>
                  <p className="text-gray-700 mb-2">We may collect:</p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Full name (optional)</li>
                    <li>Email address (optional)</li>
                    <li>Contact number (optional)</li>
                    <li>User role (e.g., student, faculty, staff)</li>
                  </ul>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 shadow-sm">
                  <h4 className="font-bold text-[#520000] mb-2">b. Lost and Found Submission Data</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Item descriptions (text input processed via NLP)</li>
                    <li>Uploaded photos or media files</li>
                    <li>Date, time, and location of loss or discovery</li>
                    <li>Category and tags associated with items</li>
                  </ul>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 shadow-sm">
                  <h4 className="font-bold text-[#520000] mb-2">c. System and Technical Data</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>IP address</li>
                    <li>Device type and browser information</li>
                    <li>Log data (timestamps, access logs, system interactions)</li>
                  </ul>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 shadow-sm">
                  <h4 className="font-bold text-[#520000] mb-2">d. Generated and Derived Data</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Matching results generated by smart matching algorithms</li>
                    <li>Confidence scores or similarity metrics</li>
                    <li>Gamification data (points, badges, activity history)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 3. USAGE */}
            <section id="usage" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">3. How We Use Your Information</h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 space-y-6 shadow-sm">
                <p>BALIK uses collected data for the following purposes:</p>
                <div>
                  <h4 className="font-bold text-[#520000] mb-2">a. Core Functionality</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>To match lost and found items using NLP and intelligent algorithms</li>
                    <li>To verify ownership of items before release</li>
                    <li>To manage item reports, claims, and resolution processes</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-[#520000] mb-2">b. Communication</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>To notify users about potential matches</li>
                    <li>To send updates regarding claims or item status</li>
                    <li>To respond to user inquiries and support requests</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-[#520000] mb-2">c. System Improvement</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>To enhance matching accuracy and algorithm performance</li>
                    <li>To analyze user behavior for system optimization</li>
                    <li>To improve user interface and overall experience</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-[#520000] mb-2">d. Engagement and Gamification</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>To award points, badges, or recognition for participation</li>
                    <li>To encourage responsible reporting and claiming behavior</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 4. LEGAL BASIS */}
            <section id="legal" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">4. Legal Basis for Processing</h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <p className="mb-2">Data is processed based on:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>User consent upon using the platform</li>
                  <li>Legitimate interest in maintaining a secure and functional lost and found system</li>
                  <li>Compliance with university regulations and administrative requirements</li>
                </ul>
              </div>
            </section>

            {/* 5. SHARING */}
            <section id="sharing" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">5. Data Sharing and Disclosure</h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 space-y-6 shadow-sm">
                <p>BALIK does not sell or commercially distribute personal data. Data may be shared under the following conditions:</p>
                <div>
                  <h4 className="font-bold text-[#520000] mb-2">a. Internal Access</h4>
                  <p>Authorized BALIK administrators and university personnel</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#520000] mb-2">b. Limited User Sharing</h4>
                  <p>Necessary details shared between users for verification of item ownership</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#520000] mb-2">c. Legal Obligations</h4>
                  <p>When required by law, regulation, or official university request</p>
                </div>
              </div>
            </section>

            {/* 6. RETENTION */}
            <section id="retention" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">6. Data Retention Policy</h3>
              <div className="bg-[#520000] p-10 rounded-[2.5rem] text-white shadow-xl shadow-[#520000]/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2E4DC]/10 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3" />
                <div className="relative z-10">
                  <p className="mb-6 text-gray-200">BALIK retains data only for as long as necessary:</p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-[#F2E4DC]" />
                      <p><strong className="text-[#F2E4DC]">Unclaimed item reports:</strong> retained for [3–6 months or as defined]</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-[#F2E4DC]" />
                      <p><strong className="text-[#F2E4DC]">Claimed item records:</strong> archived for documentation and audit purposes</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-[#F2E4DC]" />
                      <p><strong className="text-[#F2E4DC]">System logs:</strong> retained for security and monitoring</p>
                    </li>
                  </ul>
                  <p className="mt-8 text-sm text-gray-300 italic pt-4 border-t border-white/20">Data may be deleted, anonymized, or archived after the retention period.</p>
                </div>
              </div>
            </section>

            {/* 7. SECURITY */}
            <section id="security" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">7. Data Security Measures</h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <p className="mb-4">We implement reasonable safeguards, including:</p>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>Secure servers and encrypted data transmission (if applicable)</li>
                  <li>Access control and role-based permissions</li>
                  <li>Regular system monitoring and updates</li>
                </ul>
                <p className="text-sm italic">Despite these measures, users acknowledge that no digital system is completely secure.</p>
              </div>
            </section>

            {/* 8. RIGHTS */}
            <section id="rights" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">8. User Rights and Control</h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <p className="mb-4">Users have the right to:</p>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>Access their personal data stored in the system</li>
                  <li>Request correction of inaccurate or incomplete data</li>
                  <li>Request deletion of their data, subject to system and policy limitations</li>
                  <li>Withdraw consent where applicable</li>
                </ul>
                <p className="font-medium text-[#520000]">Requests may be submitted through the BALIK support channel.</p>
              </div>
            </section>

            {/* 9. COOKIES */}
            <section id="cookies" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">9. Cookies and Tracking Technologies</h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <p className="mb-4">BALIK may use cookies or similar technologies to:</p>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>Maintain login sessions</li>
                  <li>Track system usage and analytics</li>
                  <li>Improve platform performance</li>
                </ul>
                <p>Users may disable cookies through browser settings, though some features may be affected.</p>
              </div>
            </section>

            {/* 10. GAMIFICATION */}
            <section id="gamification" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">10. Gamification and Automated Processing</h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <p className="mb-4">BALIK incorporates gamification and automated systems:</p>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>Points and badges are awarded based on participation and activity</li>
                  <li>Automated matching is performed using NLP and smart algorithms</li>
                  <li>These systems assist decision-making but do not replace administrative verification</li>
                </ul>
                <p className="font-medium text-[#520000]">Gamification does not impact academic evaluation or official university records.</p>
              </div>
            </section>

            {/* 11. THIRD-PARTY */}
            <section id="thirdparty" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">11. Third-Party Services</h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <p className="mb-4">BALIK may utilize third-party services such as:</p>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>Cloud hosting providers</li>
                  <li>Analytics tools</li>
                  <li>Communication platforms</li>
                </ul>
                <p>These providers are required to follow appropriate data protection standards.</p>
              </div>
            </section>

            {/* 12. LIABILITY */}
            <section id="liability" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">12. Limitations of Liability</h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 space-y-4 shadow-sm">
                <p>BALIK serves as a facilitation platform and incorporates advanced technologies to improve reliability:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Utilizes Natural Language Processing (NLP) and smart matching algorithms to significantly reduce the risk of misclaimed items</li>
                  <li>Implements verification processes and confidence-based matching to support accurate item ownership validation</li>
                  <li>Provides administrative oversight to review and confirm claims when necessary</li>
                </ul>
                <p className="font-bold mt-4">While BALIK is designed to be highly reliable and to minimize errors, absolute guarantees cannot be ensured in all cases. Users are still expected to provide accurate and honest information when reporting or claiming items.</p>
              </div>
            </section>

            {/* 13. UPDATES */}
            <section id="updates" className="scroll-mt-32">
              <h3 className="text-2xl font-black text-[#520000] mb-4">13. Updates to This Privacy Policy</h3>
              <div className="bg-white p-8 rounded-3xl border border-[#DBC9C0]/20 text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <p>BALIK reserves the right to modify this Privacy Policy at any time. Updates will be posted within the platform, and continued use signifies acceptance of the revised terms.</p>
              </div>
            </section>

            {/* 14. CONTACT */}
            <section id="contact" className="scroll-mt-32">
              <div className="bg-white rounded-[2.5rem] p-12 text-center border border-[#DBC9C0]/20 shadow-xl shadow-[#520000]/[0.03] relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#F2E4DC]/50 rounded-full blur-3xl opacity-50" />
                <h3 className="text-3xl font-black text-[#520000] mb-6">14. Contact Information</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-8 font-medium text-lg leading-relaxed">
                  For any concerns, requests, or questions regarding your data:
                </p>
                <div className="bg-gray-50/80 p-6 rounded-2xl max-w-md mx-auto text-left mb-8 border border-gray-100">
                  <p className="font-black text-[#520000] mb-2">BALIK Support Team</p>
                  <p className="text-gray-600">Email: <a href="mailto:[lostandfound@university.edu]" className="text-[#b89060] font-bold hover:underline">lostandfound@university.edu</a></p>
                  <p className="text-gray-600 mt-1">University: Polytechnic University of the Philippines - Main Campus</p>
                </div>
                <p className="italic font-bold text-[#520000]">By using BALIK, you acknowledge that you have read, understood, and agreed to this Privacy Policy.</p>
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
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live & Protected
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

// Sub-components to avoid missing icons
function UserPen({ size, className }) { return <Database size={size} className={className} />; }
function Package({ size, className }) { return <FileText size={size} className={className} />; }
function Monitor({ size, className }) { return <Settings size={size} className={className} />; }
function Zap({ size, className }) { return <Bell size={size} className={className} />; }
