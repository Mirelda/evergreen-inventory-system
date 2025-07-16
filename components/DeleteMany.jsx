"use client";
import { deleteAllItems } from "@/app/actions/items";
import React from "react";

export default function DeleteMany() {
  async function handleDelete() {
    await deleteAllItems();
    alert("Completed");
  }
  return <button onClick={handleDelete}>Delete</button>;
}
