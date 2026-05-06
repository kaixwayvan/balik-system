import { X, Download, Printer } from "lucide-react";

export default function QRModal({ item, onClose }) {
  if (!item) return null;

  // We use the item ID as the QR data payload
  const qrData = item.id;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code - ${item.name}</title>
          <style>
            body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            img { width: 250px; height: 250px; margin-bottom: 20px; }
            h2 { margin: 0 0 10px 0; }
            p { color: #555; }
          </style>
        </head>
        <body>
          <h2>${item.name}</h2>
          <p>ID: ${item.id}</p>
          <img src="${qrCodeUrl}" onload="window.print();window.close()" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `QR-${item.name.replace(/\s+/g, '-')}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download QR code", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden relative">
        <div className="p-6 text-center space-y-6">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold text-gray-800 text-left">Item QR Code</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-200">
            <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 mb-4">
              <img src={qrCodeUrl} alt="Item QR Code" className="w-48 h-48" />
            </div>
            <p className="font-bold text-gray-800 text-lg">{item.name}</p>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{item.id.substring(0, 8)}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <Printer size={18} />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-700 text-white font-bold hover:bg-red-800 transition-colors cursor-pointer"
            >
              <Download size={18} />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
