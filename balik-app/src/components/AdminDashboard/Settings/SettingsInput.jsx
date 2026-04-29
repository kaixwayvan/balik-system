export default function SettingsInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div className="space-y-2">
      <label className="font-semibold text-lg">{label}</label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full mt-2 border border-gray-300 rounded-xl px-5 py-4 text-base outline-none focus:ring-2 focus:ring-indigo-300 placeholder:text-gray-400"
      />
    </div>
  );
}