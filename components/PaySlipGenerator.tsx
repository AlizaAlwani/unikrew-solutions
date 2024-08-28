import React from "react";
import { User } from "@prisma/client";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import logo from "@/public/uni.png";
import { FiDownload } from "react-icons/fi";

interface PaySlipFormProps {
  user: User;
}

export default function PaySlipForm({ user }: PaySlipFormProps) {
  return (
    <div className="">
      <footer className="text-center">
        <button onClick={generatePdf} className="" title="Download PaySlip">
          <FiDownload size={20} />
        </button>
      </footer>
    </div>
  );

  async function generatePdf() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const logoImageBytes = await fetch(logo.src).then((res) => res.arrayBuffer());
    const pngImage = await pdfDoc.embedPng(logoImageBytes);
    const pngDims = pngImage.scale(0.25);
    
    page.drawImage(pngImage, {
      x: width - pngDims.width - 50,
      y: height - pngDims.height - 50,
      width: pngDims.width,
      height: pngDims.height,
    });

    const companyName = "Unikrew Solution (Pvt) Limited";
    const companyNameWidth = boldFont.widthOfTextAtSize(companyName, 18);

    page.drawText(companyName, {
      x: (width - companyNameWidth) / 2,
      y: height - 60,
      size: 18,
      font: boldFont,
      color: rgb(0, 0, 0.5),
    });

    const headerText = `${user.name} Payslip`;
    const headerTextWidth = boldFont.widthOfTextAtSize(headerText, 14);

    page.drawText(headerText, {
      x: (width - headerTextWidth) / 2,
      y: height - 85,
      size: 14,
      font: boldFont,
      color: rgb(0.635, 0.529, 0.008),
    });

    const leftColumnDetails = [
      `Designation: ${user.designation}`,
      `Department: ${user.department}`,
      `Email Address: ${user.emailId}`,
    ];

    const rightColumnDetails = [
      `Bank Account Number: ${user.bankAccountNumber}`,
      `IFSC Code: ${user.ifscCode}`,
    ];

    let yPosition = height - 160;
    const leftColumnX = 50;
    const rightColumnX = width / 2 + 30;

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

    yPosition = height - 160;
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

    yPosition -= 20;
    const tableTop = yPosition;
    const cellHeight = 20;

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

    const xPositions = [50, 200, 300, 450, width - 50];
    xPositions.forEach((xPos) => {
      page.drawLine({
        start: { x: xPos, y: tableTop },
        end: { x: xPos, y: yPosition },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    });

    page.drawRectangle({
      x: 50,
      y: tableTop - cellHeight,
      width: width - 100,
      height: cellHeight,
      color: rgb(0.678, 0.847, 0.902),
    });

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

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, `${user.name}_Salary_Slip.pdf`);
  }
}
