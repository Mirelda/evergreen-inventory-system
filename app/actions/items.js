"use server";

import db from "@/lib/db";

export async function deleteAllItems() {
  try {
    await db.item.deleteMany();
  } catch (error) {
    console.log(error);
  }
}
