import { getUsers } from "@/actions/Users";
import UsersTable from "@/components/UserTable";
import React from "react";

export default async function Page() {
  const users = (await getUsers()) || [];
  return (
    <main className="h-screen w-full mx-auto flex items-center justify-center">
      <UsersTable users={users} />
    </main>
  );
}
