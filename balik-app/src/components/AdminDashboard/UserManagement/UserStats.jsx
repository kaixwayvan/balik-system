import { Users, GraduationCap, BriefcaseBusiness, MonitorDot } from "lucide-react";

export default function UserStats({ users }) {
  const total = users.length;
  const students = users.filter((u) => u.role === "Student").length;
  const staff = users.filter((u) => u.role === "Staff").length;
  const active = users.filter((u) => u.status === "Active").length;

  const stats = [
    {
      label: "Total Users",
      value: total,
      bg: "bg-cyan-100",
      color: "text-cyan-600",
      icon: Users,
    },
    {
      label: "Students",
      value: students,
      bg: "bg-purple-100",
      color: "text-purple-500",
      icon: GraduationCap,
    },
    {
      label: "Staff",
      value: staff,
      bg: "bg-indigo-100",
      color: "text-indigo-500",
      icon: BriefcaseBusiness,
    },
    {
      label: "Active",
      value: active,
      bg: "bg-green-100",
      color: "text-green-500",
      icon: MonitorDot,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((s) => {
        const Icon = s.icon;

        return (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-gray-200 shadow-xs hover:shadow-md p-6 flex items-center gap-4"
          >
            <div className={`${s.bg} p-3 rounded-lg`}>
              <Icon className={s.color} size={22} />
            </div>

            <div>
              <p className="text-gray-500 text-sm">{s.label}</p>
              <p className="text-2xl text-black font-bold">{s.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}