import { ScanLine, Camera } from "lucide-react";

export default function QRScannerCard({ onStart }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-semibold mb-4">QR Code Scanner</h3>

      <div className="border-2 border-dashed rounded-lg h-100 flex flex-col items-center justify-center text-gray-400">
        
        <ScanLine size={60} strokeWidth={1.5} className="mb-4"/>
        <p>Click to start QR code scanning</p>

        <button
          onClick={onStart}
          className="cursor-pointer flex items-center gap-2 mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          <Camera size={16}/> Start Scanning
        </button>
      </div>
    </div>
  );
}