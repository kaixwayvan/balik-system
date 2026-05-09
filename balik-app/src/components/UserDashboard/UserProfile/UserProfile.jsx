import { useState, useRef, useEffect } from "react";
import { useProfile } from "../../../hooks/useProfile";
import { supabase } from "../../../utils/supabaseClient";
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
} from "lucide-react";
import { GiStarsStack } from "react-icons/gi";
import { FaPeopleGroup, FaHandsHoldingCircle } from "react-icons/fa6";

export default function UserProfile() {
  const { profile, loading } = useProfile();
  const [activeTab, setActiveTab] = useState("achievements");
  const [achievementView, setAchievementView] = useState("challenges");
  const [activeSection, setActiveSection] = useState(null);

  const avatarUrl = profile?.avatar_url
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || "User")}&background=991b1b&color=fff&size=128&bold=true`;
  const userName = profile?.full_name || (loading ? "Loading..." : "---");
  const userEmail = profile?.email || "---";

  return (
    <div className="p-6">
      {/* ================= PROFILE HEADER ================= */}
      <div className="px-6 pt-6">
        <div className="flex justify-between items-start">
          <div className="flex gap-6">
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-28 h-28 rounded-full border border-gray-300 shadow-md object-cover"
            />

            <div>
              <h2 className="text-2xl font-bold">{userName}</h2>
              <p 
                className="text-sm text-gray-500 truncate max-w-[200px] md:max-w-xs" 
                title={userEmail}
              >
                {userEmail}
              </p>

              <p className="mt-2 text-sm italic text-gray-600">
                “Registered User”
              </p>

              <div className="flex gap-4 mt-4">
                <StatCard
                  icon={<Award size={18} />}
                  title="0 Certificates"
                  subtitle="Achieved"
                />
                <StatCard
                  icon={<Trophy size={18} />}
                  title="New Member"
                  subtitle="Ranked"
                />
              </div>
            </div>
          </div>


        </div>

        {/* ================= TOP TAB SWITCH ================= */}
        <div className="flex gap-6 border-b mt-6">
          <button
            onClick={() => setActiveTab("achievements")}
            className={`cursor-pointer pb-2 px-4 rounded-t-xl py-2 text-sm font-medium hover:bg-gray-200 ${activeTab === "achievements"
                ? "border-b-2 border-black text-black"
                : "text-gray-400"
              }`}
          >
            Achievements
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
      {activeTab === "achievements" && (
        <Achievements
          achievementView={achievementView}
          setAchievementView={setAchievementView}
        />
      )}

      {activeTab === "settings" && <AccountSettings />}
    </div>
  );
}

/* Achievement tab */

function Achievements({ achievementView, setAchievementView }) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Achievements</h3>
        <p className="text-sm text-gray-500">
          Your accomplishments and milestones in BALIK
        </p>
      </div>

      {/* Points + Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow-md border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Points</p>
          <h2 className="text-2xl font-semibold">0</h2>
          <ProgressBar value={0} dark />
        </div>

        <div className="bg-white shadow-md border border-gray-300 rounded-lg p-4 flex gap-4 items-center">
          <Trophy className="text-yellow-500" />
          <div>
            <p className="text-sm text-gray-500">Task Completed</p>
            <h2 className="text-xl font-semibold">0%</h2>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white p-5 border border-gray-300 rounded-lg shadow-md">
        <p className="font-bold mb-4">Badges Earned</p>
        <div className="flex gap-3 text-gray-400 text-sm italic">
          No badges earned yet.
        </div>
      </div>

      {/* ================= CHALLENGES / CERTIFICATES SWITCH ================= */}
      <div className="flex gap-3 items-center">
        <button
          onClick={() => setAchievementView("challenges")}
          className={`cursor-pointer px-8 py-2 rounded-lg text-sm font-medium ${achievementView === "challenges"
              ? "bg-indigo-800 text-white"
              : "border text-gray-600"
            }`}
        >
          Challenges
        </button>

        <button
          onClick={() => setAchievementView("certificates")}
          className={`cursor-pointer px-8 py-2 rounded-lg text-sm font-medium ${achievementView === "certificates"
              ? "bg-indigo-800 text-white"
              : "border text-gray-600"
            }`}
        >
          Certificates
        </button>

        <span className="ml-auto text-sm text-gray-400">
          Tip: Earn badges by helping others recover items
        </span>
      </div>

      {achievementView === "challenges" && <ChallengesSection />}
      {achievementView === "certificates" && <CertificatesSection />}
    </div>
  );
}

/* Achievements sections */

function ChallengesSection() {
  return (
    <div className="text-center py-10 text-gray-500">
      <p>No active challenges at the moment.</p>
    </div>
  );
}

function CertificatesSection() {
  return (
    <div className="text-center py-10 text-gray-500 col-span-3">
      <p>No certificates earned yet.</p>
    </div>
  );
}

function AccountSettings() {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="p-6 flex gap-6">
      {/* LEFT SIDEBAR */}
      <div className="w-64 h-46 bg-white rounded-xl border border-gray-300 shadow-md py-4 space-y-2">
        <button
          onClick={() => setActiveSection("profile")}
          className={`cursor-pointer flex items-center relative w-full flex items-center gap-2 pl-6 pr-4 pl-9 py-3 text-sm ${activeSection === "profile"
              ? "bg-indigo-100 text-indigo-700 font-bold"
              : "hover:bg-gray-100"
            }`}
        >
          {activeSection === "profile" && (
            <span className="absolute left-0 top-0 bottom-0 w-6 bg-indigo-300" />
          )}
          <UserRound size={15} /> Profile Settings
        </button>

        <button
          onClick={() => setActiveSection("security")}
          className={`cursor-pointer relative w-full flex items-center gap-3 pl-6 pr-4 pl-9 py-3 text-sm ${activeSection === "security"
              ? "bg-indigo-100 text-indigo-700 font-bold"
              : "hover:bg-gray-100"
            }`}
        >
          {activeSection === "security" && (
            <span className="absolute left-0 top-0 bottom-0 w-6 bg-indigo-300" />
          )}
          <ShieldUser size={15} /> Security and Privacy
        </button>

        <button
          onClick={() => setActiveSection("preferences")}
          className={`cursor-pointer relative w-full flex items-center gap-3 pl-6 pr-4 pl-9 py-3 text-sm ${activeSection === "preferences"
              ? "bg-indigo-100 text-indigo-700 font-bold"
              : "hover:bg-gray-100"
            }`}
        >
          {activeSection === "preferences" && (
            <span className="absolute left-0 top-0 bottom-0 w-6 bg-indigo-300" />
          )}
          <Settings2 size={15} /> Account Preferences
        </button>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 bg-white rounded-xl border border-gray-300 shadow-md p-8">
        {activeSection === "profile" && (
          <ProfileSettings
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        )}
        {activeSection === "security" && <SecurityAndPrivacy />}
        {activeSection === "preferences" && <AccountPreferences />}
      </div>
    </div>
  );
}

/* Small components */

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

function Badge({ label, icon, color }) {
  return (
    <div
      className={`flex items-center gap-1 px-5 py-3 bg-slate-200 border border-slate-300 rounded-lg text-sm font-medium`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

function ProgressBar({ value, dark }) {
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
      <div
        className={`h-2 rounded-full ${dark ? "bg-gray-800" : "bg-blue-500"}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function ChallengeCard({ icon, title, desc, progress }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow space-y-3">
      <div className="flex gap-3 items-center">
        {icon}
        <div>
          <h4 className="font-semibold">{title}</h4>
          <p className="text-sm text-gray-500">{desc}</p>
        </div>
      </div>

      <ProgressBar value={progress} />
      <p className="text-xs text-gray-500">{progress}% completed</p>
    </div>
  );
}

function CertificateCard({ title }) {
  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-lg p-4 text-center">
      🏆
      <p className="font-medium mt-2">{title}</p>
      <p className="text-xs text-gray-500">Awarded</p>
    </div>
  );
}

/* Account setting sections */

function ProfileSettings() {
  const { profile } = useProfile();
  const fileInputRef = useRef(null);

  const nameParts = profile?.full_name?.split(" ") || [];
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gender: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Populate form fields once profile data is loaded from Supabase
  useEffect(() => {
    if (!profile) return;

    const nameParts = profile.full_name?.split(" ") || [];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    setFormData({
      firstName,
      lastName,
      email: profile.email || "",
      mobile: profile.mobile_number || "",
      gender: profile.gender || "",
    });

    setAvatar(
      profile.avatar_url
      || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || "User")}&background=991b1b&color=fff&size=128&bold=true`
    );
  }, [profile]);

  const handleChange = (field, value) => setFormData((p) => ({ ...p, [field]: value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    try {
      let avatarUrl = profile.avatar_url;

      // Upload avatar if a new file was selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        // The RLS policy expects the file to be inside a folder named with the user's ID!
        const filePath = `${profile.id}/avatar.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        avatarUrl = publicUrlData.publicUrl;
      }

      // Update profile data in Supabase
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          mobile_number: formData.mobile,
          gender: formData.gender,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq("id", profile.id);

      if (error) throw error;
      
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      setAvatarFile(null); // Clear selected file after successful save
    } catch (err) {
      console.error("Error updating profile:", err.message);
      setMessage({ type: "error", text: "Failed to update profile." });
    } finally {
      setIsSaving(false);
    }
  };

  const placeholderAvatar = `https://ui-avatars.com/api/?name=User&background=991b1b&color=fff&size=128&bold=true`;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <UserPen size={20} />
        Edit your Profile
      </h2>
      <div className="flex justify-center">
        <div className="relative">
          <img src={avatar || placeholderAvatar} className="w-28 h-28 rounded-full object-cover" />
          <button
            onClick={() => fileInputRef.current.click()}
            className="cursor-pointer absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow"
          >
            <ImagePlus size={15} />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </div>

      {/* FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="First Name" value={formData.firstName} onChange={(v) => handleChange("firstName", v)} placeholder="Juan" />
        <Input label="Last Name" value={formData.lastName} onChange={(v) => handleChange("lastName", v)} placeholder="dela Cruz" />
        <Input label="Email Address" value={formData.email} onChange={(v) => handleChange("email", v)} placeholder="example@iskolarngbayan.pup.edu.ph" disabled />
        <Input label="Mobile Number" value={formData.mobile} onChange={(v) => handleChange("mobile", v)} placeholder="09123456789" />
      </div>

      {/* Gender */}
      <div>
        <p className="text-sm font-medium mb-2">Gender (Optional)</p>
        <div className="flex gap-4">
          <GenderOption label="Male" selected={formData.gender === "Male"} onChange={() => handleChange("gender", "Male")} />
          <GenderOption label="Female" selected={formData.gender === "Female"} onChange={() => handleChange("gender", "Female")} />
        </div>
      </div>

      {/* Save */}
      <div className="flex flex-col items-end gap-3">
        {message.text && (
          <p className={`text-sm font-medium ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
            {message.text}
          </p>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="cursor-pointer px-6 py-2 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

/* Profile setting helper functions */

function Input({ label, placeholder, value, onChange, disabled }) {
  return (
    <div>
      <label className="text-sm font-medium">
        {label} {!disabled && <span className="text-red-500">*</span>}
      </label>
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={`mt-1 w-full placeholder:italic border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
          }`}
      />
    </div>
  );
}

function GenderOption({ label, selected, onChange }) {
  return (
    <label
      onClick={onChange}
      className={`flex items-center gap-2 border rounded-lg px-4 py-2 cursor-pointer transition-colors ${selected ? "border-indigo-500 bg-indigo-50 text-indigo-700" : ""
        }`}
    >
      <input type="radio" name="gender" checked={selected} onChange={() => { }} className="accent-indigo-600" />
      <span className="text-sm">{label}</span>
    </label>
  );
}

/* Account setting sections */

function SecurityAndPrivacy() {
  const { profile } = useProfile();

  const formatLastLogin = (timestamp) => {
    if (!timestamp) return "---";
    return new Intl.DateTimeFormat("en-PH", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(timestamp));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <ShieldCheck size={20} />
        Privacy and Security
      </h2>

      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
        <h3 className="font-semibold mb-3">Privacy controls</h3>
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
          <li>Update permissions for connected devices and apps</li>
          <li>Review data sharing preferences</li>
          <li>Manage who can see your profile information</li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <SquareActivity size={18} />
          Login Activity
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-100 border border-gray-200 shadow-md rounded-xl p-5">
            <p className="text-sm font-medium">Last Login</p>
            <p className="text-sm text-gray-600 mt-2">
              {formatLastLogin(profile?.last_sign_in_at)}
            </p>
          </div>

          <div className="bg-gray-100 border border-gray-200 shadow-md rounded-xl p-5">
            <p className="text-sm font-medium">Active Session</p>
            <p className="text-sm text-gray-600 mt-2">
              1 device currently logged in
            </p>

            <button className="cursor-pointer mt-3 px-4 py-1.5 bg-black hover:bg-gray-700 text-white text-xs rounded-md">
              View Device
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 space-y-3">
        <h3 className="font-semibold mb-2">Security Option</h3>

        <button className="cursor-pointer w-full border border-gray-300 shadow-sm rounded-lg px-4 py-3 text-sm text-left hover:bg-gray-50">
          Enable Two-Factor Authentication
        </button>

        <button className="cursor-pointer w-full border border-gray-300 shadow-sm rounded-lg px-4 py-3 text-sm text-left hover:bg-gray-50">
          Change Password
        </button>

        <button className="cursor-pointer w-full border shadow-sm rounded-lg px-4 py-3 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2">
          <LogOut size={16} />
          Logout All Devices
        </button>
      </div>
    </div>
  );
}

function AccountPreferences() {
  return (
    <div>
      {/* TITLE */}
      <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
        <FolderCog size={20} />
        Account Preferences
      </h2>

      <div className="bg-white border border-gray-300 shadow-md rounded-xl p-6 mb-6">
        <h4 className="text-lg font-semibold mb-4">Display Settings</h4>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium">Language</p>
          <select className="cursor-pointer border rounded-lg px-4 py-2 text-sm">
            <option>English</option>
            <option>Filipino</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Theme Mode</p>
          <ThemeToggle />
        </div>
      </div>

      <div className="bg-white border border-gray-300 shadow-md rounded-xl p-6 mb-6">
        <h4 className="text-lg font-semibold mb-4">Connected Services</h4>

        <div className="flex items-center justify-between">
          <p className="text-sm">Google Account – Connected</p>
          <button className="cursor-pointer px-4 py-2 border rounded-lg text-sm hover:bg-gray-100">
            Disconnect
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-300 shadow-md rounded-xl shadow p-6 mb-4">
        <h4 className="text-lg font-semibold mb-4">Account Management</h4>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm">Deactivate Account</p>
          <button className="cursor-pointer w-32 px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">
            Deactivate
          </button>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm">Delete Account</p>
          <button className="cursor-pointer w-32 px-5 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* Account preferences helper function */

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      onClick={() => setDarkMode(!darkMode)}
      className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${darkMode ? "bg-gray-700" : "bg-gray-300"
        }`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${darkMode ? "translate-x-5" : "translate-x-1"
          }`}
      />
    </div>
  );
}
