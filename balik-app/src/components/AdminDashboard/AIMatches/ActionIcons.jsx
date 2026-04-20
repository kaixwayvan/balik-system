import { Eye, Check, X, Bell, QrCode } from "lucide-react";
import { STATUS_ACTIONS } from "./helper/matchUtils";

const ACTION_MAP = {
  view: { icon: Eye, color: "text-green-600", label: "View" },
  approve: { icon: Check, color: "text-green-600", label: "Approve" },
  reject: { icon: X, color: "text-red-500", label: "Reject" },
  notify: { icon: Bell, color: "text-blue-500", label: "Notify" },
  qr: { icon: QrCode, color: "text-red-500", label: "QR Code" },
};

export default function ActionIcons({ status, onAction, match }) {
  const actions = STATUS_ACTIONS[status] || [];

  return (
    <div className="flex items-center justify-left gap-3">
      {actions.map((action) => {
        const { icon: Icon, color, label } = ACTION_MAP[action];

        return (
          <div key={action} className="relative group">
            <Icon
              size={18}
              className={`${color} cursor-pointer`}
              onClick={() => onAction(action, match)}
            />

            {/* Tooltip */}
            <div className="absolute bottom-7 left-1/2 -translate-x-1/2 
              whitespace-nowrap px-2 py-1 text-xs 
              bg-gray-800 text-white rounded 
              opacity-0 group-hover:opacity-100 
              transition pointer-events-none">
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}