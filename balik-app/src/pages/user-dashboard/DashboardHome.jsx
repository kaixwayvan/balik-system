<<<<<<< HEAD
import { useState } from "react";
import { Plus, X, AlertCircle, Calendar } from "lucide-react";
import WelcomeBanner from "../../components/UserDashboardHome/WelcomeBanner";
import StatsCards from "../../components/UserDashboardHome/StatsCards";
import QuickActions from "../../components/UserDashboardHome/QuickActions";
import PointsPanel from "../../components/UserDashboardHome/PointsPanel";
import RecentActivity from "../../components/UserDashboardHome/RecentActivity";
import AchievementsPanel from "../../components/UserDashboardHome/AchievementsPanel";
=======
import WelcomeBanner from "../../components/UserDashboard/Home/WelcomeBanner";
import StatsCards from "../../components/UserDashboard/Home/StatsCards";
import QuickActions from "../../components/UserDashboard/Home/QuickActions";
import PointsPanel from "../../components/UserDashboard/Home/PointsPanel";
import RecentActivity from "../../components/UserDashboard/Home/RecentActivity";
import AchievementsPanel from "../../components/UserDashboard/Home/AchievementsPanel";
>>>>>>> origin/user-dashboard

const initialLostFormData = {
  reportType: "Missing Item",
  whatWasLost: "",
  itemCategory: "",
  dateLost: "",
  brand: "",
  color: "",
  location: "",
  additionalInfo: "",
  photo: null,
  reporterName: "",
  mobileNumber: "",
  email: "",
};

export default function DashboardHome() {
  const [showReportModal, setShowReportModal] = useState(false);
  const [showLostItemForm, setShowLostItemForm] = useState(false);
  const [lostFormData, setLostFormData] = useState(initialLostFormData);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleReportClick = () => {
    setShowReportModal(true);
  };

  const handleReportLost = () => {
    setShowReportModal(false);
    setShowLostItemForm(true);
  };

  const handleReportFound = () => {
    setShowReportModal(false);
    // TODO: Navigate to Report Found Item form or show it
    console.log("Report Found Item clicked");
  };

  const handleLostFormChange = (e) => {
    const { name, value } = e.target;
    setLostFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0] || null;
    setLostFormData((prev) => ({ ...prev, photo: file }));
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleLostFormSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields
    if (
      !lostFormData.reportType ||
      !lostFormData.whatWasLost ||
      !lostFormData.itemCategory ||
      !lostFormData.dateLost ||
      !lostFormData.reporterName ||
      !lostFormData.mobileNumber ||
      !lostFormData.email
    ) {
      alert("Please fill all required fields.");
      return;
    }

    console.log("Submitting Lost Item Report:", lostFormData);
    // TODO: Send to backend API
    alert("Lost item report submitted successfully!");
    setShowLostItemForm(false);
    setLostFormData(initialLostFormData);
    setPhotoPreview(null);
  };

  const handleLostFormCancel = () => {
    setShowLostItemForm(false);
    setLostFormData(initialLostFormData);
    setPhotoPreview(null);
  };

  return (
    <div className="min-h-screen bg-slate-200 p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Welcome Banner – full width */}
        <div className="col-span-12">
          <WelcomeBanner />
        </div>

        {/* Stats Cards – full width */}
        <div className="col-span-12">
          <StatsCards />
        </div>

        {/* LEFT COLUMN */}
        <div className="col-span-8 space-y-6">
          <QuickActions onReportClick={handleReportClick} />
          <RecentActivity />
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-4 space-y-6">
          <PointsPanel />
          <AchievementsPanel />
        </div>
      </div>

      {/* Choose Report Type Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl max-w-md w-full p-8 relative mx-4 shadow-xl">
            {/* Close button */}
            <button
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Choose Report Type
            </h2>

            {/* Info message */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 mb-6">
              <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                Please select whether you are identifying a personal item you have lost or submitting details about property you have found.
              </p>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleReportLost}
                className="w-full py-4 px-6 bg-[#7B1C1C] hover:bg-[#5a1515] text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition"
              >
                <Plus size={20} />
                Report Lost Item
              </button>

              <button
                onClick={handleReportFound}
                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition"
              >
                <Plus size={20} />
                Report Found Item
              </button>
            </div>

            {/* Cancel button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-8 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Lost Item Report Modal */}
      {showLostItemForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto py-8">
          <div className="bg-white rounded-xl max-w-4xl w-full p-8 relative mx-4 shadow-xl my-auto">
            {/* Header */}
            <h2 className="text-2xl font-bold text-[#7B1C1C] mb-1">
              Submit a Report
            </h2>
            <p className="text-gray-600 mb-6">
              Our Online Lost & Found can Help you Find what you are Looking For!
            </p>

            <form onSubmit={handleLostFormSubmit}>
              {/* Row 1: Report Type & What was Lost */}
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block font-semibold mb-1">
                    Report Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="reportType"
                    value={lostFormData.reportType}
                    onChange={handleLostFormChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Missing Item">Missing Item</option>
                    <option value="Stolen Item">Stolen Item</option>
                    <option value="Misplaced Item">Misplaced Item</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">
                    What was Lost<span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-1">(Pen, Jacket, Smartphone, Wallet, etc.)</p>
                  <input
                    type="text"
                    name="whatWasLost"
                    value={lostFormData.whatWasLost}
                    onChange={handleLostFormChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Row 2: Item Category & Date Lost */}
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block font-semibold mb-1">
                    Item Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="itemCategory"
                    value={lostFormData.itemCategory}
                    onChange={handleLostFormChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Bags">Bags</option>
                    <option value="Documents">Documents</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">
                    Date Lost<span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-1">Please add the approximate date of when the item was lost /found.</p>
                  <input
                    type="date"
                    name="dateLost"
                    value={lostFormData.dateLost}
                    onChange={handleLostFormChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 cursor-pointer"
                    onClick={(e) => e.target.showPicker?.()}
                  />
                </div>
              </div>

              {/* Row 3: Brand, Color, Location */}
              <div className="grid grid-cols-3 gap-6 mb-4">
                <div>
                  <label className="block font-semibold mb-1">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={lostFormData.brand}
                    onChange={handleLostFormChange}
                    placeholder="Guss/louivutin"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Color</label>
                  <select
                    name="color"
                    value={lostFormData.color}
                    onChange={handleLostFormChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select color</option>
                    <option value="Black">Black</option>
                    <option value="White">White</option>
                    <option value="Red">Red</option>
                    <option value="Blue">Blue</option>
                    <option value="Green">Green</option>
                    <option value="Yellow">Yellow</option>
                    <option value="Brown">Brown</option>
                    <option value="Gray">Gray</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={lostFormData.location}
                    onChange={handleLostFormChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Row 4: Additional Info & Photo */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block font-semibold mb-1">Additional Information</label>
                  <p className="text-xs text-gray-500 mb-1">Please provide any additional details/description of your item.</p>
                  <textarea
                    name="additionalInfo"
                    value={lostFormData.additionalInfo}
                    onChange={handleLostFormChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Photo (Optional)</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handlePhotoChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, GIF (Max 5MB)</p>
                  {photoPreview && (
                    <img src={photoPreview} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded" />
                  )}
                </div>
              </div>

              {/* Reporters Information Section */}
              <h3 className="text-xl font-bold text-[#7B1C1C] mb-4">
                Reporters Information
              </h3>

              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block font-semibold mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="reporterName"
                    value={lostFormData.reporterName}
                    onChange={handleLostFormChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={lostFormData.mobileNumber}
                    onChange={handleLostFormChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={lostFormData.email}
                    onChange={handleLostFormChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  type="button"
                  onClick={handleLostFormCancel}
                  className="px-12 py-3 border border-gray-400 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-12 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
