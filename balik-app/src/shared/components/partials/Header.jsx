import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { createPortal } from "react-dom";
import { useState } from "react";
import BALIKLogo from "../../../assets/BALIK.png";
import { X } from "lucide-react";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollWithOffset = (el) => {
    const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
    const yOffset = -80; 
    window.scrollTo({ top: yCoordinate + yOffset, behavior: "smooth" });
  };

  return (
    <header className="top-0 z-100 relative">
      <nav className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/">
          <img src={BALIKLogo} alt="BALIK Logo" className="h-20 sm:h-30 md:h-25 lg:h-30" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center lg:gap-15 md:gap-7 font-['Zalando_Sans_Expanded']">
          <Link
            to="/about-us"
            className="font-extrabold md:text-sm lg:text-lg text-[#230000de] hover:text-[#cb7300ff] transition-colors duration-300"
          >
            ABOUT
          </Link>

          <HashLink
            smooth
            to="/#footer"
            className="font-extrabold md:text-sm lg:text-lg text-[#230000de] hover:text-[#cb7300ff] transition-colors duration-300"
          >
            CONTACTS
          </HashLink>

          <HashLink
            smooth
            to="/#faqs"
            className="font-extrabold md:text-sm lg:text-lg text-[#230000de] hover:text-[#cb7300ff] transition-colors duration-300"
          >
            LEARN MORE
          </HashLink>

          <Link
            to="/login"
            className="flex items-center justify-center text-center md:text-sm lg:text-lg font-extrabold text-[#230000de] border-[1.9px] border-[#7B1C1C] hover:shadow-lg px-8 py-2 rounded-3xl hover:bg-[#7B1C1C] hover:text-white transition-colors duration-300"
          >
            LOG IN
          </Link>
        </div>

        {/* Hamburger Button */}
        <button
          className="cursor-pointer md:hidden flex flex-col gap-1 z-50"
          onClick={() => setMenuOpen(true)}
        >
          <span className="w-7 h-1 bg-[#230000de] rounded"></span>
          <span className="w-7 h-1 bg-[#230000de] rounded"></span>
          <span className="w-7 h-1 bg-[#230000de] rounded"></span>
        </button>
      </nav>

      {/* Fullscreen Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 flex flex-col font-sans overflow-y-auto overflow-x-hidden bg-[#FCF8F5] z-[999] !important">
          {/* --- BACKGROUND ARCHITECTURE --- */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* 1. Base Mesh/Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#F2E4DC_0%,_transparent_50%)] opacity-70"></div>

            {/* 2. Primary Animated Orbs (Cleaned up redundant divs) */}
            <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-white rounded-full mix-blend-overlay filter blur-[100px] opacity-80 animate-pulse"></div>
            <div className="absolute top-[20%] -right-[10%] w-[600px] h-[600px] bg-[#E8D2C5] rounded-full mix-blend-multiply filter blur-[120px] opacity-40"></div>

            {/* 3. Sophisticated Textures */}
            {/* Subtle Dot Grid - cleaner than the notebook grid */}
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "radial-gradient(#520000 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            ></div>

            {/* 4. Geometric Accents (The "Great" shapes) */}
            {/* Thin Floating Ring */}
            <div className="absolute top-[15%] right-[15%] w-64 h-64 border border-[#520000]/10 rounded-full"></div>

            {/* Glassmorphism Card Element - provides depth */}
            <div className="absolute bottom-[10%] right-[10%] w-72 h-72 bg-white/30 backdrop-blur-2xl rounded-[3rem] border border-white/50 rotate-6 shadow-2xl shadow-[#520000]/5"></div>

            {/* 5. The Signature Curves */}
            <svg
              className="absolute top-0 left-0 w-full h-full opacity-[0.06]"
              viewBox="0 0 1440 800"
            >
              <path
                d="M-100 200 C 300 500, 800 -100, 1500 300"
                fill="none"
                stroke="#520000"
                strokeWidth="2"
              />
              <path
                d="M-100 500 C 500 800, 600 200, 1500 600"
                fill="none"
                stroke="#520000"
                strokeWidth="1"
              />
            </svg>
          </div>

          {/* --- CONTENT LAYER --- */}
          <div className="relative flex flex-col min-h-screen max-w-6xl mx-auto w-full px-8 md:px-16 py-12">
            {/* Top Bar: Logo & Close */}
            <div className="flex justify-between items-center mb-20">
              <Link to="/" onClick={() => setMenuOpen(false)}>
                <img
                  src={BALIKLogo}
                  alt="BALIK Logo"
                  className="h-25"
                />
              </Link>
              <button
                className="cursor-pointer group relative p-3 text-[#520000] hover:scale-110 transition-all"
                onClick={() => setMenuOpen(false)}
              >
                <div className="absolute inset-0 bg-[#520000]/5 rounded-full scale-0 group-hover:scale-100 transition-transform"></div>
                <X size={32} strokeWidth={1.5} className="relative" />
              </button>
            </div>

            {/* Nav Links: Focus on white-space and bold typography */}
            <nav className="flex flex-col items-start gap-10 md:gap-10">
              {/* MOBILE LINKS */}
              <Link to="/about-us" className="group flex items-center gap-6" onClick={() => setMenuOpen(false)}>
                <span className="font-['Zalando_Sans_Expanded'] text-2xl md:text-7xl font-black text-[#520000] tracking-tighter">ABOUT</span>
                <div className="h-[4px] w-0 bg-[#cb7300] transition-all group-hover:w-16 rounded-full opacity-40"></div>
              </Link>

              <HashLink smooth to="/#footer" className="group flex items-center gap-6" onClick={() => setMenuOpen(false)}>
                <span className="font-['Zalando_Sans_Expanded'] text-2xl md:text-7xl font-black text-[#520000] tracking-tighter">CONTACTS</span>
                <div className="h-[4px] w-0 bg-[#cb7300] transition-all group-hover:w-16 rounded-full opacity-40"></div>
              </HashLink>

              <HashLink smooth to="/#faqs" className="group flex items-center gap-6" onClick={() => setMenuOpen(false)}>
                <span className="font-['Zalando_Sans_Expanded'] text-2xl md:text-7xl font-black text-[#520000] tracking-tighter">LEARN MORE</span>
                <div className="h-[4px] w-0 bg-[#cb7300] transition-all group-hover:w-16 rounded-full opacity-40"></div>
              </HashLink>

              {/* CTA Section */}
              <div className="mt-12 pt-12 border-t border-[#520000]/10 w-full max-w-full">
                <Link
                  to="/login"
                  className="font-['Zalando_Sans_Expanded'] inline-flex items-center justify-center w-full md:w-auto text-xl font-bold text-white bg-[#520000] px-12 py-4 rounded-full shadow-xl shadow-[#520000]/20 hover:-translate-y-1 hover:shadow-2xl active:scale-95 transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  LOG IN
                </Link>
                <p className="text-center mt-8 text-[#520000]/40 font-medium tracking-widest text-xs uppercase">
                  Empowering Campus Connections
                </p>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
