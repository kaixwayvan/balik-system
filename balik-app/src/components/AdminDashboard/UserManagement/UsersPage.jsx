import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import UserStats from "./UserStats";
import UserFilterBar from "./UserFilterBar";
import UsersTable from "./UsersTable";
import UserActionModal from "./UserActionModal";

// Simulated Backend
const useAuth = () => ({
  user: { id: "admin-123", role: "admin", full_name: "Admin User" },
});

let mockProfiles = [
  { id: "u-1", full_name: "Alex Reyes", username: "alexr", email: "alex@example.com", role: "admin", points: 1250, is_restricted: false, avatar_url: null, created_at: "2026-01-10T10:00:00Z" },
  { id: "u-2", full_name: "Maria Clara", username: "mclara", email: "maria@example.com", role: "user", points: 420, is_restricted: false, avatar_url: null, created_at: "2026-02-15T14:30:00Z" },
  { id: "u-3", full_name: "John Doe", username: "jdoe", email: "john.doe@example.com", role: "user", points: 85, is_restricted: true, avatar_url: null, created_at: "2026-03-05T09:15:00Z" },
  { id: "u-4", full_name: "Samira Cruz", username: "samc", email: "samira@example.com", role: "user", points: 890, is_restricted: false, avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", created_at: "2026-04-20T11:45:00Z" },
  { id: "u-5", full_name: "Juan dela Cruz", username: "juandc", email: "juan.delacruz@iskolarngbayan.edu.ph", role: "user", points: 150, is_restricted: false, avatar_url: null, created_at: "2026-01-12T08:20:00Z" },
  { id: "u-6", full_name: "Bianca Santos", username: "biancas", email: "bianca.santos@iskolarngbayan.edu.ph", role: "user", points: 670, is_restricted: false, avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", created_at: "2026-01-18T16:40:00Z" },
  { id: "u-7", full_name: "Gabriel Mendoza", username: "gabm", email: "gabriel.mendoza@iskolarngbayan.edu.ph", role: "admin", points: 2100, is_restricted: false, avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", created_at: "2026-01-05T07:10:00Z" },
  { id: "u-8", full_name: "Angela Pascual", username: "angelap", email: "angela.pascual@iskolarngbayan.edu.ph", role: "user", points: 310, is_restricted: false, avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", created_at: "2026-02-02T13:15:00Z" },
  { id: "u-9", full_name: "Diego Luna", username: "diegol", email: "diego.luna@iskolarngbayan.edu.ph", role: "user", points: 45, is_restricted: true, avatar_url: null, created_at: "2026-02-10T11:22:00Z" },
  { id: "u-10", full_name: "Patricia Lim", username: "patlim", email: "patricia.lim@iskolarngbayan.edu.ph", role: "user", points: 1120, is_restricted: false, avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop", created_at: "2026-02-24T09:05:00Z" },
  { id: "u-11", full_name: "Miguel Tan", username: "miggyt", email: "miguel.tan@iskolarngbayan.edu.ph", role: "user", points: 0, is_restricted: false, avatar_url: null, created_at: "2026-03-01T15:30:00Z" },
  { id: "u-12", full_name: "Chloe Villanueva", username: "chloev", email: "chloe.v@iskolarngbayan.edu.ph", role: "user", points: 540, is_restricted: false, avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", created_at: "2026-03-03T10:12:00Z" },
  { id: "u-13", full_name: "Jerome Aquino", username: "jeaquino", email: "jerome.aquino@iskolarngbayan.edu.ph", role: "user", points: 750, is_restricted: false, avatar_url: null, created_at: "2026-03-12T14:50:00Z" },
  { id: "u-14", full_name: "Lea Salonga", username: "leas", email: "lea.salonga@iskolarngbayan.edu.ph", role: "user", points: 1890, is_restricted: false, avatar_url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop", created_at: "2026-03-19T17:25:00Z" },
  { id: "u-15", full_name: "Christian Bautista", username: "xtianb", email: "christian.b@iskolarngbayan.edu.ph", role: "user", points: 230, is_restricted: false, avatar_url: null, created_at: "2026-03-22T08:00:00Z" },
  { id: "u-16", full_name: "Jasmine Curtis", username: "jasminec", email: "jasmine.curtis@iskolarngbayan.edu.ph", role: "user", points: 95, is_restricted: true, avatar_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop", created_at: "2026-03-29T11:10:00Z" },
  { id: "u-17", full_name: "Paolo Ballesteros", username: "paolob", email: "paolo.b@iskolarngbayan.edu.ph", role: "user", points: 410, is_restricted: false, avatar_url: null, created_at: "2026-04-02T13:40:00Z" },
  { id: "u-18", full_name: "Katrina Halili", username: "katrinah", email: "katrina.h@iskolarngbayan.edu.ph", role: "user", points: 120, is_restricted: false, avatar_url: null, created_at: "2026-04-05T09:55:00Z" },
  { id: "u-19", full_name: "Mark Agcaoili", username: "marka", email: "mark.agcaoili@iskolarngbayan.edu.ph", role: "user", points: 330, is_restricted: false, avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", created_at: "2026-04-11T16:15:00Z" },
  { id: "u-20", full_name: "Rachel Alejandro", username: "rachela", email: "rachel.a@iskolarngbayan.edu.ph", role: "user", points: 880, is_restricted: false, avatar_url: null, created_at: "2026-04-15T14:20:00Z" },
  { id: "u-21", full_name: "Dominic Ochoa", username: "domo", email: "dominic.ochoa@iskolarngbayan.edu.ph", role: "user", points: 50, is_restricted: false, avatar_url: null, created_at: "2026-04-18T10:30:00Z" },
  { id: "u-22", full_name: "Nikki Gil", username: "nikkig", email: "nikki.gil@iskolarngbayan.edu.ph", role: "user", points: 1340, is_restricted: false, avatar_url: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&h=100&fit=crop", created_at: "2026-04-25T08:45:00Z" },
  { id: "u-23", full_name: "Ryan Agoncillo", username: "ryana", email: "ryan.agoncillo@iskolarngbayan.edu.ph", role: "admin", points: 1750, is_restricted: false, avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", created_at: "2026-01-02T09:00:00Z" },
  { id: "u-24", full_name: "Liza Soberano", username: "lizas", email: "liza.soberano@iskolarngbayan.edu.ph", role: "user", points: 2450, is_restricted: false, avatar_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop", created_at: "2026-05-01T11:20:00Z" },
  { id: "u-25", full_name: "Enrique Gil", username: "enriqueg", email: "enrique.gil@iskolarngbayan.edu.ph", role: "user", points: 110, is_restricted: true, avatar_url: null, created_at: "2026-05-04T15:10:00Z" },
  { id: "u-26", full_name: "Daniel Padilla", username: "djpadilla", email: "daniel.padilla@iskolarngbayan.edu.ph", role: "user", points: 920, is_restricted: false, avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", created_at: "2026-05-08T13:40:00Z" },
  { id: "u-27", full_name: "Kathryn Bernardo", username: "kathb", email: "kathryn.b@iskolarngbayan.edu.ph", role: "user", points: 3100, is_restricted: false, avatar_url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop", created_at: "2026-05-10T09:15:00Z" },
  { id: "u-28", full_name: "James Reid", username: "jamesr", email: "james.reid@iskolarngbayan.edu.ph", role: "user", points: 400, is_restricted: false, avatar_url: null, created_at: "2026-05-14T16:22:00Z" },
  { id: "u-29", full_name: "Nadine Lustre", username: "nadinel", email: "nadine.lustre@iskolarngbayan.edu.ph", role: "user", points: 2800, is_restricted: false, avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop", created_at: "2026-05-16T10:05:00Z" },
  { id: "u-30", full_name: "Vice Ganda", username: "viceg", email: "vice.ganda@iskolarngbayan.edu.ph", role: "user", points: 1500, is_restricted: false, avatar_url: null, created_at: "2026-05-20T14:50:00Z" },
  { id: "u-31", full_name: "Ion Perez", username: "ionp", email: "ion.perez@iskolarngbayan.edu.ph", role: "user", points: 280, is_restricted: false, avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop", created_at: "2026-05-22T11:15:00Z" },
  { id: "u-32", full_name: "Anne Curtis", username: "annec", email: "anne.curtis@iskolarngbayan.edu.ph", role: "user", points: 3500, is_restricted: false, avatar_url: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop", created_at: "2026-05-25T08:30:00Z" },
  { id: "u-33", full_name: "Vhong Navarro", username: "vhongn", email: "vhong.navarro@iskolarngbayan.edu.ph", role: "user", points: 610, is_restricted: false, avatar_url: null, created_at: "2026-06-01T13:12:00Z" },
  { id: "u-34", full_name: "Jhong Hilario", username: "jhongh", email: "jhong.hilario@iskolarngbayan.edu.ph", role: "user", points: 720, is_restricted: false, avatar_url: null, created_at: "2026-06-05T15:45:00Z" },
  { id: "u-35", full_name: "Karylle Tatlonghari", username: "karyllet", email: "karylle.t@iskolarngbayan.edu.ph", role: "user", points: 940, is_restricted: false, avatar_url: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=100&h=100&fit=crop", created_at: "2026-06-10T10:20:00Z" }
];

const mockItems = [
  { user_id: "u-1", type: "found" }, { user_id: "u-1", type: "found" },
  { user_id: "u-2", type: "lost" }, { user_id: "u-4", type: "found" },
];

const mockClaims = [{ claimer_id: "u-2" }, { claimer_id: "u-4" }, { claimer_id: "u-4" }];

const supabase = {
  from: (table) => ({
    select: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (table === "profiles") resolve({ data: [...mockProfiles], error: null });
          if (table === "items") resolve({ data: mockItems, error: null });
          if (table === "item_claims") resolve({ data: mockClaims, error: null });
        }, 500);
      });
    },
    update: (updates) => ({
      eq: (column, value) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            if (table === "profiles") {
              mockProfiles = mockProfiles.map(p => p.id === value ? { ...p, ...updates } : p);
            }
            resolve({ error: null });
          }, 400);
        });
      }
    })
  })
};

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null);

  useEffect(() => {
    fetchUsers();
    document.title = "User Management | BALIK Admin";
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [profilesRes, itemsRes, claimsRes] = await Promise.all([
        supabase.from("profiles").select("*"),
        supabase.from("items").select("*"),
        supabase.from("item_claims").select("*")
      ]);

      const itemCountMap = {};
      (itemsRes.data || []).forEach((item) => {
        if (!item.user_id) return;
        if (!itemCountMap[item.user_id]) itemCountMap[item.user_id] = { lost: 0, found: 0 };
        if (item.type === "lost") itemCountMap[item.user_id].lost++;
        else if (item.type === "found") itemCountMap[item.user_id].found++;
      });

      const claimCountMap = {};
      (claimsRes.data || []).forEach((claim) => {
        if (!claim.claimer_id) return;
        claimCountMap[claim.claimer_id] = (claimCountMap[claim.claimer_id] || 0) + 1;
      });

      const colors = ["bg-violet-500", "bg-blue-500", "bg-emerald-500", "bg-orange-500", "bg-rose-500", "bg-cyan-500"];

      const formatted = (profilesRes.data || []).map((p, idx) => {
        const initials = (p.full_name || p.username || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
        const counts = itemCountMap[p.id] || { lost: 0, found: 0 };
        const claimCount = claimCountMap[p.id] || 0;

        return {
          id: p.id,
          name: p.full_name || p.username || "Unknown",
          email: p.email || "",
          role: p.role === "admin" ? "Admin" : "User",
          points: p.points || 0,
          status: p.is_restricted ? "Restricted" : "Active",
          avatar: p.avatar_url || null,
          initials,
          color: colors[idx % colors.length],
          reports: { lost: counts.lost, found: counts.found, claims: claimCount },
          badges: p.points > 500 ? 2 : 0, 
          _raw: p
        };
      });

      setUsers(formatted);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "All" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const handleActionClick = (user, type) => {
    setSelectedUser(user);
    setActionType(type);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="h-full w-full overflow-y-auto custom-scrollbar bg-white/80 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-200/60 relative flex flex-col gap-6 sm:gap-8"
    >
      
      <UserStats users={users} loading={loading} />

      <UserFilterBar
        search={search}
        setSearch={setSearch}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />

      <UsersTable 
        users={filteredUsers} 
        loading={loading} 
        onRefresh={fetchUsers} 
        onActionClick={handleActionClick} 
      />

      {/* Modals */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {selectedUser && actionType && (
            <UserActionModal 
              user={selectedUser} 
              type={actionType} 
              onClose={() => { setSelectedUser(null); setActionType(null); }} 
              onRefresh={fetchUsers}
              supabaseMock={supabase} 
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
}