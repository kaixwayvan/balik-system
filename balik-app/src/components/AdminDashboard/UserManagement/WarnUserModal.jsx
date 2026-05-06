import { useEffect, useState } from "react";
import { X, AlertTriangle, Send, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "../../../utils/supabaseClient";

const WARN_REASONS = [
  "Submitting false or misleading reports",
  "Inappropriate or offensive content",
  "Suspicious claim activity",
  "Repeated policy violations",
  "Spamming the platform",
  "Other",
];

export default function WarnUserModal({ user, onClose }) {
  const [selectedReason, setSelectedReason] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  if (!user) return null;

  const isOtherReason = selectedReason === "Other";
  const finalMessage = isOtherReason ? customMessage.trim() : selectedReason;
  const canSend = finalMessage.length > 0;

  async function handleSend() {
    if (!canSend) return;
    setSending(true);
    setError("");

    try {
      // Insert a warning notification into the notifications table
      const notificationBody = `⚠️ Warning from Admin: ${finalMessage}${
        !isOtherReason && customMessage.trim()
          ? `\n\nAdditional note: ${customMessage.trim()}`
          : ""
      }`;

      const { error: insertError } = await supabase
        .from("notifications")
        .insert({
          user_id: user.id,
          type: "admin_warning",
          title: "Official Warning",
          message: notificationBody,
          is_read: false,
          created_at: new Date().toISOString(),
        });

      if (insertError) throw insertError;

      setSent(true);
    } catch (err) {
      console.error("Error sending warning:", err);
      setError("Failed to send warning. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-100">
              <AlertTriangle size={18} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Warn User</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Sending warning to <span className="font-semibold text-gray-600">{user.full_name || user.email}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="p-6">
          {sent ? (
            /* Success state */
            <div className="flex flex-col items-center py-6 gap-3 text-center">
              <div className="p-4 rounded-full bg-green-100">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Warning Sent</h3>
              <p className="text-sm text-gray-500">
                The warning has been delivered to{" "}
                <span className="font-semibold">{user.full_name || user.email}</span>'s
                notification inbox.
              </p>
              <button
                onClick={onClose}
                className="mt-2 cursor-pointer px-8 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Reason picker */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason for Warning <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {WARN_REASONS.map((reason) => (
                    <label
                      key={reason}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        selectedReason === reason
                          ? "border-orange-400 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="warn-reason"
                        value={reason}
                        checked={selectedReason === reason}
                        onChange={() => setSelectedReason(reason)}
                        className="accent-orange-500"
                      />
                      <span className="text-sm text-gray-700">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom message (shown always for extra note, required for "Other") */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {isOtherReason ? "Custom Message *" : "Additional Note (optional)"}
                </label>
                <textarea
                  rows={3}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder={
                    isOtherReason
                      ? "Describe the reason for this warning…"
                      : "Add any extra context for the user…"
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              {/* Warning preview */}
              {finalMessage && (
                <div className="p-3 rounded-xl bg-orange-50 border border-orange-200">
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-1">Preview</p>
                  <p className="text-sm text-orange-800">⚠️ Warning: {finalMessage}</p>
                  {!isOtherReason && customMessage.trim() && (
                    <p className="text-sm text-orange-700 mt-1 opacity-80">
                      Note: {customMessage.trim()}
                    </p>
                  )}
                </div>
              )}

              {error && (
                <p className="text-sm text-red-500 font-medium">{error}</p>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        {!sent && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="cursor-pointer px-6 py-2 rounded-xl border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!canSend || sending}
              className={`cursor-pointer flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold text-white transition-colors ${
                canSend && !sending
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-orange-200 cursor-not-allowed"
              }`}
            >
              {sending ? (
                <><Loader2 size={15} className="animate-spin" /> Sending…</>
              ) : (
                <><Send size={15} /> Send Warning</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
