import { Logs, LaptopMinimalCheck } from "lucide-react";

export default function AuditLogs({ logs }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-4">
      <div className="flex items-center gap-2 mb-2">
        <Logs size={22} className="text-gray-700" />
        <h3 className="text-lg font-bold">Gamification Audit Logs</h3>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Gamification activities, including points and level changes, are
        recorded automatically for auditing
      </p>

      <div className="space-y-6">
        {logs.map((log, index) => (
          <div key={index} className="flex-1 items-center gap-3">
            <div className="flex items-center gap-3 mb-3">
              <LaptopMinimalCheck className="text-gray-600" size={18} />
              <p className="text-gray-700 font-semibold">{log}</p>
            </div>
            <div className="w-full border-b border-gray-300 shadow"></div>
          </div>
        ))}
      </div>
    </div>
  );
}