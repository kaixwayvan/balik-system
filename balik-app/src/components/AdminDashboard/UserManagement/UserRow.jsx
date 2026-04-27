import StatusBadge, { actionColors } from "./shared/StatusBadge";
import RoleBadge from "./shared/RoleBadge";
import { Eye, Ban, Archive, ShieldAlert } from "lucide-react";

export default function UserRow({ user }) {
  const actionsByStatus = {
    Active: ["View", "Restrict", "Block", "Archive"],
    Restricted: ["View", "Block", "Archive"],
  };

  const actions = actionsByStatus[user.status];

  return (
    <tr className="border-t border-gray-300 hover:bg-gray-50 align-middle">
      <td className="px-6 py-5">
        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-xs text-gray-400">{user.course}</p>
        </div>
      </td>

      <td className="px-6 py-5">
        <RoleBadge role={user.role} />
      </td>

      <td className="px-6 py-5 text-green-600 font-semibold">
        {user.points} pts
      </td>

      <td className="px-6 py-5">
        <StatusBadge status={user.status} />
      </td>

      <td className="px-6 py-5">
        <div className="flex gap-3">
          {actions.map((action) => {
            const iconMap = {
              View: Eye,
              Restrict: ShieldAlert,
              Block: Ban,
              Archive: Archive,
            };

            const Icon = iconMap[action];
            const colorClass = actionColors[action];

            return (
              <div key={action} className="relative group">
                <button className={`${colorClass} cursor-pointer`}>
                  <Icon size={18} className="stroke-current" />
                </button>

                <span
                  className="absolute bottom-8 left-1/2 -translate-x-1/2
                       whitespace-nowrap px-2 py-1 text-xs
                       bg-gray-800 text-white rounded
                       opacity-0 group-hover:opacity-100
                       transition pointer-events-none"
                >
                  {action}
                </span>
              </div>
            );
          })}
        </div>
      </td>
    </tr>
  );
}