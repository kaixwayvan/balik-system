import { useState } from "react";
import UserStats from "./UserStats";
import UserFilterBar from "./UserFilterBar";
import UsersTable from "./UsersTable";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const users = [];

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "All" || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Users Management
        </h1>
        <p className="text-gray-500 text-sm">
          Manage registered users
        </p>
      </div>

      <UserStats users={users} />

      <UserFilterBar
        search={search}
        setSearch={setSearch}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />

      <UsersTable users={filteredUsers} />
    </div>
  );
}