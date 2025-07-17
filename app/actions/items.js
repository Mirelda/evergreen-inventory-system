"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";

export async function deleteAllItems() {
  try {
    await prisma.item.deleteMany();
  } catch (error) {
    console.log(error);
  }
}
