"use client";

import { UserProps, createBulkUsers, deleteUsers } from "@/actions/users"; // Ensure the casing matches your file name
import { User } from "@prisma/client";
import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function UsersTable({ users }: { users: User[] }) {
  // State variables
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [jsonData, setJsonData] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);


  function previewData() {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const workSheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(workSheet);
          setJsonData(JSON.stringify(json, null, 2));
        }
      };
      reader.readAsBinaryString(file);
    }
  }

  // Function to save data
  async function saveData() {
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const workSheet = workbook.Sheets[sheetName];
          const json: UserProps[] = XLSX.utils.sheet_to_json(workSheet);

          try {
            await createBulkUsers(json);
            setStatusMessage("Data saved successfully.");
          } catch (error) {
            if (error instanceof Error) {
              setStatusMessage(`Error saving data: ${error.message}`);
            } else {
              setStatusMessage("An unknown error occurred.");
            }
          } finally {
            setLoading(false);
          }
        }
      };
      reader.readAsBinaryString(file);
    }
  }

  // Function to clear data
  async function clearData() {
    try {
      await deleteUsers();
      setStatusMessage("All data cleared.");
    } catch (error) {
      if (error instanceof Error) {
        setStatusMessage(`Error clearing data: ${error.message}`);
      } else {
        setStatusMessage("An unknown error occurred.");
      }
    }
  }

  return (
    <div className="py-8 space-y-8">
      {/* BUTTONS */}
      <div className="flex items-center gap-8">
        <div className="">
          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="file_input"
          >
            Upload file
          </label>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            type="file"
            accept=".xls,.xlsx"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          />
        </div>
        <button
          onClick={previewData}
          className="py-2 px-6 rounded bg-slate-300 text-slate-900"
        >
          Preview Data
        </button>
        <button
          onClick={saveData}
          className="py-2 px-6 rounded bg-purple-600 text-slate-100"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Data"}
        </button>
        <button
          onClick={clearData}
          className="py-2 px-6 rounded bg-red-600 text-slate-100"
        >
          Clear Data
        </button>
      </div>
      <pre>{jsonData}</pre>
      {statusMessage && <p className="text-red-500">{statusMessage}</p>}
      <div className="relative overflow-x-auto">
        {users && users.length > 0 && (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Age
                </th>
                <th scope="col" className="px-6 py-3">
                  City
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {user.name}
                  </th>
                  <td className="px-6 py-4">{user.age}</td>
                  <td className="px-6 py-4">{user.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
