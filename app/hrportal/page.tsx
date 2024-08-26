import { getUsers } from "@/actions/Users";
import UsersTable from "@/components/UserTable";
import React from "react";

export default async function page() {
  const users = (await getUsers()) || [];
  return (
    <main className="min-h-screen max-w-4xl mx-auto">
      <UsersTable users={users} />
    </main>
  );
}