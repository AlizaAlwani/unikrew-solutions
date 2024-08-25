import express, { Request, Response } from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const app = express();
const upload = multer({ dest: 'uploads/' });
const prisma = new PrismaClient();

interface EmployeePayRow {
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  dateOfJoining: string;
  basicSalary: number;
  hra: number;
  otherAllowances: number;
  taxDeductions: number;
  pfDeductions: number;
  professionalTax: number;
  grossSalary: number;
  netSalary: number;
  bankAccountNumber: string;
  ifscCode: string;
  payDate: string;
  emailId: string;
}

app.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const filePath = path.resolve(req.file.path);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data: EmployeePayRow[] = XLSX.utils.sheet_to_json(worksheet);

    for (const row of data) {
      await prisma.employeePay.create({
        data: {
          employeeId: row.employeeId,
          name: row.name,
          designation: row.designation,
          department: row.department,
          dateOfJoining: new Date(row.dateOfJoining),
          basicSalary: row.basicSalary,
          hra: row.hra,
          otherAllowances: row.otherAllowances,
          taxDeductions: row.taxDeductions,
          pfDeductions: row.pfDeductions,
          professionalTax: row.professionalTax,
          grossSalary: row.grossSalary,
          netSalary: row.netSalary,
          bankAccountNumber: row.bankAccountNumber,
          ifscCode: row.ifscCode,
          payDate: new Date(row.payDate),
          emailId: row.emailId,
        }
      });
    }

    res.status(200).send('File processed and data saved successfully!');
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).send('Error processing file.');
  } finally {
    // Clean up the uploaded file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting file:', err);
    });
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
