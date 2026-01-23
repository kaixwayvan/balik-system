import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  MapPin,
  Clock,
  ChevronDown,
  CheckCircle,
  Brain,
  ScanEye,
} from "lucide-react";

import Id from "../../../assets/home-assets/img-items/id.png";
import Camera from "../../../assets/home-assets/img-items/camera.png";
import GreenWallet from "../../../assets/home-assets/img-items/wallet-green.png";

const STATUS_STYLES = {
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

  const toggleMatches = (id) => {
    setOpenReportId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">Active Reports</h1>
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
        {reports.map((report) => {
          const styles = STATUS_STYLES[report.status];
          const isOpen = openReportId === report.id;

          return (
            <div
              key={report.id}
              className={`rounded-xl border p-5 ${styles.border} ${styles.cardBg}`}
            >
              {/* TOP CARD */}
              <div className="flex gap-4">
                <img
                  src={report.image}
                  alt={report.title}
                  className="w-24 h-24 rounded-lg object-cover border shadow bg-white"
                />

                <div className="flex-1">
                  <div className="flex">
                    <div>
                      <h3 className="text-lg font-semibold">{report.title}</h3>
                      <p className="text-sm text-gray-600">
                        {report.description}
                      </p>

                      <div className="flex gap-4 text-xs text-gray-500 mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {report.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {report.timeAgo}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`ml-auto self-start whitespace-nowrap text-xs px-3 py-1 rounded-full border ${styles.badge}`}
                    >
                      {styles.label}
                    </span>
                  </div>

                  {/* PROGRESS */}
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-1">
                      Search progress
                    </p>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${styles.progress}`}
                        style={{ width: `${report.progress}%` }}
                      />
                    </div>
                    <p className="text-right text-xs text-gray-500 mt-1">
                      {report.progress}%
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-3 mt-4">
                    {report.status === "matches" && (
                      <button
                        onClick={() => toggleMatches(report.id)}
                        className="cursor-pointer font-extrabold flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-2 rounded-md"
                      >
                        <ScanEye size={16} />
                        View 2 AI Matches
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}

                    <button className="cursor-pointer border border-gray-300 text-sm px-4 py-2 rounded-md hover:bg-gray-100">
                      Update Description
                    </button>

                    {report.status === "claimed" && (
                      <span className="flex items-center gap-2 text-green-700 font-medium text-sm">
                        <CheckCircle size={18} />
                        Item Claimed
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* EXPANDED AI MATCHES */}
              {isOpen && report.status === "matches" && (
                <div
                  className="mt-6 bg-yellow-100 border border-yellow-300 rounded-xl p-5 overflow-hidden transition-all ease-in-out"
                  style={{ transitionDuration: "9000ms" }}
                >
                  <h4 className="font-bold flex items-center gap-2 mb-4">
                    <Brain size={16} /> AI-Powered Match Suggestions
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        confidence: 92,
                        location: "PUP-ITECH",
                        reporter: "Coco Martin",
                      },
                      {
                        confidence: 78,
                        location: "PUP-ITECH 2nd floor",
                        reporter: "Kim Mingyu",
                      },
                    ].map((match, i) => (
                      <div key={i} className="bg-white border rounded-lg p-4">
                        <div className="flex gap-3">
                          <img
                            src={Id}
                            className="w-16 h-16 rounded-md border"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">
                                Match Confidence
                              </p>
                              <p className="text-orange-500 font-bold">
                                {match.confidence}%
                              </p>
                            </div>

                            <div className="mt-2">
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full"
                                  style={{
                                    width: `${match.confidence}%`,
                                    background:
                                      "linear-gradient(to right, #FFB639, #7D5014)",
                                  }}
                                />
                              </div>
                            </div>

                            <p className="mt-4 flex items-center gap-1 text-xs text-gray-500">
                              <MapPin size={14} /> {match.location}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              <strong>Reported by:</strong> {match.reporter}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <button className="cursor-pointer flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-md">
                            Claim This Item
                          </button>
                          <button className="cursor-pointer flex-1 border border-red-400 text-red-600 text-sm py-2 rounded-md">
                            Not My Item
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
