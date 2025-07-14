import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/adjustments/transfer
export async function POST(request) {
  try {
    const body = await request.json();
    const { itemId, givingWarehouseId, receivingWarehouseId, transferStockQuantity, referenceNumber, notes } = body;

    if (!itemId || !givingWarehouseId || !receivingWarehouseId || !transferStockQuantity || !referenceNumber) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Create transfer record
    const transfer = await prisma.transferStockAdjustment.create({
      data: {
        itemId,
        givingWarehouseId,
        receivingWarehouseId,
        transferStockQuantity: Number(transferStockQuantity),
        referenceNumber,
        notes,
      },
    });

    // Update item's stock quantity (decrement from giving warehouse, increment to receiving warehouse)
    // Note: In a real-world scenario, item stock should be tracked per warehouse. Here, we only update the global quantity.
    await prisma.item.update({
      where: { id: itemId },
      data: {
        quantity: {
          decrement: Number(transferStockQuantity),
        },
      },
    });

    // (Optional: You may want to increment quantity in the receiving warehouse if you track per-warehouse stock.)

    return NextResponse.json(transfer, { status: 201 });
  } catch (error) {
    console.error("Stock transfer error:", error);
    return NextResponse.json({ error: "Failed to transfer stock." }, { status: 500 });
  }
} 