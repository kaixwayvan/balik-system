import { useState, useRef, useEffect } from "react";
import {
  Trophy,
  Award,
  UserRound,
  ShieldUser,
  Settings2,
  CircleStar,
  SquareActivity,
  ShieldCheck,
  LogOut,
  FolderCog,
  ImagePlus,
  UserPen,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronRight
} from "lucide-react";
import { GiStarsStack } from "react-icons/gi";
import { FaPeopleGroup, FaHandsHoldingCircle } from "react-icons/fa6";
import { useAuth } from "../../../shared/context/AuthContext";
import { updateUserProfile, uploadAvatar } from "../../../pages/auth/services/supabaseAuthService";
import { itemService } from "../../../services/itemService";

export default function AdminProfile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("settings");
  const [activeSection, setActiveSection] = useState("profile");

  const avatarUrl = user?.user_metadata?.avatar_url || null;
  const fullName = user?.user_metadata?.full_name || "System Admin";
  const email = user?.email || "";

  const [stats, setStats] = useState({
    total: 0,
    lost: 0,
    found: 0,
    resolved: 0,
    processed: 124, // Mocked for admin
    matches: 45     // Mocked for admin
  });

  return (
    <div className="p-6">
      {/* ================= PROFILE HEADER ================= */}
      <div className="px-6 pt-6">
        <div className="flex justify-between items-start">
          <div className="flex gap-6">
            <div className="w-28 h-28 flex-shrink-0 rounded-full border border-gray-300 shadow-md bg-slate-300 flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover bg-white"
                />
              ) : (
                <UserRound size={64} className="text-gray-50" />
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold">{fullName}</h2>
              <p className="text-sm text-gray-500">{email}</p>

              <p className="mt-2 text-sm italic text-gray-600">
                “System Administrator · BALIK Platform”
              </p>

              <div className="flex gap-4 mt-4">
                <StatCard
                  icon={<Award size={18} />}
                  title={`${stats.processed} Processed`}
                  subtitle="Reports"
                />
                <StatCard
                  icon={<Trophy size={18} />}
                  title={`${stats.matches} Approved`}
                  subtitle="Matches"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveTab("settings");
              setActiveSection("profile");
            }}
            className="cursor-pointer px-6 py-2 bg-[#7B1C1C] text-white rounded-3xl text-sm hover:bg-red-800 transition-all shadow-md active:scale-95"
          >
            Edit Profile
          </button>
        </div>

        {/* ================= TOP TAB SWITCH ================= */}
        <div className="flex gap-6 border-b mt-6">
          <button
            onClick={() => setActiveTab("activity")}
            className={`cursor-pointer pb-2 px-4 rounded-t-xl py-2 text-sm font-medium hover:bg-gray-200 ${activeTab === "activity"
                ? "border-b-2 border-black text-black"
                : "text-gray-400"
              }`}
          >
            System Activity
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`cursor-pointer pb-2 px-4 py-2 rounded-t-xl text-sm font-medium hover:bg-gray-200 ${activeTab === "settings"
                ? "border-b-2 border-black text-black"
                : "text-gray-400"
              }`}
          >
            Account Settings
          </button>
        </div>
      </div>

      {/* ================= TAB CONTENT ================= */}
      {activeTab === "activity" && (
        <SystemActivity stats={stats} />
      )}

      {activeTab === "settings" && (
        <AccountSettings
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      )}
    </div>
  );
}

function SystemActivity({ stats }) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Administrative Performance</h3>
        <p className="text-sm text-gray-500">
          Your contributions to the BALIK platform management.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow-md border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Reports Processed</p>
          <h2 className="text-2xl font-semibold">{stats.processed}</h2>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
            <div className="h-2 rounded-full bg-gray-800" style={{ width: '65%' }} />
          </div>
        </div>

        <div className="bg-white shadow-md border border-gray-300 rounded-lg p-4 flex gap-4 items-center">
          <CheckCircle2 className="text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Approval Rate</p>
            <h2 className="text-xl font-semibold">92%</h2>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 border border-gray-300 rounded-lg shadow-md">
        <p className="font-bold mb-4">Recent Audit Log</p>
        <div className="space-y-4">
          <AuditLogItem action="Approved Match #4920" time="10 mins ago" type="success" />
          <AuditLogItem action="Encoded Lost Item: Blue Backpack" time="5 hours ago" type="info" />
          <AuditLogItem action="System Login" time="8 hours ago" type="info" />
        </div>
      </div>
    </div>
  );
}

function AuditLogItem({ action, time, type }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} />
        <span className="text-sm font-medium text-gray-700">{action}</span>
      </div>
      <span className="text-[10px] font-bold text-gray-400 uppercase">{time}</span>
    </div>
  );
}

function AccountSettings({ activeSection, setActiveSection }) {
  return (
    <div className="p-6 flex gap-6">
      {/* LEFT SIDEBAR */}
      <div className="w-64 h-max bg-white rounded-xl border border-gray-300 shadow-md py-4 space-y-2">
        <NavButton 
          active={activeSection === "profile"} 
          onClick={() => setActiveSection("profile")}
          icon={UserRound} 
          label="Profile Settings" 
        />
        <NavButton 
          active={activeSection === "security"} 
          onClick={() => setActiveSection("security")}
          icon={ShieldUser} 
          label="Security & Privacy" 
        />
        <NavButton 
          active={activeSection === "preferences"} 
          onClick={() => setActiveSection("preferences")}
          icon={Settings2} 
          label="Account Preferences" 
        />
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 bg-white rounded-xl border border-gray-300 shadow-md p-8">
        {activeSection === "profile" && <ProfileSettings />}
        {activeSection === "security" && <SecurityAndPrivacy />}
        {activeSection === "preferences" && <AccountPreferences />}
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer flex items-center relative w-full gap-3 pl-9 py-3 text-sm ${active
          ? "bg-indigo-100 text-indigo-700 font-bold"
          : "hover:bg-gray-100 text-gray-600"
        }`}
    >
      {active && (
        <span className="absolute left-0 top-0 bottom-0 w-6 bg-indigo-300" />
      )}
      <Icon size={15} /> {label}
    </button>
  );
}

function ProfileSettings() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(user?.user_metadata?.full_name?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(user?.user_metadata?.full_name?.split(" ").slice(1).join(" ") || "");
  const [contact, setContact] = useState(user?.user_metadata?.mobile_number || "");
  const [gender, setGender] = useState(user?.user_metadata?.gender || "");
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const fileInputRef = useRef(null);

  const handleSave = async () => {
    setIsSaving(true);
    setStatus({ type: "", message: "" });
    try {
      const { success, error } = await updateUserProfile(user.id, {
        full_name: `${firstName} ${lastName}`,
        mobile_number: contact,
        gender
      });
      if (success) {
        setStatus({ type: "success", message: "Profile updated successfully!" });
      } else {
        throw error;
      }
    } catch (err) {
      setStatus({ type: "error", message: "Failed to update profile." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <UserPen size={20} /> Edit Administrative Profile
        </h2>
        {status.message && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${status.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {status.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {status.message}
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <div className="relative group">
          <div className="w-28 h-28 rounded-full border border-gray-300 shadow-md bg-slate-300 flex items-center justify-center overflow-hidden">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover bg-white" />
            ) : (
              <UserRound size={64} className="text-gray-50" />
            )}
          </div>
          <button
            onClick={() => fileInputRef.current.click()}
            className="cursor-pointer absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700 transition-colors"
          >
            <ImagePlus size={15} />
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={async (e) => {
            const file = e.target.files[0];
            if (file) {
              setIsSaving(true);
              const { success, url } = await uploadAvatar(user.id, file);
              if (success) {
                await updateUserProfile(user.id, { avatar_url: url });
                setStatus({ type: "success", message: "Avatar updated!" });
              }
              setIsSaving(false);
            }
          }} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="First Name" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <Input label="Last Name" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <Input label="Email Address" placeholder="example@gmail.com" value={user?.email || ""} disabled />
        <Input label="Mobile Number" placeholder="09123456789" value={contact} onChange={(e) => setContact(e.target.value)} />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Gender (Optional)</p>
        <div className="flex gap-4">
          <GenderOption label="Male" checked={gender === "Male"} onChange={() => setGender("Male")} />
          <GenderOption label="Female" checked={gender === "Female"} onChange={() => setGender("Female")} />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="cursor-pointer px-8 py-2.5 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 disabled:bg-blue-300 transition-all flex items-center gap-2"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

function SecurityAndPrivacy() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <ShieldCheck size={20} /> Security & Auditing
      </h2>
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold mb-3">System Access Control</h3>
        <p className="text-sm text-gray-600 mb-4">Manage your administrative session and security protocols.</p>
        <button className="cursor-pointer w-full text-left px-4 py-3 border border-gray-300 rounded-lg text-sm hover:bg-white mb-3 flex justify-between items-center">
          Enable Two-Factor Authentication
          <span className="text-xs font-bold text-blue-600">Off</span>
        </button>
        <button className="cursor-pointer w-full text-left px-4 py-3 border border-gray-300 rounded-lg text-sm hover:bg-white flex justify-between items-center">
          Change System Password
          <ChevronRight size={14} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
}

function AccountPreferences() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <FolderCog size={20} /> System Preferences
      </h2>
      <div className="bg-white border border-gray-300 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-semibold">Language</p>
            <p className="text-xs text-gray-500">Select your preferred system language.</p>
          </div>
          <select className="cursor-pointer border rounded-lg px-4 py-2 text-sm">
            <option>English</option>
            <option>Filipino</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Compact View</p>
            <p className="text-xs text-gray-500">Optimize dashboard for high-density data.</p>
          </div>
          <div className="w-11 h-6 bg-gray-300 rounded-full relative cursor-pointer">
            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-1" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, placeholder, value, onChange, disabled }) {
  return (
    <div>
      <label className="text-sm font-medium">{label} <span className="text-red-500">*</span></label>
      <input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`mt-1 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
      />
    </div>
  );
}

function GenderOption({ label, checked, onChange }) {
  return (
    <label className={`flex items-center gap-2 border rounded-lg px-4 py-2 cursor-pointer transition-all ${checked ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500" : "hover:bg-gray-50"}`}>
      <input type="radio" checked={checked} onChange={onChange} className="cursor-pointer accent-indigo-600" />
      <span className={`text-sm ${checked ? "text-indigo-700 font-medium" : "text-gray-600"}`}>{label}</span>
    </label>
  );
}

function StatCard({ icon, title, subtitle }) {
  return (
    <div className="flex gap-2 items-center border rounded-lg px-5 py-2 text-sm">
      {icon}
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}
