"use server";
import { prisma } from "@/lib/db";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// Define the UserProps type
export type UserProps = {
  name: string;
  designation: string;
  department: string;
  basicSalary: number;
  hra: number;
  otherAllowances: number;
  netSalary: number;
  bankAccountNumber: string;
  ifscCode: string;
  emailId: string;
};

// Fetch all users from the database
export async function getUsers() {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.log(error);
  }
}

// Create a new user in the database
export async function createUser(data: UserProps) {
  try {
    const user = await prisma.user.create({
      data: data,
    });
    return user;
  } catch (error) {
    console.log(error);
  }
}

// Bulk create users in the database
export async function createBulkUsers(data: UserProps[]) {
  try {
    const users = await prisma.user.createMany({
      data: data,
    });
    return users;
  } catch (error) {
    console.log(error);
  }
}

// Delete all users from the database
export async function deleteUsers() {
  try {
    await prisma.user.deleteMany();
  } catch (error) {
    console.log(error);
  }
}

// Generate a pay slip for a specific user
export async function generatePaySlip(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new Error("User not found");

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 24;

    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    page.drawText(`Pay Slip for ${user.name}`, {
      x: 50,
      y: height - 4 * fontSize,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Designation: ${user.designation}`, {
      x: 50,
      y: height - 6 * fontSize,
      size: fontSize - 4,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Department: ${user.department}`, {
      x: 50,
      y: height - 8 * fontSize,
      size: fontSize - 4,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Basic Salary: ${user.basicSalary}`, {
      x: 50,
      y: height - 10 * fontSize,
      size: fontSize - 4,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    page.drawText(`HRA: ${user.hra}`, {
      x: 50,
      y: height - 12 * fontSize,
      size: fontSize - 4,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Other Allowances: ${user.otherAllowances}`, {
      x: 50,
      y: height - 14 * fontSize,
      size: fontSize - 4,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Net Salary: ${user.netSalary}`, {
      x: 50,
      y: height - 16 * fontSize,
      size: fontSize - 4,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes).toString("base64");
  } catch (error) {
    console.log(error);
    throw new Error("Failed to generate pay slip");
  }
}
