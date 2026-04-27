import UserRow from "./UserRow";

export default function UsersTable({ users }) {
  const headers = ["User", "Role", "Points", "Status", "Actions"];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-5 border-b border-gray-400">
        <h2 className="font-bold text-lg">Registered Users</h2>
      </div>
      <table className="w-full bg-white rounded-xl overflow-hidden">
        <thead className="bg-gray-50 text-gray-500">
          <tr className="text-left uppercase border-b border-gray-300">
            {headers.map((h) => (
              <th key={h} className="px-6 py-4">
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <UserRow key={u.id} user={u} />
          ))}
        </tbody>
      </table>
    </div>
  );
}