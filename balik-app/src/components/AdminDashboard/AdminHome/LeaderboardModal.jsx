import React, { useState, useEffect } from "react";
import { X, Trophy, Medal, Star, Crown, ChevronRight, User } from "lucide-react";
import { supabase } from "../../../utils/supabaseClient";

export default function LeaderboardModal({ onClose }) {
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        // 1. Fetch all items to count finds per user
        const { data: items, error: itemsError } = await supabase
          .from('items')
          .select('user_id, metadata')
          .eq('type', 'found');

        if (itemsError) throw itemsError;

        // 2. Fetch all profiles to get names and avatars
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*');

        if (profilesError) throw profilesError;

        // 3. Aggregate points
        const userStats = {};
        
        // Initialize with all profiles
        profiles.forEach(profile => {
          userStats[profile.id] = {
            id: profile.id,
            name: profile.full_name || "Unknown User",
            avatar: profile.avatar_url,
            points: 0,
            finds: 0
          };
        });

        // Add points from items
        items.forEach(item => {
          if (item.user_id && userStats[item.user_id]) {
            userStats[item.user_id].finds += 1;
            userStats[item.user_id].points += 50;
          }
        });

        // 4. Convert to array and sort
        const sorted = Object.values(userStats)
          .filter(u => u.points > 0)
          .sort((a, b) => b.points - a.points);

        // 5. Assign Tiers
        const withTiers = sorted.map((user, index) => {
          let tier = "Bronze Tier";
          if (user.points >= 2000) tier = "Diamond Tier";
          else if (user.points >= 1500) tier = "Platinum Tier";
          else if (user.points >= 1000) tier = "Gold Tier";
          else if (user.points >= 500) tier = "Silver Tier";

          return { ...user, tier, rank: index + 1 };
        });

        setLeaderboardData(withTiers);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  const topThree = leaderboardData.slice(0, 3);
  const remaining = leaderboardData.slice(3);

  // Position mapping for podium: 2nd, 1st, 3rd
  const podium = [
    topThree[1], // Silver
    topThree[0], // Gold
    topThree[2]  // Bronze
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-[#EEF1F8] w-full max-w-4xl rounded-[24px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-white border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Trophy className="text-gray-700" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Ranking Overview</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #94a3b8;
            }
          `}</style>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500 font-medium">Calculating rankings...</p>
            </div>
          ) : leaderboardData.length === 0 ? (
            <div className="text-center py-20">
              <Star size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">No rankings available yet.</p>
            </div>
          ) : (
            <>
              {/* Podium Section */}
              <div className="flex justify-center items-end gap-4 md:gap-8 pb-4">
                {podium.map((user, idx) => {
                  const isFirst = user.rank === 1;
                  const isSecond = user.rank === 2;
                  const isThird = user.rank === 3;

                  let borderColor = "border-gray-200";
                  let badgeColor = "bg-gray-100 text-gray-600";
                  let Icon = Medal;
                  let height = "h-48";
                  let shadow = "shadow-sm";

                  if (isFirst) {
                    borderColor = "border-[#FFD700]";
                    badgeColor = "bg-[#FFF9E6] text-[#A18800]";
                    Icon = Crown;
                    height = "h-56";
                    shadow = "shadow-xl border-2";
                  } else if (isSecond) {
                    borderColor = "border-gray-300";
                    badgeColor = "bg-gray-50 text-gray-500";
                    height = "h-48";
                  } else if (isThird) {
                    borderColor = "border-[#CD7F32]/30";
                    badgeColor = "bg-[#FFF5EB] text-[#8B4513]";
                    height = "h-40";
                  }

                  return (
                    <div 
                      key={user.id} 
                      className={`flex-1 max-w-[200px] bg-white rounded-xl ${height} ${borderColor} ${shadow} border flex flex-col items-center justify-center p-4 text-center relative transition-transform hover:scale-105`}
                    >
                      <div className={`p-2 rounded-lg ${badgeColor} mb-2`}>
                        <Icon size={24} />
                      </div>
                      <h3 className={`font-bold text-sm md:text-base line-clamp-1 ${isFirst ? 'text-[#A18800]' : isThird ? 'text-[#8B4513]' : 'text-gray-700'}`}>
                        {user.name}
                      </h3>
                      <p className="text-xs font-bold text-gray-500 mt-1">{user.tier}</p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{user.points} pts</p>
                      
                      {isFirst && (
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center text-white shadow-lg">
                          <Star size={16} fill="white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* List Section */}
              <div className="space-y-3">
                {leaderboardData.map((user) => (
                  <div 
                    key={user.id}
                    className="bg-white rounded-[16px] border border-gray-200 p-4 flex items-center justify-between hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="text-gray-400" size={24} />
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center text-[10px] font-bold text-gray-700 border border-gray-100">
                          {user.rank}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">{user.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-gray-500">{user.points} pts</span>
                          <span className="text-[10px] text-gray-300">•</span>
                          <span className="text-xs font-medium text-gray-400">{user.tier}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 transition-colors">
                      View <ChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
