import {
  Settings,
  Bell,
  Bot,
  QrCode,
  Shield,
  CloudUpload,
} from "lucide-react";

const icons = {
  Settings,
  Bell,
  Bot,
  QrCode,
  Shield,
  CloudUpload,
};

export default function SettingsTabButton({
  label,
  icon,
  active,
  onClick,
}) {
  const Icon = icons[icon];

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition font-medium text-base cursor-pointer
      ${
        active
          ? "bg-indigo-100 text-indigo-950"
          : "hover:bg-gray-100 text-black"
      }`}
    >
      <Icon size={22} />
      {label}
    </button>
  );
}