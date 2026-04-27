import { useState } from "react";
import UserStats from "./UserStats";
import UserFilterBar from "./UserFilterBar";
import UsersTable from "./UsersTable";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@iskolar.edu.ph",
      role: "Student",
      course: "Computer Science",
      points: 100,
      status: "Active",
    },
    {
      id: 2,
      name: "Ian Byles",
      email: "ian.byles@uni.edu.ph",
      role: "Staff",
      course: "Library Services",
      points: 150,
      status: "Active",
    },
    {
      id: 3,
      name: "Frank Ocean",
      email: "frank.oce@iskolar.edu.ph",
      role: "Student",
      course: "Psychology",
      points: 70,
      status: "Active",
    },
    {
      id: 4,
      name: "Kris Apler",
      email: "kris.apler@iskolar.edu.ph",
      role: "Student",
      course: "Computer Science",
      points: 200,
      status: "Restricted",
    },
  ];

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