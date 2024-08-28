"use client";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  UserProps,
  createBulkUsers,
  deleteUsers,
  generatePaySlip,
} from "@/actions/Users";
import { User } from "@prisma/client";
import PaySlipGenerator from "@/components/PaySlipGenerator";
import { FiDownload, FiMail } from "react-icons/fi";

// New Email Sending Component
const SendEmailButton = ({ user }: { user: User }) => {
  const [emailStatus, setEmailStatus] = useState("");

  async function sendEmail() {
    try {
      // Email sending logic here
      setEmailStatus("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      setEmailStatus("Failed to send email.");
    }
  }

  return (
    <div>
      <button
        onClick={sendEmail}
        className="flex items-center gap-2 px-2 py-1 text-gray-600 hover:text-blue-600 transition-colors"
        title="Send PaySlip via Email"
      >
        <FiMail size={20} />
      </button>
      {emailStatus && <p className="text-sm text-gray-500">{emailStatus}</p>}
    </div>
  );
};

export default function UsersTable({ users }: { users: User[] }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [jsonData, setJsonData] = useState("");

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
          const json: UserProps[] = XLSX.utils.sheet_to_json(workSheet);

          try {
            await createBulkUsers(json);
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

  async function clearData() {
    try {
      await deleteUsers();
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  }

  async function generateAllPaySlips() {
    try {
      setLoading(true);
      for (const user of users) {
        await generatePaySlip(user.id);
      }
    } catch (error) {
      console.error("Error generating pay slips:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-full flex flex-col items-center bg-gradient-to-r from-slate-50 to-slate-100">
      <div className="w-full max-w-screen-lg py-12 px-8 shadow-lg rounded-xl bg-white flex flex-col items-center">
        <div className="w-full flex flex-col items-center gap-6 mb-8">
          <div className="w-full sm:w-auto text-center">
            <label
              className="block text-sm font-medium text-slate-700 mb-1"
              htmlFor="file_input"
            >
              Upload Excel File
            </label>
            <input
              className="block w-full sm:w-auto text-sm text-slate-700 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              id="file_input"
              type="file"
              accept=".xls,.xlsx"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            />
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={previewData}
              className="py-2 px-4 bg-blue-900 text-white font-bold rounded-md shadow-md hover:bg-blue-800 transition-all"
            >
              Preview Data
            </button>
            <button
              onClick={saveData}
              className="py-2 px-4 bg-slate-600 text-white font-bold rounded-md shadow-md hover:bg-green-800 transition-all"
            >
              Save Data
            </button>
            <button
              onClick={clearData}
              className="py-2 px-4 bg-red-900 text-white font-bold rounded-md shadow-md hover:bg-red-800 transition-all"
            >
              Clear Data
            </button>
            <button
              onClick={generateAllPaySlips}
              className="py-2 px-4 bg-gray-700 text-white font-bold rounded-md shadow-md hover:bg-gray-800 transition-all"
            >
              <FiDownload size={20} />
            </button>
          </div>
        </div>

        {jsonData && (
          <pre className="w-full p-4 bg-white rounded-md shadow-inner overflow-auto text-sm text-gray-800 mb-8">
            {jsonData}
          </pre>
        )}

        {loading ? (
          <p className="text-blue-600 font-semibold">Processing, please wait...</p>
        ) : (
          <div className="overflow-x-auto w-full">
            {users && users.length > 0 && (
              <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <thead className="bg-slate-100 text-blue-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wide border-b border-blue-200 whitespace-nowrap"
                    >
                      Actions
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wide border-b border-blue-200 whitespace-nowrap"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wide border-b border-blue-200 whitespace-nowrap"
                    >
                      Designation
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wide border-b border-blue-200 whitespace-nowrap"
                    >
                      Department
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wide border-b border-blue-200 whitespace-nowrap"
                    >
                      Basic Salary
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wide border-b border-blue-200 whitespace-nowrap"
                    >
                      HRA
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wide border-b border-blue-200 whitespace-nowrap"
                    >
                      Other Allowances
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wide border-b border-blue-200 whitespace-nowrap"
                    >
                      Net Salary
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wide border-b border-blue-200 whitespace-nowrap"
                    >
                      Bank Account Number
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wide border-b border-blue-200 whitespace-nowrap"
                    >
                      IFSC Code
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wide border-b border-blue-200 whitespace-nowrap"
                    >
                      Email ID
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {users.map((user) => (
                    <tr key={user.id} className="bg-white hover:bg-blue-50 transition-all">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <PaySlipGenerator user={user} />
                          <SendEmailButton user={user} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.designation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.basicSalary}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.hra}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.otherAllowances}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.netSalary}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.bankAccountNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.ifscCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.emailId}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
