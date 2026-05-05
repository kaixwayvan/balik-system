import { useState } from "react";
import {
  MapPin,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  QrCode,
  Info,
} from "lucide-react";
import ClaimQrModal from "./ClaimQrModal";
import ClaimDetailsModal from "./ClaimDetailsModal";

<<<<<<< HEAD
const TABS = ["All Claims", "Pending", "Approved", "Released"];

const claimsData = [];
=======
import BlackWallet from "../../../assets/home-assets/img-items/wallet-black2.png";
import BlueTumbler from "../../../assets/home-assets/img-items/bottle-blue.png";
import Umbrella from "../../../assets/home-assets/img-items/umbrella.png";
import Eyeglass from "../../../assets/home-assets/img-items/eyeglass.png";

const TABS = ["All Claims", "Pending", "Approved", "Released"];

const claimsData = [
  {
    id: 1,
    title: "Black Leather Wallet",
    category: "Wallet",
    location: "ITECH Lost and Found Booth",
    description: "YSL Black Leather Wallet containing credit cards and ID",
    foundAt: "PUP Main Lagoon",
    date: "2025-11-28",
    points: 50,
    status: "Approved",
    image: BlackWallet,

    booth: "ITECH Lost and Found Booth",
    dateFound: "November 28, 2025",
    dateClaimed: "November 29, 2025",
    claimId: "CLM001",
    qrCode: "QR-CLM001-2025",
  },
  {
    id: 2,
    title: "Blue Tumbler",
    category: "Tumbler",
    location: "Main Lost and Found booth / Information desk",
    description: "Blue stainless steel tumbler with PUP sticker",
    foundAt: "Main building - Library",
    date: "2025-11-28",
    points: 30,
    status: "Released",
    image: BlueTumbler,

    booth: "PUP Main Lost and Found Booth",
    dateFound: "November 28, 2025",
    dateClaimed: "November 29, 2025",
    claimId: "CLM002",
    qrCode: "QR-CLM002-2025",
  },
  {
    id: 3,
    title: "Red Umbrella",
    category: "Umbrella",
    location: "USSO Office",
    description: "Red folding umbrella with wooden handle",
    foundAt: "USSO Office",
    date: "2025-11-28",
    points: 20,
    status: "Pending",
    image: Umbrella,

    booth: "PUP Main Lost and Found Booth",
    dateFound: "November 28, 2025",
    dateClaimed: "November 29, 2025",
    claimId: "CLM003",
    qrCode: "QR-CLM003-2025",
  },
  {
    id: 4,
    title: "Black Eyeglasses",
    category: "Accessories",
    location: "ITECH Lost and Found Booth",
    description: "Black frame eyeglasses in brown case",
    foundAt: "Main Building Restroom",
    date: "2025-11-28",
    points: 0,
    status: "Rejected",
    image: Eyeglass,

    booth: "ITECH Lost and Found Booth",
    dateFound: "November 28, 2025",
    dateClaimed: "November 29, 2025",
    claimId: "CLM004",
    qrCode: "QR-CLM004-2025",
  },
];
>>>>>>> f6895e0c (complete myclaims)

const statusStyles = {
  Approved: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Released: "bg-blue-100 text-blue-700",
  Rejected: "bg-red-100 text-red-700",
};

export default function MyClaims() {
  const [activeTab, setActiveTab] = useState("All Claims");
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredClaims =
    activeTab === "All Claims"
      ? claimsData
      : claimsData.filter((c) => c.status === activeTab);

  return (
    <div className="p-8">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-1">My Claims</h1>
      <p className="text-sm text-gray-500 mb-6">
        Track all your claimed items and their status
      </p>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
<<<<<<< HEAD
            className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium ${activeTab === tab
              ? "bg-red-600 text-white hover:bg-red-800"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
=======
            className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === tab
                ? "bg-red-600 text-white hover:bg-red-800"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
>>>>>>> f6895e0c (complete myclaims)
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Claims List */}
      <div className="space-y-5">
<<<<<<< HEAD
        {filteredClaims.length > 0 ? (
          filteredClaims.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm p-5 flex gap-5"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-28 h-28 rounded-lg object-cover bg-gray-100"
              />

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800">{item.title}</h2>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${statusStyles[item.status]}`}
                  >
                    {item.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-1">{item.description}</p>

                <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-3">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    Found at: <b>{item.foundAt}</b>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {item.date}
                  </span>
                  <span className="font-bold text-orange-500">
                    +{item.points} points
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                  {item.status === "Approved" && (
                    <button
                      onClick={() => {
                        setSelectedClaim(item);
                        setShowQrModal(true);
                      }}
                      className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm bg-red-600 hover:bg-red-800 text-white rounded-lg"
                    >
                      View QR Code
                    </button>
                  )}

                  {item.status === "Released" && (
                    <button className="cursor-not-allowed flex items-center gap-2 px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg">
                      <CheckCircle size={16} />
                      Item successfully collected
                    </button>
                  )}

                  {item.status === "Pending" && (
                    <button className="cursor-not-allowed flex items-center gap-2 px-4 py-2 text-sm bg-yellow-100 text-yellow-700 rounded-lg">
                      <Clock size={16} />
                      Waiting for admin approval
                    </button>
                  )}

                  {item.status === "Rejected" && (
                    <button className="cursor-not-allowed flex items-center gap-2 px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg">
                      <XCircle size={16} />
                      Claim rejected – Verification Failed
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setSelectedClaim(item);
                      setShowDetails(true);
                    }}
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                  >
                    <Eye size={16} />
                    View details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <p className="text-gray-500 font-medium italic">You haven't claimed any items yet.</p>
          </div>
        )}
=======
        {filteredClaims.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm p-5 flex gap-5"
          >
            {/* Image */}
            <img
              src={item.image}
              alt={item.title}
              className="w-28 h-28 rounded-lg object-cover bg-gray-100"
            />

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">{item.title}</h2>
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${statusStyles[item.status]}`}
                >
                  {item.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-1">{item.description}</p>

              <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-3">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  Found at: <b>{item.foundAt}</b>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {item.date}
                </span>
                <span className="font-bold text-orange-500">
                  +{item.points} points
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-4">
                {item.status === "Approved" && (
                  <button
                    onClick={() => {
                      setSelectedClaim(item);
                      setShowQrModal(true);
                    }}
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm bg-red-600 hover:bg-red-800 text-white rounded-lg"
                  >
                    View QR Code
                  </button>
                )}

                {item.status === "Released" && (
                  <button className="cursor-not-allowed flex items-center gap-2 px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg">
                    <CheckCircle size={16} />
                    Item successfully collected
                  </button>
                )}

                {item.status === "Pending" && (
                  <button className="cursor-not-allowed flex items-center gap-2 px-4 py-2 text-sm bg-yellow-100 text-yellow-700 rounded-lg">
                    <Clock size={16} />
                    Waiting for admin approval
                  </button>
                )}

                {item.status === "Rejected" && (
                  <button className="cursor-not-allowed flex items-center gap-2 px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg">
                    <XCircle size={16} />
                    Claim rejected – Verification Failed
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedClaim(item);
                    setShowDetails(true);
                  }}
                  className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                >
                  <Eye size={16} />
                  View details
                </button>
              </div>
            </div>
          </div>
        ))}
>>>>>>> f6895e0c (complete myclaims)
      </div>

      {/* Claim Process Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-700">
        <div className="flex items-center gap-2 mb-2">
          <Info size={14} />
          <p className="font-extrabold">Claim Process:</p>
        </div>
        <ul className="list-disc pl-6 list-inside space-y-1">
          <li>
            <b>Pending:</b> Your claim is under review by admin
          </li>
          <li>
            <b>Approved:</b> Claim approved! Show your QR code at the booth to
            collect
          </li>
          <li>
            <b>Released:</b> Item successfully collected and points awarded
          </li>
          <li>
            <b>Rejected:</b> Verification failed – please contact admin
          </li>
        </ul>
      </div>
      <ClaimQrModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        claim={selectedClaim}
      />

      <ClaimDetailsModal
        isOpen={showDetails}
        claim={selectedClaim}
        onClose={() => setShowDetails(false)}
      />
    </div>
  );
}
