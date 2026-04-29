import { ChevronDown } from "lucide-react";

export default function SettingsSelect({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div className="space-y-2">
      <label className="font-semibold text-lg">{label}</label>

      <div className="relative mt-2">
        <select
          value={value}
          onChange={onChange}
          className="appearance-none w-full border border-gray-300 rounded-xl px-5 py-4 text-base outline-none focus:ring-2 focus:ring-indigo-300"
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <ChevronDown
          size={22}
          className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none"
        />
      </div>
    </div>
  );
}