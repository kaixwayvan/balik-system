import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BALIKLogo from "../../../assets/BALIK.png";
import { X } from "lucide-react";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
      when: "afterChildren",
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 35, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: "blur(2px)",
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-[99] md:lg:z-[102] lg:z-[102] transition-all duration-500 ease-in-out ${
        isScrolled 
          ? "bg-[#FCF8F5]/70 backdrop-blur-md border-b border-[#520000]/5 shadow-sm py-1" 
          : "bg-transparent backdrop-blur-none py-3"
      }`}
    >
      <nav className="relative top-0 left-0 w-full flex items-center justify-between px-6 py-4">
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

        {/* Button */}
        <button
          className="cursor-pointer md:hidden flex flex-col gap-1 z-50"
          onClick={() => setMenuOpen(true)}
        >
          <span className="w-7 h-1 bg-[#230000de] rounded"></span>
          <span className="w-7 h-1 bg-[#230000de] rounded"></span>
          <span className="w-7 h-1 bg-[#230000de] rounded"></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 h-[100dvh] z-[999] bg-[#FCF8F5] overflow-hidden overscroll-none"
          >
            {/* Background*/}
            <div className="absolute inset-0 pointer-events-none z-0">
              {/* Base Mesh */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#F2E4DC_0%,_transparent_50%)] opacity-70"></div>

              {/* Primary Orbs */}
              <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-white rounded-full mix-blend-overlay filter blur-[100px] opacity-80 animate-pulse"></div>
              <div className="absolute top-[20%] -right-[10%] w-[600px] h-[600px] bg-[#E8D2C5] rounded-full mix-blend-multiply filter blur-[120px] opacity-40"></div>

              {/* Textures */}
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage: "radial-gradient(#520000 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              ></div>

              {/* Geometric Accents */}
              <div className="absolute top-[15%] right-[15%] w-64 h-64 border border-[#520000]/10 rounded-full"></div>
              <div className="absolute bottom-[10%] right-[10%] w-72 h-72 bg-white/30 backdrop-blur-2xl rounded-[3rem] border border-white/50 rotate-6 shadow-2xl shadow-[#520000]/5"></div>

              {/* Curves */}
              <svg className="absolute top-0 left-0 w-full h-full opacity-[0.06]" viewBox="0 0 1440 800">
                <path d="M-100 200 C 300 500, 800 -100, 1500 300" fill="none" stroke="#520000" strokeWidth="2" />
                <path d="M-100 500 C 500 800, 600 200, 1500 600" fill="none" stroke="#520000" strokeWidth="1" />
              </svg>
            </div>

            {/* Content */}
            <div className="relative flex flex-col min-h-screen max-w-6xl mx-auto w-full px-8 md:px-16 py-12">
              {/* Top Bar: Logo & Close */}
              <div className="flex justify-between items-center mb-20">
                <Link to="/" onClick={() => setMenuOpen(false)}>
                  <img src={BALIKLogo} alt="BALIK Logo" className="h-25" />
                </Link>
                <button
                  className="cursor-pointer group relative p-3 text-[#520000] hover:scale-110 transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="absolute inset-0 bg-[#520000]/5 rounded-full scale-0 group-hover:scale-100 transition-transform"></div>
                  <X size={32} strokeWidth={1.5} className="relative" />
                </button>
              </div>

              {/* Motion Navigation Links */}
              <motion.nav
                variants={containerVariants}
                className="flex flex-col items-start gap-10 md:gap-10"
              >
                {/* About */}
                <motion.div variants={itemVariants} className="w-full">
                  <Link to="/about-us" className="group flex items-center gap-6" onClick={() => setMenuOpen(false)}>
                    <span className="font-['Zalando_Sans_Expanded'] text-2xl md:text-7xl font-black text-[#520000] tracking-tighter">ABOUT</span>
                    <div className="h-[4px] w-0 bg-[#cb7300] transition-all group-hover:w-16 rounded-full opacity-40"></div>
                  </Link>
                </motion.div>

                {/* Contacts */}
                <motion.div variants={itemVariants} className="w-full">
                  <HashLink smooth to="/#footer" className="group flex items-center gap-6" onClick={() => setMenuOpen(false)}>
                    <span className="font-['Zalando_Sans_Expanded'] text-2xl md:text-7xl font-black text-[#520000] tracking-tighter">CONTACTS</span>
                    <div className="h-[4px] w-0 bg-[#cb7300] transition-all group-hover:w-16 rounded-full opacity-40"></div>
                  </HashLink>
                </motion.div>

                {/* Learn More */}
                <motion.div variants={itemVariants} className="w-full">
                  <HashLink smooth to="/#faqs" className="group flex items-center gap-6" onClick={() => setMenuOpen(false)}>
                    <span className="font-['Zalando_Sans_Expanded'] text-2xl md:text-7xl font-black text-[#520000] tracking-tighter">LEARN MORE</span>
                    <div className="h-[4px] w-0 bg-[#cb7300] transition-all group-hover:w-16 rounded-full opacity-40"></div>
                  </HashLink>
                </motion.div>

                {/* Log-in */}
                <motion.div variants={itemVariants} className="mt-12 pt-12 border-t border-[#520000]/10 w-full">
                  <Link
                    to="/login"
                    className="font-['Zalando_Sans_Expanded'] inline-flex items-center justify-center w-full md:w-auto text-xl font-bold text-white bg-[#520000] px-12 py-4 rounded-full shadow-xl shadow-[#520000]/20 hover:-translate-y-1 hover:shadow-2xl active:scale-95 transition-all"
                    onClick={() => setMenuOpen(false)}
                  >
                    LOG IN
                  </Link>
                  <p className="text-center mt-8 text-[#520000]/40 font-medium tracking-widest text-xs uppercase md:text-left">
                    Empowering Campus Connections
                  </p>
                </motion.div>
              </motion.nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;