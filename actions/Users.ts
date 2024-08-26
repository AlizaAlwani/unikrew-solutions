"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
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
export async function getUsers() {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.log(error);
  }
}
export async function createUser(data: UserProps) {
  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        designation: data.designation,
        department: data.department,
        basicSalary: data.basicSalary,
        hra: data.hra,
        otherAllowances: data.otherAllowances,
        netSalary: data.netSalary,
        bankAccountNumber: data.bankAccountNumber,
        ifscCode: data.ifscCode,
        emailId: data.emailId,
      },
    });
    revalidatePath("/");
    return user;
  } catch (error) {
    console.log(error);
  }
}
export async function createBulkUsers(users: UserProps[]) {
  try {
    for (const user of users) {
      await createUser(user);
    }
  } catch (error) {
    console.log(error);
  }
}
export async function deleteUsers() {
  try {
    await prisma.user.deleteMany();
    revalidatePath("/");
  } catch (error) {
    console.log(error);
  }
}