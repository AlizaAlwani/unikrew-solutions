"use client";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  createBulkUsers,
  deleteUsers,
  generatePaySlip,
  UserProps,
} from "@/actions/Users";
import { User } from "@prisma/client";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export default function UsersTable({ users }: { users: User[] }) {
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

          const plainJson = json.map((item) => {
            if (item && typeof item === "object") {
              return JSON.parse(JSON.stringify(item));
            }
            return item;
          });

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

  // Function to generate pay slips for all users
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

  // Function to generate a PDF pay slip for a single user
  async function generatePdf(user: User) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;

    page.drawText(`Salary Slip for ${user.name}`, {
      x: 50,
      y: height - 50,
      size: 18,
      font,
      color: rgb(0, 0, 0),
    });

    const text = `
      Designation: ${user.designation}
      Department: ${user.department}
      Basic Salary: ${user.basicSalary}
      HRA: ${user.hra}
      Other Allowances: ${user.otherAllowances}
      Net Salary: ${user.netSalary}
      Bank Account Number: ${user.bankAccountNumber}
      IFSC Code: ${user.ifscCode}
      Email ID: ${user.emailId}
    `;

    page.drawText(text, {
      x: 50,
      y: height - 100,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${user.name}_Salary_Slip.pdf`;
    link.click();
  }

  return (
    <div className="py-12 px-8 bg-gray-50 shadow-xl rounded-lg">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8">
        <div className="w-full sm:w-auto">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="file_input"
          >
            Upload Excel File
          </label>
          <input
            className="block w-full sm:w-auto text-sm text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            id="file_input"
            type="file"
            accept=".xls,.xlsx"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={previewData}
            className="py-2 px-4 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 transition-all"
          >
            Preview Data
          </button>
          <button
            onClick={saveData}
            className="py-2 px-4 bg-green-600 text-white font-medium rounded-md shadow-sm hover:bg-green-700 transition-all"
          >
            Save Data
          </button>
          <button
            onClick={clearData}
            className="py-2 px-4 bg-red-600 text-white font-medium rounded-md shadow-sm hover:bg-red-700 transition-all"
          >
            Clear Data
          </button>
          <button
            onClick={generateAllPaySlips}
            className="py-2 px-4 bg-gray-600 text-white font-medium rounded-md shadow-sm hover:bg-gray-700 transition-all"
          >
            Generate Pay Slips
          </button>
        </div>
      </div>
      {jsonData && (
        <pre className="p-4 bg-white rounded-md shadow-inner overflow-auto text-sm text-gray-800">
          {jsonData}
        </pre>
      )}
      {loading ? (
        <p className="text-blue-600 font-semibold">Processing, please wait...</p>
      ) : (
        <div className="overflow-x-auto">
          {users && users.length > 0 && (
            <table className="min-w-full bg-white rounded-md shadow overflow-hidden">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Designation
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Basic Salary
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    HRA
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Other Allowances
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Net Salary
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Bank Account Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    IFSC Code
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Email ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="bg-white hover:bg-gray-50">
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={async () => {
                          try {
                            await generatePdf(user);
                          } catch (error) {
                            console.error("Error generating PDF:", error);
                          }
                        }}
                        className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
                      >
                        Generate PDF
                      </button>
                    </td>
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
