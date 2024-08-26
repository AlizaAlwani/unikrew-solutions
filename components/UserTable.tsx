"use client";
import { UserProps, createBulkUsers, deleteUsers } from "@/actions/Users";
import { User } from "@prisma/client";
import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function UsersTable({ users }: { users: User[] }) {
  // State hooks
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [jsonData, setJsonData] = useState("");

  // Function to preview data from the file
  function previewData() {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const workSheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(workSheet);
          setJsonData(JSON.stringify(json, null, 2));
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  // Function to save data from the file to the database
  async function saveData() {
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const workSheet = workbook.Sheets[sheetName];
          const json: any[] = XLSX.utils.sheet_to_json(workSheet);

          // Ensure all items are plain objects
          const plainJson = json.map(item => {
            if (item && typeof item === 'object') {
              return JSON.parse(JSON.stringify(item));
            }
            return item;
          });

          // Log the data to verify
          console.log("Data to be sent:", plainJson);

          try {
            await createBulkUsers(plainJson as UserProps[]);
          } catch (error) {
            console.error("Error saving data:", error);
          } finally {
            setLoading(false);
          }
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  // Function to clear data from the database
  async function clearData() {
    try {
      await deleteUsers();
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  }

  return (
    <div className="py-8 space-y-8">
      {/* Buttons for file operations */}
      <div className="flex items-center gap-8">
        <div>
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
        >
          Save Data
        </button>
        <button
          onClick={clearData}
          className="py-2 px-6 rounded bg-red-600 text-slate-100"
        >
          Clear Data
        </button>
      </div>
      <pre>{jsonData}</pre>
      {loading ? (
        <p>Saving Data, please wait...</p>
      ) : (
        <div className="relative overflow-x-auto">
          {users && users.length > 0 && (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Name</th>
                  <th scope="col" className="px-6 py-3">Designation</th>
                  <th scope="col" className="px-6 py-3">Department</th>
                  <th scope="col" className="px-6 py-3">Basic Salary</th>
                  <th scope="col" className="px-6 py-3">HRA</th>
                  <th scope="col" className="px-6 py-3">Other Allowances</th>
                  <th scope="col" className="px-6 py-3">Net Salary</th>
                  
                  <th scope="col" className="px-6 py-3">Bank Account Number</th>
                  <th scope="col" className="px-6 py-3">IFSC Code</th>
                  <th scope="col" className="px-6 py-3">Email ID</th>
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
                    <td className="px-6 py-4">{user.designation}</td>
                    <td className="px-6 py-4">{user.department}</td>
                    <td className="px-6 py-4">{user.basicSalary}</td>
                    <td className="px-6 py-4">{user.hra}</td>
                    <td className="px-6 py-4">{user.otherAllowances}</td>
                    <td className="px-6 py-4">{user.netSalary}</td>
                    <td className="px-6 py-4">{user.bankAccountNumber}</td>
                    <td className="px-6 py-4">{user.ifscCode}</td>
                    <td className="px-6 py-4">{user.emailId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
