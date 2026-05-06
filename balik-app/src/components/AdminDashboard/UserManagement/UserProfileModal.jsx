import { useEffect, useState } from "react";
import {
  X,
  Award,
  Clock,
  History,
  Ban,
  CheckCircle2,
  Plus,
  ShieldAlert,
} from "lucide-react";
import { supabase } from "../../../utils/supabaseClient";

// ─── Badge pill ───────────────────────────────────────────────────────────────
function BadgePill({ label }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-semibold">
      <Award size={11} className="flex-shrink-0" />
      {label}
    </span>
  );
}

// ─── Stat tile ────────────────────────────────────────────────────────────────
function StatTile({ value, label, color }) {
  return (
    <div className="flex flex-col items-center justify-center py-4 px-3 rounded-xl bg-gray-50 border border-gray-100">
      <span className={`text-2xl font-extrabold leading-none ${color}`}>
        {value}
      </span>
      <span className="text-[11px] text-gray-500 font-medium mt-1 text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

// ─── Action button ────────────────────────────────────────────────────────────
function ActionBtn({ icon: Icon, label, color, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-sm
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 hover:shadow-md active:scale-95 cursor-pointer"}
        ${color}`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function UserProfileModal({ user, onClose, onRestrictToggle }) {
  const [restricting, setRestricting] = useState(false);
  const [isRestricted, setIsRestricted] = useState(!!user?.is_restricted);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  if (!user) return null;

  const isAdmin = user.role?.toLowerCase() === "admin";
  const points  = user.points ?? 0;

  const badges = [];
  if ((user._foundCount || 0) >= 1)  badges.push("Good Samaritan");
  if ((user._foundCount || 0) >= 5)  badges.push("Super Finder");
  if ((user._foundCount || 0) >= 10) badges.push("Campus Finder");
  if ((user._claimCount || 0) >= 3)  badges.push("Diligent Reporter");

  const joinedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "numeric", day: "numeric", year: "numeric",
      })
    : "—";

  const lastActive = user.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleString("en-US", {
        month: "numeric", day: "numeric", year: "numeric",
        hour: "numeric", minute: "2-digit",
      })
    : "—";

  async function handleRestrictToggle() {
    setRestricting(true);
    const next = !isRestricted;
    const { error } = await supabase
      .from("profiles")
      .update({ is_restricted: next })
      .eq("id", user.id);
    if (!error) {
      setIsRestricted(next);
      onRestrictToggle?.(user.id, next);
    }
    setRestricting(false);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="bg-white w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxWidth: 720 }}
      >

        {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
        <div className="flex items-start justify-between px-7 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">
              {user.full_name || "Unknown User"}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-400 hover:text-gray-700 transition-colors mt-0.5"
          >
            <X size={20} />
          </button>
        </div>

        {/* ══ BODY ════════════════════════════════════════════════════════════ */}
        <div className="flex gap-0 overflow-hidden" style={{ minHeight: 340 }}>

          {/* ── Left panel ────────────────────────────────────────────────── */}
          <div className="w-56 flex-shrink-0 bg-gray-50 border-r border-gray-100 flex flex-col items-center px-6 py-8 gap-4">

            {/* Avatar */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#3A3B67] to-[#5C1313] text-white font-extrabold text-3xl">
                  {(user.full_name || user.email || "?")[0].toUpperCase()}
                </div>
              )}
            </div>

            {/* Name + dept */}
            <div className="text-center">
              <p className="text-sm font-bold text-gray-800 leading-snug">
                {user.full_name || "Unknown User"}
              </p>
              {user.department && (
                <p className="text-xs text-gray-400 mt-0.5">{user.department}</p>
              )}
            </div>

            {/* Meta rows */}
            <div className="w-full space-y-2.5 text-xs">
              {[
                {
                  label: "Role",
                  value: (
                    <span className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                      isAdmin
                        ? "bg-red-100 text-red-700"
                        : "bg-purple-100 text-purple-700"
                    }`}>
                      {isAdmin ? "Admin" : (user.role
                        ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()
                        : "User")}
                    </span>
                  ),
                },
                {
                  label: "Status",
                  value: (
                    <span className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                      isRestricted
                        ? "bg-orange-100 text-orange-600"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {isRestricted ? "Restricted" : "Active"}
                    </span>
                  ),
                },
                {
                  label: "Joined",
                  value: <span className="text-gray-700 font-medium">{joinedDate}</span>,
                },
                {
                  label: "Last Signed In",
                  value: <span className="text-gray-700 font-medium">{lastActive}</span>,
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between gap-2">
                  <span className="text-gray-400 font-medium whitespace-nowrap">{label}:</span>
                  {value}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right panel ───────────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col gap-0 overflow-y-auto">

            {/* Activity Statistics */}
            <div className="px-7 pt-6 pb-5 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 mb-4">
                Activity Statistics
              </h3>
              <div className="grid grid-cols-4 gap-3">
                <StatTile
                  value={points}
                  label="Points"
                  color="text-green-600"
                />
                <StatTile
                  value={user._lostCount ?? 0}
                  label="Lost Reports"
                  color="text-red-500"
                />
                <StatTile
                  value={user._foundCount ?? 0}
                  label="Found Reports"
                  color="text-green-500"
                />
                <StatTile
                  value={user._claimCount ?? 0}
                  label="Claims"
                  color="text-blue-500"
                />
              </div>
            </div>

            {/* Earned Badges */}
            <div className="px-7 pt-5 pb-6">
              <h3 className="text-sm font-bold text-gray-800 mb-3">
                Earned Badges ({badges.length})
              </h3>
              {badges.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {badges.map((b) => <BadgePill key={b} label={b} />)}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-400 text-sm py-2">
                  <Award size={15} className="opacity-50" />
                  <span className="italic">No badges earned yet.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
        <div className="flex items-center gap-2.5 px-7 py-4 border-t border-gray-100 bg-gray-50">
          {!isAdmin && (
            <>
              <ActionBtn
                icon={Plus}
                label="Add Points"
                color="bg-green-600 hover:bg-green-700"
                onClick={() => console.log("Add points:", user.id)}
              />
              <ActionBtn
                icon={Award}
                label="Award Badge"
                color="bg-amber-500 hover:bg-amber-600"
                onClick={() => console.log("Award badge:", user.id)}
              />
              <ActionBtn
                icon={History}
                label="View History"
                color="bg-blue-600 hover:bg-blue-700"
                onClick={() => console.log("View history:", user.id)}
              />
              <ActionBtn
                icon={isRestricted ? CheckCircle2 : Ban}
                label={restricting
                  ? (isRestricted ? "Unrestricting…" : "Restricting…")
                  : (isRestricted ? "Unrestrict User" : "Restrict User")}
                color={isRestricted ? "bg-green-700 hover:bg-green-800" : "bg-red-700 hover:bg-red-800"}
                onClick={handleRestrictToggle}
                disabled={restricting}
              />
            </>
          )}
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="cursor-pointer px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
