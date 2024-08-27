import React from "react";
import { User } from "@prisma/client";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import logo from "@/public/uni.png"; // Replace with your correct logo path

interface PaySlipFormProps {
  user: User;
}

export default function PaySlipForm({ user }: PaySlipFormProps) {
  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <header className="mb-4">
        {/* <h1 className="text-2xl font-bold text-center text-gray-700">
          Pay Slip Generator
        </h1>
        <p className="text-center text-sm text-gray-500">
          Click the button below to generate and download the pay slip.
        </p> */}
      </header>

      <footer className="text-center">
        <button
          onClick={generatePdf}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
        >
          Generate Pay Slip
        </button>
      </footer>
    </div>
  );

  async function generatePdf() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();

    // Load fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Embed the logo with reduced size
    const logoImageBytes = await fetch(logo.src).then((res) => res.arrayBuffer());
    const pngImage = await pdfDoc.embedPng(logoImageBytes);
    const pngDims = pngImage.scale(0.25); // Reduced size

    // Place the logo on the top right
    page.drawImage(pngImage, {
      x: width - pngDims.width - 50,
      y: height - pngDims.height - 50,
      width: pngDims.width,
      height: pngDims.height,
    });

    // Unikrew Solution heading centered
    const companyName = "Unikrew Solution (Pvt) Limited";
    const companyNameWidth = boldFont.widthOfTextAtSize(companyName, 18);

    page.drawText(companyName, {
      x: (width - companyNameWidth) / 2,
      y: height - 60,
      size: 18,
      font: boldFont,
      color: rgb(0, 0, 0.5), // Dark blue color
    });

    // Employee name with "Payslip" heading centered below company name
    const headerText = `${user.name} Payslip`;
    const headerTextWidth = boldFont.widthOfTextAtSize(headerText, 14);

    page.drawText(headerText, {
      x: (width - headerTextWidth) / 2,
      y: height - 85,
      size: 14,
      font: boldFont,
      color: rgb(0.635, 0.529, 0.008), // Golden color
    });

    // Employee details with two-column layout
    const leftColumnDetails = [
      `Designation: ${user.designation}`,
      `Department: ${user.department}`,
      `Email Address: ${user.emailId}`,
    ];

    const rightColumnDetails = [
      `Bank Account Number: ${user.bankAccountNumber}`,
      `IFSC Code: ${user.ifscCode}`,
    ];

    // Adjust yPosition to move details down
    let yPosition = height - 160; // Increased vertical offset
    const leftColumnX = 50;
    const rightColumnX = width / 2 + 30; // Adjust the right column position

    leftColumnDetails.forEach((detail) => {
      page.drawText(detail, {
        x: leftColumnX,
        y: yPosition,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
      yPosition -= 20;
    });

    yPosition = height - 160; // Reset yPosition for the right column
    rightColumnDetails.forEach((detail) => {
      page.drawText(detail, {
        x: rightColumnX,
        y: yPosition,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
      yPosition -= 20;
    });

    // Table grid structure
    yPosition -= 20;
    const tableTop = yPosition;
    const cellHeight = 20;

    // Draw table borders
    page.drawLine({
      start: { x: 50, y: tableTop },
      end: { x: width - 50, y: tableTop },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    for (let i = 0; i < 5; i++) {
      yPosition -= cellHeight;
      page.drawLine({
        start: { x: 50, y: yPosition },
        end: { x: width - 50, y: yPosition },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    }

    // Draw vertical lines
    const xPositions = [50, 200, 300, 450, width - 50];
    xPositions.forEach((xPos) => {
      page.drawLine({
        start: { x: xPos, y: tableTop },
        end: { x: xPos, y: yPosition },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    });

    // Add light blue background for the header row
    page.drawRectangle({
      x: 50,
      y: tableTop - cellHeight,
      width: width - 100,
      height: cellHeight,
      color: rgb(0.678, 0.847, 0.902), // Light blue color
    });

    // Table header text
    const tableHeaders = ["Earning", "Amount", "Benefits", "Amount"];
    xPositions.slice(0, 4).forEach((xPos, index) => {
      page.drawText(tableHeaders[index], {
        x: xPos + 10,
        y: tableTop - 15,
        size: 12,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
    });

    // Table content
    const tableData = [
      ["Basic Salary", user.basicSalary.toString(), "Other Allowances", user.otherAllowances.toString()],
      ["", "", "HRA", user.hra.toString()],
      ["", "", "", ""],
      ["Total", "", "NetSalary", user.netSalary.toString()],
    ];

    yPosition = tableTop - cellHeight;
    tableData.forEach((row) => {
      row.forEach((text, index) => {
        if (text) {
          page.drawText(text, {
            x: xPositions[index] + 10,
            y: yPosition - 15,
            size: 12,
            font,
            color: rgb(0, 0, 0),
          });
        }
      });
      yPosition -= cellHeight;
    });

    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, `${user.name}_Salary_Slip.pdf`);
  }
}
