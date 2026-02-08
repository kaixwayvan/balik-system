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

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("achievements");
  const [achievementView, setAchievementView] = useState("challenges");

  return (
    <div className="p-6">
      {/* ================= PROFILE HEADER ================= */}
      <div className="px-6 pt-6">
        <div className="flex justify-between items-start">
          <div className="flex gap-6">
            <img
              src="https://images.unsplash.com/photo-1527980965255-d3b416303d12"
              alt="Profile"
              className="w-28 h-28 rounded-full border border-gray-300 shadow-md object-cover"
            />

            <div>
              <h2 className="text-2xl font-bold">Mike Wazowski</h2>
              <p className="text-sm text-gray-500">mike_wazowski@gmail.com</p>

              <p className="mt-2 text-sm italic text-gray-600">
                “Always here to help the BALIK community”
              </p>

              <div className="flex gap-4 mt-4">
                <StatCard
                  icon={<Award size={18} />}
                  title="5 Certificates"
                  subtitle="Achieved"
                />
                <StatCard
                  icon={<Trophy size={18} />}
                  title="Top Contributor"
                  subtitle="Ranked"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveTab("settings");
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
          <h2 className="text-2xl font-semibold">950</h2>
          <ProgressBar value={70} dark />
        </div>

        <div className="bg-white shadow-md border border-gray-300 rounded-lg p-4 flex gap-4 items-center">
          <Trophy className="text-yellow-500" />
          <div>
            <p className="text-sm text-gray-500">Task Completed</p>
            <h2 className="text-xl font-semibold">45%</h2>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white p-5 border border-gray-300 rounded-lg shadow-md">
        <p className="font-bold mb-4">Badges Earned</p>
        <div className="flex gap-3">
          <Badge
            label="First Report"
            icon={<Award size={17} className="text-indigo-600" />}
          />
          <Badge
            label="Trusted User"
            icon={<CircleStar size={17} className="text-yellow-600" />}
          />
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ChallengeCard
        icon={<GiStarsStack className="w-10 h-10 text-yellow-500" />}
        title="Community Helper"
        desc="Verified 20 claimed items"
        progress={75}
      />

      <ChallengeCard
        icon={<FaPeopleGroup className="w-10 h-10 text-cyan-400" />}
        title="Community Hero"
        desc="Helped recover 75 items"
        progress={40}
      />

      <ChallengeCard
        icon={<FaHandsHoldingCircle className="w-10 h-10 text-green-500" />}
        title="Volunteer"
        desc="Joined 5 community events"
        progress={25}
      />
    </div>
  );
}

function CertificatesSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <CertificateCard title="First Finder" />
      <CertificateCard title="Trusted User" />
      <CertificateCard title="Community Helper" />
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
  const fileInputRef = useRef(null);
  const [avatar, setAvatar] = useState(
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
  );
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <UserPen size={20} />
        Edit your Profile
      </h2>
      <div className="flex justify-center">
        <div className="relative">
          <img src={avatar} className="w-28 h-28 rounded-full object-cover" />
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
        <Input label="First Name" placeholder="John" />
        <Input label="Last Name" placeholder="Doe" />

        <Input label="Email Address" placeholder="example@gmail.com" />
        <Input label="Mobile Number" placeholder="09123456789" />
      </div>

      {/* Gender */}
      <div>
        <p className="text-sm font-medium mb-2">Gender (Optional)</p>
        <div className="flex gap-4">
          <GenderOption label="Male" />
          <GenderOption label="Female" />
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button className="cursor-pointer px-6 py-2 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600">
          Save Changes
        </button>
      </div>
    </div>
  );
}

/* Profile setting helper functions */

function Input({ label, placeholder }) {
  return (
    <div>
      <label className="text-sm font-medium">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        placeholder={placeholder}
        className="mt-1 w-full placeholder:italic border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
    </div>
  );
}

function GenderOption({ label }) {
  return (
    <label className="flex items-center gap-2 border rounded-lg px-4 py-2 cursor-pointer">
      <input type="radio" name="gender" />
      <span className="text-sm">{label}</span>
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
