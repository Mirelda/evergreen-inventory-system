import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const {
      transferStockQty,
      itemId,
      givingWarehouseId,
      recievingWarehouseId,
      notes,
      referenceNumber,
    } = await request.json();

    // Validate item, giving warehouse, and receiving warehouse existence
    const item = await db.item.findUnique({ where: { id: itemId } });
    const givingWarehouse = await db.warehouse.findUnique({
      where: { id: givingWarehouseId },
    });
    const receivingWarehouse = await db.warehouse.findUnique({
      where: { id: recievingWarehouseId },
    });

    if (!item || !givingWarehouse || !receivingWarehouse) {
      throw new Error("Invalid warehouse IDs or item not found");
    }

    // Validate sufficient stock in giving warehouse
    const givingWarehouseItem = await db.warehouseItem.findFirst({
      where: { itemId, warehouseId: givingWarehouseId },
    });

    if (
      !givingWarehouseItem ||
      givingWarehouseItem.quantity < parseInt(transferStockQty)
    ) {
      return NextResponse.json(
        {
          data: null,
          message: "Insufficient stock in giving warehouse",
        },
        { status: 409 }
      );
    }

    // Update stock in giving warehouse
    await db.warehouseItem.update({
      where: { id: givingWarehouseItem.id },
      data: {
        quantity: givingWarehouseItem.quantity - parseInt(transferStockQty),
      },
    });

    // Check if item exists in the receiving warehouse
    const existingWarehouseItem = await db.warehouseItem.findFirst({
      where: {
        itemId,
        warehouseId: recievingWarehouseId,
      },
    });

    let updatedOrCreatedWarehouseItem;
    if (existingWarehouseItem) {
      console.log(existingWarehouseItem);
      // Update quantity if item exists in receiving warehouse
      updatedOrCreatedWarehouseItem = await db.warehouseItem.update({
        where: { id: existingWarehouseItem.id },
        data: {
          quantity: existingWarehouseItem.quantity + parseInt(transferStockQty),
        },
      });
    } else {
      console.log("created");
      // Create new warehouse item if it doesn't exist in receiving warehouse
      updatedOrCreatedWarehouseItem = await db.warehouseItem.create({
        data: {
          itemId,
          quantity: parseInt(transferStockQty),
          warehouseId: recievingWarehouseId,
          givingWarehouseId,
          fromWarehouse: givingWarehouse.title,
          currentWarehouse: receivingWarehouse.title,
          imageUrl: item.imageUrl,
          title: item.title,
          notes,
          referenceNumber,
        },
      });

      // Update the stock quantity of the giving warehouse
      await db.warehouse.update({
        where: { id: givingWarehouseId },
        data: {
          stockQty: givingWarehouse.stockQty - parseInt(transferStockQty),
        },
      });

      // Update the stock quantity of the receiving warehouse
      await db.warehouse.update({
        where: { id: recievingWarehouseId },
        data: {
          stockQty: receivingWarehouse.stockQty + parseInt(transferStockQty),
        },
      });
    }

    // Create stock transfer adjustment record
    const adjustment = await db.transferStockAdjustment.create({
      data: {
        itemId,
        referenceNumber,
        transferStockQty: parseInt(transferStockQty),
        givingWarehouseId,
        recievingWarehouseId,
        notes,
      },
    });

    return NextResponse.json({ updatedOrCreatedWarehouseItem, adjustment });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to create adjustment",
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const adjustments = await db.transferStockAdjustment.findMany({
      orderBy: {
        createdAt: "desc", // Latest adjustment
      },
      include: {
        item: true,
        givingWarehouse: true,
        receivingWarehouse: true,
      },
    });
    return NextResponse.json(adjustments);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to fetch adjustments",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    const deletedAdjustment = await db.transferStockAdjustment.delete({
      where: { id },
    });
    return NextResponse.json(deletedAdjustment);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to delete the adjustment",
      },
      { status: 500 }
    );
  }
}
