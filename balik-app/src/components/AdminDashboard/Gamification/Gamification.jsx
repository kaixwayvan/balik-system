import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, 
  Target, 
  Award, 
  Coins, 
  TrendingUp, 
  Users, 
  Plus, 
  Settings, 
  ChevronRight,
  Zap,
  Star,
  Search,
  RefreshCw,
  Shield
} from 'lucide-react';
import { supabase } from '../../../utils/supabaseClient';

const POINT_RULES = [
  { id: 1, action: 'Report Lost Item', points: 10, icon: Search, color: 'bg-blue-500' },
  { id: 2, action: 'Report Found Item', points: 20, icon: Shield, color: 'bg-green-500' },
  { id: 3, action: 'Successful Match', points: 50, icon: Target, color: 'bg-purple-500' },
  { id: 4, action: 'Verify QR Code', points: 15, icon: Zap, color: 'bg-orange-500' },
];

const BADGES = [
  { id: 1, name: 'First Report', icon: Award, requirement: 'Submit your first report', color: 'text-amber-500', threshold: 10 },
  { id: 2, name: 'Eagle Eye', icon: Star, requirement: 'Find 5 items', color: 'text-blue-500', threshold: 100 },
  { id: 3, name: 'Community Hero', icon: Trophy, requirement: 'Help return 10 items', color: 'text-yellow-500', threshold: 500 },
  { id: 4, name: 'Master Scout', icon: Shield, requirement: 'Achieve a 100% match rate', color: 'text-purple-500', threshold: 1000 },
];

export default function Gamification() {
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState({
    totalPoints: 0,
    activeUsers: 0,
    badgesEarned: 0,
    trend: 'Calculating...'
  });

  const fetchLiveData = async () => {
    try {
      if (leaderboard.length === 0) setLoading(true);
      
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email, points, avatar_url, created_at')
        .order('points', { ascending: false });

      if (profileError) throw profileError;

      const totalPoints = profiles.reduce((sum, p) => sum + (p.points || 0), 0);
      const activeUsers = profiles.length;
      
      let totalBadges = 0;
      profiles.forEach(p => {
        BADGES.forEach(badge => {
          if ((p.points || 0) >= badge.threshold) totalBadges++;
        });
      });

      const lastWeekUsers = profiles.filter(p => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(p.created_at) > weekAgo;
      }).length;
      
      const trendPercent = activeUsers > 0 ? Math.round((lastWeekUsers / activeUsers) * 100) : 0;

      setStats({
        totalPoints,
        activeUsers,
        badgesEarned: totalBadges,
        trend: `+${trendPercent}% new users`
      });

      setLeaderboard(profiles.slice(0, 10));

    } catch (err) {
      console.error("Error synchronizing gamification data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Gamification Engine</h1>
          <p className="text-gray-500 text-sm">Manage points, achievements, and user engagement levels.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchLiveData}
            disabled={loading}
            className={`flex items-center gap-2 bg-white text-gray-700 px-5 py-2.5 rounded-xl font-bold text-sm border border-gray-300 hover:bg-gray-50 transition-all ${loading ? 'opacity-50' : ''}`}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Sync Data
          </button>
          <button className="flex items-center gap-2 bg-[#7B1C1C] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-red-800 transition-all shadow-md">
            <Plus size={16} /> New Achievement
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Total Points Issued</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {loading ? "..." : stats.totalPoints.toLocaleString()}
            </h3>
            <div className="flex items-center gap-1.5 text-green-600 text-xs font-bold mt-1">
              <TrendingUp size={14} /> Live from DB
            </div>
          </div>
          <Coins className="absolute -right-4 -bottom-4 text-gray-50 w-24 h-24" />
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Registered Users</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {loading ? "..." : stats.activeUsers.toLocaleString()}
            </h3>
            <p className="text-xs text-gray-400 font-medium mt-1">{stats.trend}</p>
          </div>
          <Users className="absolute -right-4 -bottom-4 text-gray-50 w-24 h-24" />
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Badges Unlocked</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {loading ? "..." : stats.badgesEarned}
            </h3>
            <p className="text-xs text-gray-400 font-medium mt-1">Based on thresholds</p>
          </div>
          <Award className="absolute -right-4 -bottom-4 text-gray-50 w-24 h-24" />
        </div>

        <div className="bg-[#7B1C1C] p-6 rounded-xl shadow-lg relative overflow-hidden group">
          <div className="relative z-10 text-white">
            <p className="text-xs font-semibold text-red-100/60 mb-1 uppercase tracking-wider">Current Event</p>
            <h3 className="text-xl font-bold">Double XP Week</h3>
            <p className="text-xs text-red-100/80 font-medium mt-1 italic">Ends in 2 days</p>
          </div>
          <Zap className="absolute -right-4 -bottom-4 text-white/10 w-24 h-24" />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Rules & Badges */}
        <div className="col-span-8 space-y-6">
          {/* Point Multipliers */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-800">Point Configuration</h2>
              <button className="text-blue-600 font-bold text-xs uppercase hover:underline">Edit Multipliers</button>
            </div>
            <div className="grid grid-cols-2 p-6 gap-4">
              {POINT_RULES.map((rule) => (
                <div key={rule.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-300 transition-all cursor-pointer">
                  <div className={`w-12 h-12 rounded-lg ${rule.color} flex items-center justify-center text-white shadow-sm`}>
                    <rule.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-800 uppercase">{rule.action}</h4>
                    <p className="text-[11px] text-gray-500 font-medium">Standard reward</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-800">+{rule.points}</span>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">PTS</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Badges Library */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-800">Achievement Library</h2>
            </div>
            <div className="p-6 grid grid-cols-4 gap-6">
              {BADGES.map((badge) => (
                <div key={badge.id} className="text-center group">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100 group-hover:scale-105 transition-all duration-300 relative">
                    <badge.icon size={28} className={badge.color} />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-800 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                      LV1
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-gray-800 uppercase mb-1">{badge.name}</h4>
                  <p className="text-[10px] text-gray-400 font-medium leading-tight px-1">{badge.requirement}</p>
                </div>
              ))}
              <div className="text-center">
                <button className="w-16 h-16 border-2 border-dashed border-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300 hover:text-gray-500 hover:border-gray-400 transition-all">
                  <Plus size={24} />
                </button>
                <h4 className="text-[10px] font-bold text-gray-300 uppercase mt-2">Add Badge</h4>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Leaderboard */}
        <div className="col-span-4">
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg font-bold text-gray-800">Leaderboard</h2>
                <button 
                  onClick={fetchLiveData} 
                  disabled={loading}
                  className="text-[10px] font-bold text-gray-400 uppercase hover:text-gray-800 transition-colors"
                >
                  {loading ? "..." : "Refresh"}
                </button>
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Top contributing members</p>
            </div>
            
            <div className="flex-1 overflow-y-auto max-h-[500px]">
              <div className="divide-y divide-gray-100">
                {loading ? (
                  <div className="p-10 text-center text-gray-400 font-medium">Syncing...</div>
                ) : leaderboard.length === 0 ? (
                  <div className="p-10 text-center text-gray-400 font-medium italic">No active rankings...</div>
                ) : leaderboard.map((user, idx) => (
                  <div key={user.id} className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-6 text-center">
                      <span className={`text-sm font-bold ${idx < 3 ? 'text-[#7B1C1C]' : 'text-gray-300'}`}>
                        {idx + 1}
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shadow-sm">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} className="w-full h-full object-cover" alt={user.full_name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Users size={16} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-gray-800 uppercase truncate">{user.full_name || 'Anonymous User'}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{user.email?.split('@')[0] || 'Member'}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-800">{user.points?.toLocaleString() || 0}</span>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">PTS</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-gray-50/30 border-t border-gray-100">
              <button className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
                Full Rankings <ChevronRight size={14} />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
