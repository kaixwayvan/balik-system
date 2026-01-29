import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import ReportCard from "./ReportCard";
import ConfirmMatchModal from "./ConfirmMatchModal";
import ClaimModal from "./ClaimModal";

import Id from "../../../assets/home-assets/img-items/id.png";
import Camera from "../../../assets/home-assets/img-items/camera.png";
import GreenWallet from "../../../assets/home-assets/img-items/wallet-green.png";

export const STATUS_STYLES = {
  matches: {
    label: "Potential Matches Found",
    cardBg: "bg-yellow-50",
    border: "border-yellow-600",
    badge: "bg-yellow-100 text-yellow-700 border-yellow-300",
    progress: "bg-yellow-500",
  },
  searching: {
    label: "Actively Searching",
    cardBg: "bg-blue-50",
    border: "border-blue-400",
    badge: "bg-blue-100 text-blue-700 border-blue-300",
    progress: "bg-blue-500",
  },
  claimed: {
    label: "Successfully Claimed",
    cardBg: "bg-green-50",
    border: "border-green-400",
    badge: "bg-green-100 text-green-700 border-green-300",
    progress: "bg-green-500",
  },
};

const reports = [
  {
    id: 1,
    title: "ID Card",
    description: "ID Card with Silver Star key-chain",
    image: Id,
    location: "PUP-ITECH Lab 105",
    timeAgo: "6 days ago",
    progress: 60,
    status: "matches",
  },
  {
    id: 2,
    title: "Camera",
    description: "Pink Sony Digital Camera with camera jewelry",
    image: Camera,
    location: "PUP-CEA",
    timeAgo: "3 days ago",
    progress: 30,
    status: "searching",
  },
  {
    id: 3,
    title: "Card Holder",
    description:
      "Dark green card holder with yellow stitchings on the side, along with the cards inside",
    image: GreenWallet,
    location: "PUP-Lagoon",
    timeAgo: "1 day ago",
    progress: 100,
    status: "claimed",
  },
];

export default function ActiveReports() {
  const [openReportId, setOpenReportId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showClaim, setShowClaim] = useState(false);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    lostLocation: "",
    lostDate: "",
    description: "",
    category: "",
    otherCategory: "",
    identifiers: "",
    itemType: "",
    colorMaterial: "",
    uniqueMarks: "",
    brand: "",
    insideItems: "",
    secretItem: "",
    lastSeen: "",
  });

  const [errors, setErrors] = useState({});
  const categories = ["ID", "Wallet", "Electronics", "Others"];

  useEffect(() => {
    document.body.style.overflow =
      showConfirmModal || showClaim ? "hidden" : "auto";
  }, [showConfirmModal, showClaim]);

  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Active Reports</h1>
          <p className="text-sm text-gray-600">
            Track your reported lost items
          </p>
        </div>

        <Link to="/submitreport">
          <button className="cursor-pointer flex items-center gap-1 bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded-lg font-medium">
            <Plus size={13} /> Report Lost Item
          </button>
        </Link>
      </div>

      {/* REPORT LIST */}
      <div className="space-y-6">
        {reports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            openReportId={openReportId}
            setOpenReportId={setOpenReportId}
            onClaim={() => setShowConfirmModal(true)}
          />
        ))}
      </div>

      {showConfirmModal && (
        <ConfirmMatchModal
          onClose={() => setShowConfirmModal(false)}
          onConfirm={() => {
            setShowConfirmModal(false);
            setShowClaim(true);
            setStep(1);
          }}
        />
      )}

      {showClaim && (
        <ClaimModal
          showClaim={showClaim}
          setShowClaim={setShowClaim}
          step={step}
          setStep={setStep}
          form={form}
          setForm={setForm}
          errors={errors}
          setErrors={setErrors}
          categories={categories}
        />
      )}
    </div>
  );
}
