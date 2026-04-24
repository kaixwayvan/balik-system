import StatsCard from "./StatsCard";
import QRScannerCard from "./QRScannerCard";
import PendingList from "./PendingList";
import RecentVerificationsTable from "./RecentVerificationsTable";

import { ScanBarcode, FileCheck, FileExclamationPoint, CirclePercent } from "lucide-react";

export default function QRVerification() {
  const stats = [
    {
      label: "Total Scans",
      value: 342,
      icon: ScanBarcode,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      label: "Approved",
      value: 298,
      icon: FileCheck,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      label: "Rejected",
      value: 44,
      icon: FileExclamationPoint,
      bg: "bg-red-100",
      color: "text-red-600",
    },
    {
      label: "Pending",
      value: 12,
      icon: CirclePercent,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
    },
  ];

  const pendingItems = [
    {
      id: 1,
      name: "Blue Nike Backpack",
      category: "Bags",
      qr: "BALIK-001-2024",
      status: "Pending",
      owner: "john.doe@university.edu",
      claimer: "john.doe@university.edu",
      date: "Jan 16, 2024",
      image: "https://www.citybeach.com/on/demandware.static/-/Sites-fewstoneMaster/default/dw761ecaa1/images/20365170/20365170-03-FT-XL.jpg",
    },
    {
      id: 2,
      name: "Blue Nike Backpack",
      category: "Bags",
      qr: "BALIK-002-2024",
      status: "Pending",
      owner: "john.doe@university.edu",
      claimer: "john.doe@university.edu",
      date: "Jan 16, 2024",
      image: "https://www.citybeach.com/on/demandware.static/-/Sites-fewstoneMaster/default/dw761ecaa1/images/20365170/20365170-03-FT-XL.jpg",
    },
  ];

  const recentData = [
    {
      id: 1,
      name: "Red Wallet",
      category: "Personal Items",
      qr: "BALIK-003",
      owner: "mike@uni.edu",
      claimer: "Same as owner",
      status: "Approved",
      verifiedAt: "Jan 16, 2024",
      points: 30,
      image: "https://via.placeholder.com/40",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            QR Verification
          </h1>
          <p className="text-gray-500 text-sm">
            Scan and validate QR codes for item return verification
          </p>
        </div>
      </div>

      <StatsCard stats={stats} />

      <div className="grid grid-cols-2 gap-6">
        <QRScannerCard onStart={() => console.log("Start scanning")} />
        <PendingList items={pendingItems} />
      </div>

      <RecentVerificationsTable data={recentData} />
    </div>
  );
}
