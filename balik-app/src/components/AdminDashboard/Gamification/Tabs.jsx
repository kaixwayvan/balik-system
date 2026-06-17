import { motion } from "framer-motion";

export default function Tabs({ activeTab, setActiveTab }) {
  const tabs = [
    "Reward Rules Engine",
    "Level Progression Rules",
    "Gamification Audit Logs",
  ];

  return (
    <div className="w-full relative">
      <div className="w-full px-1">
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center p-1.5 bg-slate-100/60 backdrop-blur-xl border border-slate-200/40 rounded-3xl sm:rounded-[2.25rem] w-full sm:w-auto sm:inline-flex gap-1 sm:gap-0 shadow-[inset_0_2px_5px_rgba(0,0,0,0.05)]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative cursor-pointer px-4 sm:px-7 py-3.5 sm:py-2.5 rounded-3xl sm:rounded-[2rem] text-sm sm:text-sm lg:text-base font-bold tracking-tight text-center sm:text-left whitespace-nowrap transition-colors duration-300 outline-none select-none w-full sm:w-auto
                  ${isActive ? "text-white" : "text-slate-500 hover:text-slate-800"}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-3d-premium-tab"
                    className="absolute inset-0 bg-gradient-to-b from-[#66240E] to-[#4A1A0A] rounded-3xl sm:rounded-[2rem] border border-[#4A1A0A] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_10px_-1px_rgba(102,36,14,0.3)]"
                    transition={{ type: "spring", bounce: 0.16, duration: 0.5 }}
                  />
                )}
                
                <span className="relative z-10">{tab}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}