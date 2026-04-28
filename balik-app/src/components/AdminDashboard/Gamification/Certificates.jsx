import { useState } from "react";
import { FileBadge, ScanSearch, X } from "lucide-react";

export default function Certificates({ certificates }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
      <div className="flex items-center gap-2 mb-2">
        <FileBadge size={22} className="text-gray-700" />
        <h3 className="font-bold text-lg">Certificates</h3>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Certificates are awarded automatically once all requirements are met.
      </p>

      <div className="space-y-4">
        {certificates.map((cert, index) => (
          <div
            key={index}
            className="border border-gray-300 shadow-sm rounded-xl p-5 flex justify-between"
          >
            <div>
              <h4 className="font-semibold">{cert.title}</h4>

              <p className="text-base text-gray-500 mt-2">Requirements</p>

              <ul className="text-sm text-gray-800 list-disc ml-5 mt-2">
                {cert.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-end">
              <span className="bg-indigo-100 text-indigo-700 px-5 py-1 rounded-full text-sm">
                System Validated
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => setShowModal(true)}
          className="cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
        >
          <ScanSearch size={16} />
          View System Rules
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl shadow-lg w-[500px] relative">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="font-bold text-lg text-gray-800">System Gamification Rules</h2>
              <button
                onClick={() => setShowModal(false)}
                className="cursor-pointer"
              >
                <X size={15} className="text-gray-500" />
              </button>
            </div>

            <div className="px-5 py-4">
              <p className="text-gray-600 text-sm mb-4">
                These rules are evaluated automatically by the system. Admins
                may review or update conditions, but rewards are never manually
                issued.
              </p>

              <div className="p-4">
                <div className="border border-gray-300 shadow-md rounded-lg p-4 bg-gray-50">
                  <p className="font-semibold mb-2">System Notes</p>
                  <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                    <li>Rules are validated in real-time</li>
                    <li>All rewards are system-generated</li>
                    <li>Audit logs are immutable</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}