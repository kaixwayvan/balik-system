import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Eye, Users, Plus, Image } from "lucide-react";
import GreenBag from "../../../assets/home-assets/img-items/bag-green.png";
import Ring from "../../../assets/home-assets/img-items/ring.png";
import BlackWallet from "../../../assets/home-assets/img-items/wallet-black.png";
import Airpods from "../../../assets/home-assets/img-items/airpods.png";
import VerifiedIcon from "@mui/icons-material/Verified";

const stats = [
  {
    title: "Total Items",
    value: 5,
    subtitle: "Items you reported",
    bg: "bg-blue-500",
  },
  {
    title: "Claimed",
    value: 1,
    subtitle: "Successfully returned",
    bg: "bg-green-500",
  },
  {
    title: "Claim request",
    value: 4,
    subtitle: "Pending review",
    bg: "bg-orange-400",
  },
];

const reports = [
  {
    id: 1,
    title: "Green Backpack",
    desc: "Forest green backpack with laptop inside, found near Itech’s registrar’s office",
    image: GreenBag,
    location: "PUP-Itech Lab 105",
    time: "6 days ago",
    views: 150,
    requests: 2,
    status: "Verified",
  },
  {
    id: 2,
    title: "Diamond Yellow Golden Ring",
    desc: "Diamond Yellow Gold engagement ring with engraving inside, found in Main campus restroom",
    image: Ring,
    location: "PUP-Main",
    time: "2 days ago",
    views: 0,
    requests: 0,
    status: "Pending Verification",
  },
  {
    id: 3,
    title: "Black Leather YSL Wallet",
    desc: "YSL Black Leather Wallet containing credit cards and ID, found near the PUP Lagoon",
    image: BlackWallet,
    location: "PUP-Itech Lab 105",
    time: "6 days ago",
    views: 150,
    requests: 1,
    status: "Claimed",
  },
  {
    id: 4,
    title: "Samsung Galaxy Earbuds",
    desc: "White Samsung Galaxy Buds Pro in a charging case, found in the Itech restroom",
    image: Airpods,
    location: "PUP-Itech Lab 105",
    time: "6 days ago",
    views: 150,
    requests: 2,
    status: "Verified",
  },
];

export default function FoundItems() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Found Reports</h1>
          <p className="text-sm text-gray-500">
            Items you've reported and their claim status
          </p>
        </div>

        <Link to="/submitreport">
          <button className="cursor-pointer flex items-center gap-1 bg-green-500 hover:bg-green-800 text-white px-5 py-2 rounded-lg font-medium">
            <Plus size={13} /> Report Found Item
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`${stat.bg} text-white rounded-xl p-5 shadow transform transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg`}
          >
            <p className="text-sm">{stat.title}</p>
            <h2 className="text-3xl font-bold">{stat.value}</h2>
            <p className="text-xs opacity-90">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-300 rounded-xl overflow-hidden shadow-md"
          >
            {/* Image */}
            <div className="relative h-44 bg-gray-100">
              {(item.status === "Verified" || item.status === "Claimed") && (
                <div
                  className={`absolute top-3 left-3 p-1 rounded-full shadow leading-none flex items-center justify-center
                    ${
                      item.status === "Verified"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    }`}
                >
                  <VerifiedIcon sx={{ fontSize: 16 }} />
                </div>
              )}

              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />

              <span
                className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full shadow-md font-medium
                ${
                  item.status === "Verified"
                    ? "bg-blue-100 text-blue-500 border border-blue-600"
                    : item.status === "Claimed"
                      ? "bg-green-100 text-green-700 border border-green-500"
                      : "bg-yellow-100 text-yellow-600 border border-yellow-600"
                }`}
              >
                {item.status}
              </span>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {item.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {item.time}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={14} /> {item.views} views
                </span>
                <span className="flex items-center gap-1">
                  <Users size={14} /> {item.requests} request
                </span>
              </div>

              {/* Actions */}
              {item.status === "Claimed" ? (
                <div className="bg-green-50 text-green-700 border border-green-600 justify-center font-bold text-center text-xs px-3 py-2 rounded-lg flex items-center gap-2">
                  ✓ This item has been successfully claimed and returned to its
                  owner!
                </div>
              ) : (
                <div className="flex gap-2 ">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setOpenModal(true);
                    }}
                    className="flex-1 flex items-center justify-center cursor-pointer flex items-center gap-2 bg-blue-600 text-white py-2 px-5 rounded-lg text-sm hover:bg-blue-700"
                  >
                    <Users size={14} /> View claimers ({item.requests})
                  </button>

                  <button className="flex-1 flex items-center justify-center cursor-pointer flex items-center gap-2 border py-2 rounded-lg text-sm hover:bg-gray-50">
                    <Image size={14} /> Edit Photos
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg py-6 px-10 relative animate-fadeIn">
            {/* Close */}
            <button
              onClick={() => setOpenModal(false)}
              className="cursor-pointer absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            {/* Content */}
            <h2 className="text-lg font-bold text-center mb-4">
              Claim Verification In Progress
            </h2>

            {selectedItem?.requests > 0 ? (
              <>
                <p className="text-sm text-gray-600 text-center mb-4">
                  We have received multiple claims for this lost item. To ensure
                  we return it to its rightful owner, we are currently verifying
                  details with all individuals, including:
                </p>

                <ul className="text-sm font-semibold text-gray-700 list-disc list-inside space-y-1 mb-6">
                  <li>Coco Martin</li>
                  <li>Vernon Chwe Hansol</li>
                </ul>
              </>
            ) : (
              <div className="text-center text-sm text-gray-500 mb-6">
                This item currently has{" "}
                <span className="font-medium">no claimers</span>.
                <br />
                Please check back later.
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={() => setOpenModal(false)}
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-10 py-2 rounded-lg text-sm font-medium"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
