import { getUsers } from "@/actions/Users";
import UsersTable from "@/components/UserTable";
import React from "react";

export default async function Page() {
  const users = (await getUsers()) || [];
  return (
    <main className="h-full w-full mx-auto bg-gradient-to-b from-slate-50 to-slate-100">
      <UsersTable users={users}/>
    </main>
  );
}
