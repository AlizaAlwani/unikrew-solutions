// "use server";
// import { prisma } from "@/lib/db";
// import { revalidatePath } from "next/cache";

// export type EmployeePayProps = {
//   employeeId: string;
//   name: string;
//   designation: string;
//   department: string;
//   dateOfJoining: string; // ISO Date String
//   basicSalary: number;
//   hra: number;
//   otherAllowances: number;
//   taxDeductions: number;
//   pfDeductions: number;
//   professionalTax: number;
//   grossSalary: number;
//   netSalary: number;
//   bankAccountNumber: string;
//   ifscCode: string;
//   payDate: string; // ISO Date String
//   emailId: string;
// };

// export async function getEmployees() {
//   try {
//     const employees = await prisma.employeePay.findMany();
//     return employees;
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function createEmployeePay(data: EmployeePayProps) {
//   try {
//     const employee = await prisma.employeePay.create({
//       data: {
        // employeeId: data.employeeId,
        // name: data.name,
        // designation: data.designation,
        // department: data.department,
        // dateOfJoining: new Date(data.dateOfJoining),
        // basicSalary: data.basicSalary,
        // hra: data.hra,
        // otherAllowances: data.otherAllowances,
        // taxDeductions: data.taxDeductions,
        // pfDeductions: data.pfDeductions,
        // professionalTax: data.professionalTax,
        // grossSalary: data.grossSalary,
        // netSalary: data.netSalary,
        // bankAccountNumber: data.bankAccountNumber,
        // ifscCode: data.ifscCode,
        // payDate: new Date(data.payDate),
        // emailId: data.emailId,
//       },
//     });
//     revalidatePath("/");
//     return employee;
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function createBulkEmployeePay(employees: EmployeePayProps[]) {
//   try {
//     for (const employee of employees) {
//       await createEmployeePay(employee);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function deleteEmployeePay() {
//   try {
//     await prisma.employeePay.deleteMany();
//     revalidatePath("/");
//   } catch (error) {
//     console.log(error);
//   }
// }
