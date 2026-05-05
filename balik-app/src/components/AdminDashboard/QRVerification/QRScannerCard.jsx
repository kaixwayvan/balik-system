import { useState } from "react";
import { ScanLine, Camera, X } from "lucide-react";
import { Scanner } from '@yudiel/react-qr-scanner';

export default function QRScannerCard({ onScan }) {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = (result) => {
    if (result && result.length > 0) {
      onScan(result[0].rawValue);
      setIsScanning(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 relative">
      <h3 className="font-semibold mb-4">QR Code Scanner</h3>

      <div className="border-2 border-dashed rounded-lg h-[350px] flex flex-col items-center justify-center text-gray-400 relative overflow-hidden bg-gray-50">
        {isScanning ? (
          <>
            <button 
              onClick={() => setIsScanning(false)}
              className="absolute top-4 right-4 z-10 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 cursor-pointer transition-colors"
            >
              <X size={20} />
            </button>
            <div className="w-full h-full object-cover">
              <Scanner 
                onScan={handleScan}
                onError={(err) => console.log(err)}
                formats={['qr_code']}
              />
            </div>
          </>
        ) : (
          <>
            <ScanLine size={60} strokeWidth={1.5} className="mb-4 text-gray-400"/>
            <p className="text-gray-500 font-medium">Click to start QR code scanning</p>

            <button
              onClick={() => setIsScanning(true)}
              className="cursor-pointer flex items-center gap-2 mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium shadow-sm hover:shadow-md"
            >
              <Camera size={18}/> Start Scanning
            </button>
          </>
        )}
      </div>
    </div>
  );
}