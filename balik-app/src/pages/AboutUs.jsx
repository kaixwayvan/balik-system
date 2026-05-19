import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Users, Search, RefreshCcw } from "lucide-react";
import Header from "../shared/components/partials/Header";
import Footer from "../shared/components/partials/Footer";

const customEaseExpo = [0.16, 1, 0.3, 1];

// Text & Structural Fade-Up
const fadeUpVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: customEaseExpo }
  }
};

// Cascading Layout Grid
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: customEaseExpo }
  }
};

// Background Atmospheric
const orbVariants = {
  animate1: {
    x: [0, 40, -20, 0],
    y: [0, -50, 30, 0],
    scale: [1, 1.1, 0.95, 1],
    transition: { duration: 12, repeat: Infinity, ease: "easeInOut" }
  },
  animate2: {
    x: [0, -50, 30, 0],
    y: [0, 70, -40, 0],
    scale: [1, 0.9, 1.1, 1],
    transition: { duration: 16, repeat: Infinity, ease: "easeInOut" }
  },
  animate3: {
    x: [0, 30, -40, 0],
    y: [0, 50, -30, 0],
    scale: [1, 1.05, 0.9, 1],
    transition: { duration: 14, repeat: Infinity, ease: "easeInOut" }
  }
};

const floatingRingVariants = {
  animate: {
    y: [0, -12, 0],
    rotate: [0, 360],
    transition: {
      y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
      rotate: { duration: 25, repeat: Infinity, ease: "linear" }
    }
  }
};

export default function AboutUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "About Us — BALIK";
  }, []);

  const features = [
    {
      icon: <Search className="text-red-700" size={32} />,
      title: "Smart AI Matching",
      description: "Our system uses advanced AI to analyze item descriptions and intelligently match lost items with found reports in real-time.",
    },
    {
      icon: <Users className="text-red-700" size={32} />,
      title: "Community Driven",
      description: "We empower students and staff to help each other, creating a stronger, more connected, and trustworthy campus environment.",
    },
    {
      icon: <Shield className="text-red-700" size={32} />,
      title: "Secure & Verified",
      description: "With ID verification and admin oversight, our platform ensures all claims are securely processed and items go back to their rightful owners.",
    },
    {
      icon: <RefreshCcw className="text-red-700" size={32} />,
      title: "Streamlined Recovery",
      description: "No more checking physical lost-and-found boxes. Everything is digitized, trackable, and easy to manage from your device.",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans relative overflow-x-hidden">
      {/* Header Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[200px] overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-20 left-[10%] w-[400px] h-[400px] bg-[#F2E4DC]/80 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-[-50px] right-[20%] w-[300px] h-[300px] bg-[#520000]/5 rounded-full blur-3xl opacity-80"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#520000 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}></div>
      </div>
      
      {/* Hero Section */}
      <section className="relative bg-[#F2E4DC] pt-24 pb-32 px-6 lg:px-12 overflow-hidden mt-30 md:mt-[150px] lg:mt-[130px]">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Main radial glow */}
          <div className="absolute inset-0 opacity-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent scale-150"></div>
          
          {/* Animated blurred orbs */}
          <motion.div variants={orbVariants} animate="animate1" className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-white rounded-full mix-blend-overlay filter blur-[80px] opacity-60" />
          <motion.div variants={orbVariants} animate="animate2" className="absolute top-[10%] -right-[10%] w-[600px] h-[600px] bg-[#e8d2c5] rounded-full mix-blend-multiply filter blur-[100px] opacity-70" />
          <motion.div variants={orbVariants} animate="animate3" className="absolute -bottom-[20%] left-[20%] w-[600px] h-[600px] bg-white rounded-full mix-blend-overlay filter blur-[100px] opacity-50" />
          
          {/* Subtle grid pattern */}
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

          {/* Rings */}
          <motion.div variants={floatingRingVariants} animate="animate" className="absolute top-10 right-[15%] w-32 h-32 border-[1px] border-[#520000]/10 rounded-full" />
          <motion.div variants={floatingRingVariants} animate="animate" className="absolute bottom-20 left-[10%] w-48 h-48 border-[1.5px] border-[#520000]/10 rounded-full" />

          {/* Small floating particles */}
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/2 left-[5%] w-4 h-4 bg-[#520000]/10 rounded-full transform -translate-y-1/2" />
          <motion.div animate={{ y: [0, 10, 0], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/4 right-[25%] w-3 h-3 bg-white/40 rounded-full" />
        </div>

        {/* Hero Content */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } }
          }}
          className="max-w-4xl mx-auto text-center relative z-10 mt-10"
        >
          <motion.h1 variants={fadeUpVariants} className="text-5xl md:text-[5rem] font-extrabold text-[#520000] mb-8 tracking-tight drop-shadow-sm leading-tight">
            Reuniting you with <br/>what matters.
          </motion.h1>
          <motion.p variants={fadeUpVariants} className="text-lg md:text-2xl text-[#7B1C1C] max-w-2xl mx-auto leading-relaxed font-medium">
            BALIK is an innovative platform dedicated to solving the campus lost-and-found problem through technology, community, and trust.
          </motion.p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-6 lg:px-12 bg-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#F2E4DC]/60 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-[#520000]/[0.03] to-transparent rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
          
          <svg className="absolute top-0 left-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1440 800">
            <path d="M-100 200 C 300 500, 800 -100, 1500 300" fill="none" stroke="#520000" strokeWidth="3" />
            <path d="M-100 350 C 400 650, 700 50, 1500 450" fill="none" stroke="#520000" strokeWidth="2" />
            <path d="M-100 500 C 500 800, 600 200, 1500 600" fill="none" stroke="#520000" strokeWidth="1" />
          </svg>
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#520000 2px, transparent 2px)', backgroundSize: '48px 48px' }}></div>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } }
          }}
          className="max-w-6xl mx-auto grid md:grid-cols-2 p-6 lg:pt-0 gap-16 items-center relative z-10"
        >
          {/* Mission Content Column */}
          <motion.div variants={fadeUpVariants} className="relative">
            <div className="absolute -left-6 -top-6 w-12 h-12 border-t-4 border-l-4 border-[#520000]/20 rounded-tl-xl pointer-events-none"></div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Losing an important item on campus can be stressful. Our mission is to eliminate that stress by providing a centralized, intelligent, and secure platform where the community can effortlessly report lost items and return found ones.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              We believe that with the right tools, communities naturally look out for one another. BALIK was built to facilitate those acts of kindness and ensure that no valuable item stays lost forever.
            </p>
          </motion.div>

          {/* Badge Quote Component */}
          <motion.div 
            variants={fadeUpVariants}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.4, ease: customEaseExpo }}
            className="bg-gradient-to-br from-[#F2E4DC] to-[#e8d2c5] rounded-[2.5rem] p-12 relative overflow-hidden flex items-center justify-center min-h-[350px] shadow-2xl shadow-[#520000]/10 border border-white/50"
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-white opacity-30 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#520000] opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiM1MjAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50 pointer-events-none"></div>
            <h3 className="text-4xl lg:text-5xl font-black text-[#520000] z-10 text-center leading-tight drop-shadow-sm">
              "Building a campus where nothing is truly lost."
            </h3>
          </motion.div>
        </motion.div>
      </section>

      {/* Features/Values Section */}
      <section className="py-24 px-6 lg:px-12 bg-[#FDF8F5] relative overflow-hidden border-t border-[#DBC9C0]/20">
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-white rounded-full opacity-60 blur-[100px]"></div>
          <div className="absolute bottom-0 left-[10%] w-[600px] h-[600px] bg-white rounded-full opacity-60 blur-[100px]"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: customEaseExpo }}
            className="text-center mb-20 relative"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#520000] mb-6 tracking-tight">Why We Built BALIK</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-xl font-medium">
              We designed this system specifically for the dynamic environment of modern university campuses.
            </p>
            <div className="absolute left-1/2 bottom-[-24px] transform -translate-x-1/2 w-100 lg:w-200 h-1 bg-gradient-to-r from-transparent via-[#520000]/20 to-transparent"></div>
          </motion.div>
          
          {/* Floating Cards Grid */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div 
                key={idx} 
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-white/80 backdrop-blur-sm p-8 rounded-[2rem] shadow-lg shadow-[#520000]/[0.02] border border-white hover:border-[#DBC9C0]/50 hover:shadow-xl hover:shadow-[#520000]/5 transition-shadow duration-300 group"
              >
                <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-[#F2E4DC] to-white flex items-center justify-center mb-8 border border-[#F2E4DC] group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}