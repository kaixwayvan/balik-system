import { useState, useRef } from "react";
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
import { useAuth } from "../../../shared/context/AuthContext";
import { updateUserProfile, uploadAvatar } from "../../../pages/auth/services/supabaseAuthService";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { itemService } from "../../../services/itemService";
import { useEffect } from "react";


export default function UserProfile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("achievements");
  const [achievementView, setAchievementView] = useState("challenges");
  const [activeSection, setActiveSection] = useState("profile");

  const avatarUrl = user?.user_metadata?.avatar_url || null;
  const fullName = user?.user_metadata?.full_name || "Registered User";
  const email = user?.email || "";

  const [stats, setStats] = useState({
    total: 0,
    lost: 0,
    found: 0,
    resolved: 0,
    points: user?.user_metadata?.points || 0,
    badges: user?.user_metadata?.badges || [],
    certificates: user?.user_metadata?.certificates || []
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchUserStats = async () => {
    if (!user?.id) return;
    try {
      if (stats.total === 0) {
        console.log("[UserProfile] Initial stats fetch. Showing spinner.");
        setLoadingStats(true);
      } else {
        console.log("[UserProfile] Background stats refresh. UI remains interactive.");
      }
      
      const data = await itemService.getUserStats(user.id);
      setStats(prev => ({
        ...prev,
        ...data,
        points: user?.user_metadata?.points || (data.resolved * 100) || 0,
        badges: user?.user_metadata?.badges || (data.resolved > 0 ? ['First Report'] : []),
        certificates: user?.user_metadata?.certificates || (data.resolved > 5 ? ['Community Helper'] : [])
      }));
    } catch (err) {
      console.error("Failed to fetch user stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, [user?.id]);

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
                “Always here to help the BALIK community”
              </p>

              <div className="flex gap-4 mt-4">
                <StatCard
                  icon={<Award size={18} />}
                  title={`${stats.certificates.length || 0} Certificates`}
                  subtitle="Achieved"
                />
                <StatCard
                  icon={<Trophy size={18} />}
                  title={stats.resolved > 10 ? "Elite Finder" : stats.resolved > 0 ? "Active Member" : "New Member"}
                  subtitle="Ranked"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveTab("settings");
              setActiveSection("profile");
            }}
            className="cursor-pointer px-6 py-2 bg-blue-500 text-white rounded-3xl text-sm hover:bg-blue-600"
          >
            Edit Profile
          </button>
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
          stats={stats}
        />
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

/* Achievement tab */
function Achievements({ achievementView, setAchievementView, stats }) {
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
          <h2 className="text-2xl font-semibold">{stats.points}</h2>
          <ProgressBar value={Math.min((stats.points / 2000) * 100, 100)} dark />
        </div>

        <div className="bg-white shadow-md border border-gray-300 rounded-lg p-4 flex gap-4 items-center">
          <Trophy className="text-yellow-500" />
          <div>
            <p className="text-sm text-gray-500">Resolution Rate</p>
            <h2 className="text-xl font-semibold">
              {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
            </h2>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white p-5 border border-gray-300 rounded-lg shadow-md">
        <p className="font-bold mb-4">Badges Earned</p>
        <div className="flex flex-wrap gap-3">
          {stats.badges.length > 0 ? (
            stats.badges.map((badge, idx) => (
              <Badge
                key={idx}
                label={badge}
                icon={<Award size={17} className="text-indigo-600" />}
              />
            ))
          ) : (
            <p className="text-sm text-gray-400 italic">No badges earned yet. Keep reporting!</p>
          )}
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

      {achievementView === "challenges" && <ChallengesSection stats={stats} />}
      {achievementView === "certificates" && <CertificatesSection certificates={stats.certificates} />}
    </div>
  );
}

/* Achievements sections */

function ChallengesSection({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ChallengeCard
        icon={<GiStarsStack className="w-10 h-10 text-yellow-500" />}
        title="Community Helper"
        desc={`Resolve 5 items (${stats.resolved}/5)`}
        progress={Math.min((stats.resolved / 5) * 100, 100)}
      />

      <ChallengeCard
        icon={<FaPeopleGroup className="w-10 h-10 text-cyan-400" />}
        title="First Report"
        desc={stats.total > 0 ? "Challenge completed!" : "Report your first item"}
        progress={stats.total > 0 ? 100 : 0}
      />

      <ChallengeCard
        icon={<FaHandsHoldingCircle className="w-10 h-10 text-green-500" />}
        title="Reliable Finder"
        desc="Return 10 found items"
        progress={Math.min((stats.found / 10) * 100, 100)}
      />
    </div>
  );
}

function CertificatesSection({ certificates }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {certificates.length > 0 ? (
        certificates.map((cert, idx) => (
          <CertificateCard key={idx} title={cert} />
        ))
      ) : (
        <div className="col-span-full py-10 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 italic">No certificates achieved yet.</p>
        </div>
      )}
    </div>
  );
}

function AccountSettings({ activeSection, setActiveSection }) {
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

function Badge({ label, icon }) {
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
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef(null);

  const initialAvatar = user?.user_metadata?.avatar_url || null;
  const [avatar, setAvatar] = useState(initialAvatar);
  const [selectedFile, setSelectedFile] = useState(null);

  // Extract user details
  const fullNameStr = user?.user_metadata?.full_name || "";
  const nameParts = fullNameStr.split(" ");
  const initialFirstName = nameParts[0] || "";
  const initialLastName = nameParts.slice(1).join(" ") || "";
  const initialEmail = user?.email || "";
  const initialContact = user?.user_metadata?.mobile_number || "";
  const initialGender = user?.user_metadata?.gender || "";

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(initialEmail);
  const [contact, setContact] = useState(initialContact);
  const [gender, setGender] = useState(initialGender);

  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setAvatar(URL.createObjectURL(file));
    }
  };

  const [saveStep, setSaveStep] = useState("");

  const handleSave = async () => {
    if (!firstName || !lastName) {
      setStatus({ type: "error", message: "First and last names are required." });
      return;
    }

    setIsSaving(true);
    setStatus({ type: "", message: "" });
    setSaveStep("Starting...");

    // Safety timeout: Guaranteed to stop the spinner after 10 seconds
    const timeoutId = setTimeout(() => {
      setIsSaving(false);
      setSaveStep("");
      setStatus({ type: "error", message: "Save timed out. Please check your internet and refresh." });
    }, 10000);

    try {
      let finalAvatarUrl = avatar;

      if (selectedFile) {
        setSaveStep("Uploading Image...");
        const uploadResult = await uploadAvatar(user.id, selectedFile);
        if (uploadResult.success) {
          finalAvatarUrl = uploadResult.url;
        } else {
          throw new Error("Upload failed: " + uploadResult.error);
        }
      }

      const updates = {
        full_name: `${firstName} ${lastName}`.trim(),
        mobile_number: contact,
        avatar_url: finalAvatarUrl,
        gender: gender,
      };

      setSaveStep("Updating Account...");
      // Add a wrapper timeout for the entire service call just in case the Supabase client itself locks up
      const serviceTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Supabase client hung completely")), 8000));

      const result = await Promise.race([
        updateUserProfile(user.id, updates),
        serviceTimeout
      ]);

      if (result.success) {
        setSaveStep("Success!");
        setStatus({ type: "success", message: "Profile updated successfully!" });
      } else {
        setStatus({ type: "error", message: "Partial success: Database sync failed." });
      }
    } catch (err) {
      console.error("Save Error:", err);
      setStatus({ type: "error", message: err.message || "Failed to update profile." });
    } finally {
      clearTimeout(timeoutId);
      setIsSaving(false);
      setSaveStep("");
    }
  };





  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <UserPen size={20} />
          Edit your Profile
        </h2>
        {status.message && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm animate-in fade-in slide-in-from-top-2 duration-300 ${status.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
            {status.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {status.message}
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <div className="relative">
          <div className="w-28 h-28 rounded-full border border-gray-300 shadow-md bg-slate-300 flex items-center justify-center overflow-hidden">
            {avatar ? (
              <img src={avatar} alt="Profile" className="w-full h-full object-cover bg-white" />
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
        <Input label="First Name" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <Input label="Last Name" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />

        <Input label="Email Address" placeholder="example@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
        <Input label="Mobile Number" placeholder="09123456789" value={contact} onChange={(e) => setContact(e.target.value)} />
      </div>

      {/* Gender */}
      <div>
        <p className="text-sm font-medium mb-2">Gender (Optional)</p>
        <div className="flex gap-4">
          <GenderOption
            label="Male"
            checked={gender === "Male"}
            onChange={() => setGender("Male")}
          />
          <GenderOption
            label="Female"
            checked={gender === "Female"}
            onChange={() => setGender("Female")}
          />
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="cursor-pointer px-8 py-2.5 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-md active:scale-95"
        >
          {isSaving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {saveStep}
            </>
          ) : (
            "Save Changes"
          )}

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
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`mt-1 w-full placeholder:italic border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
      />
    </div>
  );
}

function GenderOption({ label, checked, onChange }) {
  return (
    <label className={`flex items-center gap-2 border rounded-lg px-4 py-2 cursor-pointer transition-all ${checked ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500" : "hover:bg-gray-50"
      }`}>
      <input
        type="radio"
        name="gender"
        checked={checked}
        onChange={onChange}
        className="cursor-pointer accent-indigo-600"
      />
      <span className={`text-sm ${checked ? "text-indigo-700 font-medium" : "text-gray-600"}`}>{label}</span>
    </label>
  );
}


/* Account setting sections */

function SecurityAndPrivacy() {
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
              December 11, 2025 – 10:45 PM
              <br />
              Chrome – Windows
            </p>
          </div>

          <div className="bg-gray-100 border border-gray-200 shadow-md rounded-xl p-5">
            <p className="text-sm font-medium">Active Session</p>
            <p className="text-sm text-gray-600 mt-2">
              3 devices currently logged in
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
