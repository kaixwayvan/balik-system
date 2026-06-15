import { useState, useRef } from "react";
import { MailPlus, Info, X, QrCode as QRCodeIcon, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function NotifyModal({ open, match, onSend, onClose }) {
  const [message, setMessage] = useState("");
  const [includeQRCode, setIncludeQRCode] = useState(true);
  const [loading, setLoading] = useState(false);
  const qrRef = useRef();

  if (!open) return null;

  const handleChange = (e) => {
    if (e.target.value.length <= 500) {
      setMessage(e.target.value);
    }
  };

  // Generate the public URL for the found item
  const foundItemUrl = `${window.location.origin}/found-item/${match.foundItem?.id || match.found_id}`;

  // Generate QR code image URL from qrserver.com
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(foundItemUrl)}`;

  // Download QR code as image
  const downloadQRCode = async () => {
    try {
      const response = await fetch(qrCodeImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `found-item-${match.foundItem?.id || match.found_id}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading QR code:", error);
      alert("Failed to download QR code");
    }
  };

  // Get QR code as base64 image for email embedding
  const getQRCodeImage = async () => {
    if (!includeQRCode) return null;

    try {
      const response = await fetch(qrCodeImageUrl);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error generating QR code image:", error);
      return null;
    }
  };

  // Send with QR code image
  const handleSendWithQR = async () => {
    setLoading(true);
    try {
      const qrImage = await getQRCodeImage();
      onSend(message, includeQRCode ? foundItemUrl : null, qrImage);
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl relative max-h-[90vh] overflow-y-auto">
        <div className="p-6 flex justify-between items-center border-b border-gray-300 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold">Notify Owner</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        <div className="p-6 space-y-6">
          {/* INFO BOX */}
          <div className="bg-blue-50 border border-blue-300 p-6 rounded-lg text-sm">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-lg text-blue-800">
              <MailPlus size={16} /> Send Notification
            </h3>
            <p className="mb-2 ml-7">
              <b className="text-blue-800">Sending to:</b> {match.lostEmail}
            </p>
            <p className="ml-7">
              <b className="text-blue-800">Lost Item:</b> {match.lost}
            </p>
            <p className="ml-7 mt-2">
              <b className="text-blue-800">Found Item:</b> {match.found}
            </p>
          </div>

          {/* MESSAGE TEXTAREA */}
          <div>
            <h3 className="font-bold text-lg mb-3">Notification Message</h3>
            <textarea
              className="w-full border rounded-lg p-3 h-40 placeholder:italic placeholder:text-gray-400"
              placeholder="Write your notification message here..."
              value={message}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500 mb-3 text-right">
              {message.length}/500 characters
            </p>
          </div>

          {/* QR CODE SECTION */}
          <div className="border border-gray-300 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="includeQR"
                checked={includeQRCode}
                onChange={(e) => setIncludeQRCode(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              <label htmlFor="includeQR" className="flex items-center gap-2 font-bold text-lg cursor-pointer">
                <QRCodeIcon size={18} /> Include QR Code in Email
              </label>
            </div>

            {includeQRCode && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center">
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
                    <img
                      src={qrCodeImageUrl}
                      alt="QR Code for found item"
                      width={200}
                      height={200}
                      className="w-[200px] h-[200px]"
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-4 text-center max-w-xs">
                    When scanned, this QR code will show the found item details: <br/>
                    <b>{match.found}</b>
                  </p>
                </div>

                <button
                  onClick={downloadQRCode}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-800 py-2 rounded-lg transition cursor-pointer"
                >
                  <Download size={16} />
                  Download QR Code
                </button>

                <div className="bg-green-50 border border-green-300 p-4 rounded-lg text-sm">
                  <p className="text-green-800">
                    <b>✓ QR Code in Email:</b> The QR code image will be embedded directly in the email. The recipient can tap it to view the found item, or scan it with their phone camera.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* NOTIFICATION INFO */}
          <div className="bg-yellow-50 border border-yellow-500 p-4 rounded-lg text-sm">
            <h3 className="flex items-center gap-2 font-bold text-md text-yellow-800 mb-2">
              <Info size={13} /> Notification Details
            </h3>
            <ul className="text-yellow-800 ml-7 space-y-1 text-xs">
              <li>• Email will be sent to the lost item owner</li>
              <li>• Message will include the found item details</li>
              {includeQRCode && <li>• QR code image will be embedded in the email</li>}
              {includeQRCode && <li>• Recipient can tap or scan QR to view found item</li>}
              <li>• Owner can claim the found item from the public view</li>
            </ul>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4">
            <button
              onClick={handleSendWithQR}
              disabled={loading}
              className="cursor-pointer flex-1 bg-blue-600 hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                "Send Notification"
              )}
            </button>

            <button
              onClick={onClose}
              disabled={loading}
              className="cursor-pointer flex-1 bg-gray-300 hover:bg-gray-200 disabled:opacity-60 py-3 rounded-lg font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}