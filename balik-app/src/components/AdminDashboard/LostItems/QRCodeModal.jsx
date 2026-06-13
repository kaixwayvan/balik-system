import { useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X, Download, Printer } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function QRCodeModal({ item, onClose }) {
  const qrRef = useRef(null);

  if (!item) return null;

  const qrValue = `${window.location.origin}/admin/qr-verify?id=${item.id}`;

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const canvas = document.createElement("canvas");
    const img = new Image();

    const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgStr);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const link = document.createElement("a");
      link.download = `QR-${item.name.replace(/\s+/g, "_")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = url;
  };

  const handlePrint = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head><title>Secure Tag - ${item.name}</title></head>
        <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;gap:20px;margin:0;">
          <h2 style="margin:0;font-size:24px;font-weight:900;text-transform:uppercase;">${item.name}</h2>
          <p style="margin:0;color:#666;font-size:12px;letter-spacing:2px;">SYS_ID: ${item.id}</p>
          <div style="padding:20px;border:2px dashed #ccc;border-radius:24px;">
            ${svgStr}
          </div>
          <p style="margin:0;color:#888;font-size:12px;font-weight:bold;text-transform:uppercase;">BALIK Secure QR Protocol</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[420px] p-8 space-y-6 flex flex-col items-center relative overflow-hidden"
      >
        {/* Decorative Background Blob */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-100 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="w-full flex justify-between items-start relative z-10">
          <div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Security Tag</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">QR Generation Core</p>
          </div>
          <button onClick={onClose} className="cursor-pointer p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors outline-none focus:ring-2 focus:ring-slate-200 active:scale-95 shrink-0">
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        {/* Item Info */}
        <div className="text-center w-full relative z-10 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="font-black text-slate-800 text-lg tracking-tight truncate">{item.name}</p>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">ID: {item.id}</p>
        </div>

        {/* QR */}
        <div ref={qrRef} className="relative z-10 flex justify-center p-5 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 shadow-sm">
          <QRCodeSVG
            value={qrValue}
            size={200}
            level="H"
            includeMargin={true}
            imageSettings={{ src: "", excavate: false }}
          />
        </div>

        <p className="text-center text-[11px] font-bold text-slate-500 leading-relaxed relative z-10 px-4">
          Attach or present this QR code to securely verify identity claims via the scanner module.
        </p>

        {/* Actions */}
        <div className="flex w-full gap-3 relative z-10 pt-2">
          <button
            onClick={handleDownload}
            className="cursor-pointer flex-1 flex items-center justify-center gap-2 border border-slate-200 bg-white text-slate-700 font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all active:scale-95 outline-none focus:ring-2 focus:ring-slate-200"
          >
            <Download size={16} strokeWidth={2.5} /> Save
          </button>
          <button
            onClick={handlePrint}
            className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-[#5C1313] hover:bg-[#4A0F0F] text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-md transition-all active:scale-95 outline-none focus:ring-2 focus:ring-[#5C1313]/40"
          >
            <Printer size={16} strokeWidth={2.5} /> Print
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}