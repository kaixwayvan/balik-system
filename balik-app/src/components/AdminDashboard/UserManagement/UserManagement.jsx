import { useState, useEffect, useMemo } from "react";
import {
  Users,
  ShieldCheck,
  User2,
  CircleDot,
  Search,
  ChevronDown,
  Eye,
  AlertCircle,
  CheckCircle2,
  Ban,
  Download,
  Lock,
} from "lucide-react";
import { supabase } from "../../../utils/supabaseClient";
import UserProfileModal from "./UserProfileModal";
import WarnUserModal from "./WarnUserModal";

// ─── Badge helpers ───────────────────────────────────────────────────────────
function computeBadges(profile) {
  const badges = [];
  const finds = profile._foundCount || 0;
  const claims = profile._claimCount || 0;

  if (finds >= 1) badges.push("Good Samaritan");
  if (finds >= 5) badges.push("Super Finder");
  if (finds >= 10) badges.push("Campus Finder");
  if (claims >= 3) badges.push("Diligent Reporter");

  return badges;
}

// Use the real points column from profiles table
function getPoints(profile) {
  return profile.points ?? 0;
}

// Derive an accurate status from the is_restricted column
function getUserStatus(profile) {
  if (profile.is_restricted === true) return "Restricted";
  return "Active";
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function StatCard({ icon: Icon, iconBg, value, label }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4 flex-1">
      <div className={`p-3 rounded-xl ${iconBg}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function RoleBadge({ role }) {
  const isAdmin = role?.toLowerCase() === "admin";
  const cls = isAdmin
    ? "bg-red-100 text-red-700"
    : "bg-gray-100 text-gray-600";
  const label = isAdmin ? "Admin" : "User";
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

function StatusBadge({ status }) {
  if (status === "Restricted") {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-600">
        Restricted
      </span>
    );
  }
  return (
    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
      Active
    </span>
  );
}

function TooltipBtn({ icon: Icon, color, label, onClick }) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`${color} cursor-pointer hover:opacity-75 transition-opacity`}
      >
        <Icon size={18} />
      </button>
      <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {label}
      </span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [viewUser, setViewUser] = useState(null);
  const [warnUser, setWarnUser] = useState(null);

  // Filter state
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  // ── Fetch data ──────────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);

        // 1. All profiles
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: true });

        if (profilesError) throw profilesError;

        // 2. Found items (for points & badges)
        const { data: foundItems, error: foundError } = await supabase
          .from("items")
          .select("user_id")
          .eq("type", "found");

        if (foundError) throw foundError;

        // 3. Lost items (reports filed)
        const { data: lostItems, error: lostError } = await supabase
          .from("items")
          .select("user_id")
          .eq("type", "lost");

        if (lostError) throw lostError;

        // 4. Claims
        const { data: claims, error: claimsError } = await supabase
          .from("claims")
          .select("claimer_id");

        // claims table may not exist yet – silently ignore
        const claimsData = claimsError ? [] : (claims || []);

        // 5. Aggregate counts per user
        const foundCounts = {};
        foundItems.forEach(({ user_id }) => {
          if (user_id) foundCounts[user_id] = (foundCounts[user_id] || 0) + 1;
        });

        const lostCounts = {};
        lostItems.forEach(({ user_id }) => {
          if (user_id) lostCounts[user_id] = (lostCounts[user_id] || 0) + 1;
        });

        const claimCounts = {};
        claimsData.forEach(({ claimer_id }) => {
          if (claimer_id) claimCounts[claimer_id] = (claimCounts[claimer_id] || 0) + 1;
        });

        // 6. Merge everything
        const enriched = profiles.map((p) => ({
          ...p,
          _foundCount: foundCounts[p.id] || 0,
          _lostCount: lostCounts[p.id] || 0,
          _claimCount: claimCounts[p.id] || 0,
        }));

        setUsers(enriched);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  // ── Stats ────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter(
      (u) => u.role?.toLowerCase() === "admin"
    ).length;
    const regularUsers = users.filter(
      (u) => u.role?.toLowerCase() !== "admin"
    ).length;
    // Active = not restricted (any role)
    const active = users.filter((u) => !u.is_restricted).length;
    return { total, admins, regularUsers, active };
  }, [users]);

  // ── Filtering ────────────────────────────────────────────────────────────
  // "User" catches everything that isn't admin (student, staff, user, etc.)
  const roleOptions = ["All roles", "Admin", "User"];

  // Normalise role for filtering: admin stays "admin", everything else is "user"
  const normaliseRole = (role) =>
    role?.toLowerCase() === "admin" ? "admin" : "user";

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        (u.full_name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.department || "").toLowerCase().includes(q);

      const matchesRole =
        roleFilter === "All roles" ||
        normaliseRole(u.role) === roleFilter.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter, normaliseRole]);

  // ── Export ───────────────────────────────────────────────────────────────
  function handleExport() {
    const rows = [
      ["Name", "Email", "Role", "Department", "Points", "Badges", "Status"],
      ...filtered.map((u) => [
        u.full_name || "",
        u.email || "",
        u.role || "",
        u.department || "",
        getPoints(u),
        computeBadges(u).join(", "),
        getUserStatus(u),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Action handlers (stubs) ──────────────────────────────────────────────
  async function handleRestrict(userId, currentlyRestricted) {
    const { error } = await supabase
      .from("profiles")
      .update({ is_restricted: !currentlyRestricted })
      .eq("id", userId);
    if (!error) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, is_restricted: !currentlyRestricted } : u
        )
      );
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6 bg-[#EEF1F8] min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
        <p className="text-gray-500 text-sm">Manage registered users</p>
      </div>

      {/* Stat cards */}
      <div className="flex gap-4">
        <StatCard
          icon={Users}
          iconBg="bg-teal-400"
          value={loading ? "—" : stats.total}
          label="Total Users"
        />
        <StatCard
          icon={ShieldCheck}
          iconBg="bg-red-400"
          value={loading ? "—" : stats.admins}
          label="Admins"
        />
        <StatCard
          icon={User2}
          iconBg="bg-blue-400"
          value={loading ? "—" : stats.regularUsers}
          label="Users"
        />
        <StatCard
          icon={CircleDot}
          iconBg="bg-green-500"
          value={loading ? "—" : stats.active}
          label="Active"
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search user"
            className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-sm w-52 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Role filter dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen((o) => !o)}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {roleFilter}
            <ChevronDown size={14} />
          </button>
          {roleDropdownOpen && (
            <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-xl shadow-lg z-20 w-36 py-1">
              {roleOptions.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRoleFilter(r);
                    setRoleDropdownOpen(false);
                  }}
                  className={`cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${roleFilter === r ? "font-semibold text-green-700" : "text-gray-700"
                    }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1" />

        {/* Export */}
        <button
          onClick={handleExport}
          className="cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Download size={15} />
          Export Users
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {["USER", "ROLE", "POINTS", "REPORTS", "BADGES", "STATUS", "ACTIONS"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading users…</span>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            ) : (
              filtered.map((u) => {
                const points = getPoints(u);
                const badges = computeBadges(u);
                const isRestricted = !!u.is_restricted;
                const status = getUserStatus(u);
                const role = u.role?.toLowerCase();
                const isAdmin = role === "admin";

                return (
                  <tr
                    key={u.id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    {/* USER */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border border-gray-200">
                          {u.avatar_url ? (
                            <img
                              src={u.avatar_url}
                              alt={u.full_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-teal-500 text-white font-bold text-sm">
                              {(u.full_name || u.email || "?")[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {u.full_name || "Unknown User"}
                          </p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                          {u.department && (
                            <p className="text-xs text-gray-400">{u.department}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* ROLE */}
                    <td className="px-5 py-4">
                      <RoleBadge role={role} />
                    </td>

                    {/* POINTS */}
                    <td className="px-5 py-4">
                      <span className="font-bold text-green-600">
                        {points} pts
                      </span>
                    </td>

                    {/* REPORTS */}
                    <td className="px-5 py-4 text-gray-600 text-xs leading-relaxed">
                      <p>Lost: {u._lostCount}</p>
                      <p>Found: {u._foundCount}</p>
                      <p>Claims: {u._claimCount}</p>
                    </td>

                    {/* BADGES */}
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-700 text-xs">
                        {badges.length}
                      </p>
                      <p className="text-xs text-gray-400 max-w-[140px] truncate">
                        {badges.length > 0
                          ? badges.join(", ")
                          : "No badges yet"}
                      </p>
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">
                      <StatusBadge status={status} />
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-4">
                      {isAdmin ? (
                        // Admins: view profile only
                        <div className="flex items-center gap-3">
                          <TooltipBtn
                            icon={Eye}
                            color="text-green-600"
                            label="View Profile"
                            onClick={() => setViewUser(u)}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <TooltipBtn
                            icon={Eye}
                            color="text-green-600"
                            label="View Profile"
                            onClick={() => setViewUser(u)}
                          />
                          <TooltipBtn
                            icon={AlertCircle}
                            color="text-orange-500"
                            label="Warn User"
                            onClick={() => setWarnUser(u)}
                          />
                          <TooltipBtn
                            icon={isRestricted ? CheckCircle2 : Ban}
                            color={
                              isRestricted ? "text-green-600" : "text-red-500"
                            }
                            label={
                              isRestricted ? "Unrestrict User" : "Restrict User"
                            }
                            onClick={() =>
                              handleRestrict(u.id, isRestricted)
                            }
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {viewUser && (
        <UserProfileModal
          user={viewUser}
          onClose={() => setViewUser(null)}
          onRestrictToggle={(userId, next) => {
            setUsers((prev) =>
              prev.map((u) => (u.id === userId ? { ...u, is_restricted: next } : u))
            );
            setViewUser((prev) => prev ? { ...prev, is_restricted: next } : null);
          }}
        />
      )}
      {warnUser && (
        <WarnUserModal user={warnUser} onClose={() => setWarnUser(null)} />
      )}
    </div>
  );
}
