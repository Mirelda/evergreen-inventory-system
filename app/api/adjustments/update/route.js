import db from "@/lib/db";
import { data } from "autoprefixer";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const { addStockQty, itemId, type, warehouseId } = await request.json();
    console.log(addStockQty, itemId, type, warehouseId);
    const existingItem = await db.item.findUnique({
      where: {
        id: itemId,
      },
    });
    console.log(existingItem);
    if (!existingItem) {
      return null;
    }
    const updatedItem = await db.item.update({
      where: {
        id: itemId,
      },
      data: {
        quantity:
          type === "add"
            ? existingItem.quantity + parseInt(addStockQty)
            : existingItem.quantity - parseInt(addStockQty),
      },
    });
    const warehouseItems = await prisma.warehouseItem.findMany();
    const existingWarehouseItem = warehouseItems.find(
      (item) => item.warehouseId == warehouseId
    );
    console.log(`Existing: ${existingWarehouseItem}`);
    // const warehouseItems=await
    // Update warehouse item
    // const existingWarehouseItem = await db.warehouseItem.findFirst({
    //   where: {
    //     itemId,
    //     warehouseId,
    //   },
    // });

    if (!existingWarehouseItem) {
      return null;
    }
    const updatedWarehouseItem = await db.warehouseItem.update({
      where: {
        id: existingWarehouseItem.id,
        itemId,
        warehouseId,
      },
      data: {
        quantity:
          type === "add"
            ? existingWarehouseItem.quantity + parseInt(addStockQty)
            : existingWarehouseItem.quantity - parseInt(addStockQty),
      },
    });
    console.log(updatedWarehouseItem);
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to Update the Item",
      },
      {
        status: 500,
      }
    );
  }
}
