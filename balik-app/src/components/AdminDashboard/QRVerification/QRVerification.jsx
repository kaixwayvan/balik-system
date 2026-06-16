import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ScanBarcode, FileCheck, FileExclamationPoint, CirclePercent } from "lucide-react";
import StatsCards from "./StatsCard";
import QRScannerCard from "./QRScannerCard";
import PendingList from "./PendingList";
import RecentVerificationsTable from "./RecentVerificationsTable";

export default function QRVerification() {
  useEffect(() => {
    document.title = "QR Verify | BALIK Admin";

    return () => {
      document.title = "BALIK Admin";
    };
  }, []);

  const [stats, setStats] = useState([
    { label: "Total Scans", value: 0, icon: ScanBarcode },
    { label: "Approved", value: 0, icon: FileCheck },
    { label: "Rejected", value: 0, icon: FileExclamationPoint },
    { label: "Pending", value: 0, icon: CirclePercent },
  ]);

  const [pendingItems, setPendingItems] = useState([]);
  const [recentData, setRecentData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulated Data Fetch
  useEffect(() => {
    setLoading(true);
    const fetchQRData = () => {
      setTimeout(() => {
        // Mocked Stats
        setStats([
          { label: "Total Scans", value: 142, icon: ScanBarcode },
          { label: "Approved", value: 98, icon: FileCheck },
          { label: "Rejected", value: 12, icon: FileExclamationPoint },
          { label: "Pending", value: 32, icon: CirclePercent },
        ]);

        // Mocked Pending Items
        setPendingItems([
          {
            id: "1",
            name: "MacBook Pro M2",
            category: "Electronics",
            qr: "BALIK-MBP812",
            status: "Ready",
            owner: "Alex Reyes",
            claimer: "Alex Reyes",
            date: "Oct 24, 2026",
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&h=150&fit=crop",
          },
          {
            id: "2",
            name: "HydroFlask 32oz",
            category: "Personal Items",
            qr: "BALIK-HYD001",
            status: "Pending",
            owner: "Unknown",
            claimer: "Samira Cruz",
            date: "Oct 23, 2026",
            image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=150&h=150&fit=crop",
          }
        ]);

        // Mocked Recent Data
        setRecentData([
          {
            id: "101",
            name: "Leather Wallet",
            category: "Personal Items",
            qr: "BALIK-LWT443",
            owner: "John Doe",
            claimer: "John Doe",
            status: "Released",
            verifiedAt: "Oct 24, 2026",
            image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=150&h=150&fit=crop",
          },
          {
            id: "102",
            name: "Honda Car Keys",
            category: "Keys",
            qr: "BALIK-KEY991",
            owner: "Mike Tan",
            claimer: "Mike Tan",
            status: "Released",
            verifiedAt: "Oct 22, 2026",
            image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=150&h=150&fit=crop",
          }
        ]);

        setLoading(false);
      }, 800);
    };

    fetchQRData();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="flex flex-col h-full bg-white/80 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-200/60 overflow-y-auto custom-scrollbar space-y-6 sm:space-y-8 pb-10"
    >
      {/* Stats Cards */}
      <StatsCards stats={stats} loading={loading} />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 shrink-0">
        <QRScannerCard />
        <PendingList items={pendingItems} loading={loading} />
      </div>

      {/* Recent Verifications Table */}
      <RecentVerificationsTable data={recentData} loading={loading} />
    </motion.div>
  );
}