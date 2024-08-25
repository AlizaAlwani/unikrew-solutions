// "use client";

// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import axios from "axios";

// export default function HrPortal() {
//   const [file, setFile] = useState<File | null>(null);
//   const [jsonData, setJsonData] = useState("");
//   const [uploadStatus, setUploadStatus] = useState<string | null>(null);

//   // Function to preview the data
//   function previewData() {
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const data = e.target?.result;
//         if (data) {
//           const workbook = XLSX.read(data, { type: "binary" });
//           const sheetName = workbook.SheetNames[0];
//           const workSheet = workbook.Sheets[sheetName];
//           const json = XLSX.utils.sheet_to_json(workSheet);
//           setJsonData(JSON.stringify(json, null, 2));
//         }
//       };
//       reader.readAsBinaryString(file);
//     }
//   }

//   // Function to save the data
//   async function saveData() {
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = async (e) => {
//         const data = e.target?.result;
//         if (data) {
//           const workbook = XLSX.read(data, { type: "binary" });
//           const sheetName = workbook.SheetNames[0];
//           const workSheet = workbook.Sheets[sheetName];
//           const json = XLSX.utils.sheet_to_json(workSheet);

//           try {
//             const response = await axios.post("/api/upload", { data: json });
//             setUploadStatus("Upload successful");
//           } catch (error) {
//             console.error(error);
//             setUploadStatus("Upload failed: " + error.message);
//           }
//         }
//       };
//       reader.readAsBinaryString(file);
//     }
//   }

//   return (
//     <div className="container mx-auto py-8">
//       <h1 className="text-2xl font-bold mb-4">HR Portal</h1>
//       <input
//         type="file"
//         accept=".xls,.xlsx"
//         onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
//         className="mb-4"
//       />
//       <div className="flex gap-4">
//         <button onClick={previewData} className="btn btn-primary">
//           Preview Data
//         </button>
//         <button onClick={saveData} className="btn btn-success">
//           Upload File
//         </button>
//       </div>
//       {jsonData && (
//         <pre className="bg-gray-100 p-4 mt-4 border">{jsonData}</pre>
//       )}
//       {uploadStatus && (
//         <p className="mt-4 text-red-500">{uploadStatus}</p>
//       )}
//     </div>
//   );
// }

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