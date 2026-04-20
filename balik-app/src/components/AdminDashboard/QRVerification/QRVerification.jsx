import { useEffect, useState } from "react";
import StatsCard from "./StatsCard";
import QRScannerCard from "./QRScannerCard";
import PendingList from "./PendingList";
import RecentVerificationsTable from "./RecentVerificationsTable";
import { supabase } from "../../../utils/supabaseClient";

import { ScanBarcode, FileCheck, FileExclamationPoint, CirclePercent } from "lucide-react";

export default function QRVerification() {
  const [stats, setStats] = useState([
    { label: "Total Scans", value: 0, icon: ScanBarcode, bg: "bg-blue-100", color: "text-blue-600" },
    { label: "Approved", value: 0, icon: FileCheck, bg: "bg-green-100", color: "text-green-600" },
    { label: "Rejected", value: 0, icon: FileExclamationPoint, bg: "bg-red-100", color: "text-red-600" },
    { label: "Pending", value: 0, icon: CirclePercent, bg: "bg-yellow-100", color: "text-yellow-600" },
  ]);

  const [pendingItems, setPendingItems] = useState([]);
  const [recentData, setRecentData] = useState([]);

  useEffect(() => {
    async function fetchQRData() {
      try {
        const { data, error } = await supabase.from("items").select("*").order("created_at", { ascending: false });
        if (error) throw error;

        let totalScans = 0;
        let approvedCount = 0;
        let rejectedCount = 0;
        let pendingCount = 0;

        const livePending = [];
        const liveRecent = [];

        data.forEach(item => {
          // Fake a QR string if they have one or if we just want to mock it for the pipeline
          const hasQR = item.metadata?.qr_code || item.id.substring(0, 8); 
          const isResolved = item.status === 'resolved';

          totalScans++; // Just aggregating for demo

          if (isResolved) {
            approvedCount++;
            liveRecent.push({
              id: item.id,
              name: item.title || item.category || "Unknown Item",
              category: item.category || "Other",
              qr: `BALIK-${hasQR.toUpperCase().substring(0, 6)}`,
              owner: item.metadata?.reporter?.email || "Unknown",
              claimer: "Verified User",
              status: "Approved",
              verifiedAt: new Date(item.created_at).toLocaleDateString(),
              points: 30, // Default mock rewards
              image: item.image_url || "https://images.unsplash.com/photo-1580910051074-3eb694886505",
            });
          } else {
            pendingCount++;
            livePending.push({
              id: item.id,
              name: item.title || item.category || "Unknown Item",
              category: item.category || "Other",
              qr: `BALIK-${hasQR.toUpperCase().substring(0, 6)}`,
              status: "Pending",
              owner: item.metadata?.reporter?.email || "Unknown",
              claimer: "Unclaimed",
              date: new Date(item.created_at).toLocaleDateString(),
              image: item.image_url || "https://images.unsplash.com/photo-1580910051074-3eb694886505",
            });
          }
        });

        // Slice up to simulate pagination/UI constraints for recent list
        setRecentData(liveRecent.slice(0, 10));
        setPendingItems(livePending.slice(0, 4));

        setStats([
          { label: "Total Scans", value: totalScans, icon: ScanBarcode, bg: "bg-blue-100", color: "text-blue-600" },
          { label: "Approved", value: approvedCount, icon: FileCheck, bg: "bg-green-100", color: "text-green-600" },
          { label: "Rejected", value: rejectedCount, icon: FileExclamationPoint, bg: "bg-red-100", color: "text-red-600" },
          { label: "Pending", value: pendingCount, icon: CirclePercent, bg: "bg-yellow-100", color: "text-yellow-600" },
        ]);

      } catch (err) {
        console.error("Error fetching QR data:", err);
      }
    }
    fetchQRData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <StatsCard stats={stats} />

      <div className="grid grid-cols-2 gap-6">
        <QRScannerCard onStart={() => console.log("Start scanning")} />
        <PendingList items={pendingItems} />
      </div>

      <RecentVerificationsTable data={recentData} />
    </div>
  );
}
