export default function RoleBadge({ role }) {
  const styles = {
    Student: "bg-purple-100 text-purple-700",
    Staff: "bg-indigo-100 text-indigo-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs ${styles[role]}`}>
      {role}
    </span>
  );
}