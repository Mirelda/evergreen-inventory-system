import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/adjustments/transfer
export async function GET() {
  try {
    const transfers = await prisma.transferStockAdjustment.findMany({
      include: {
        item: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get warehouse details for giving and receiving warehouses
    const transfersWithWarehouses = await Promise.all(
      transfers.map(async (transfer) => {
        const [givingWarehouse, receivingWarehouse] = await Promise.all([
          prisma.warehouse.findUnique({
            where: { id: transfer.givingWarehouseId },
            select: { id: true, title: true },
          }),
          prisma.warehouse.findUnique({
            where: { id: transfer.receivingWarehouseId },
            select: { id: true, title: true },
          }),
        ]);

        return {
          ...transfer,
          givingWarehouse,
          receivingWarehouse,
        };
      })
    );

    return NextResponse.json(transfersWithWarehouses);
  } catch (error) {
    console.error("Get transfer stock adjustments error:", error);
    return NextResponse.json({ error: "Failed to fetch transfers." }, { status: 500 });
  }
}

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

    // Note: In this current implementation, we don't update the item's global quantity
    // since we're just transferring between warehouses. The global quantity remains the same.
    // In a real-world scenario, you might want to track stock per warehouse separately.
    // For now, we just record the transfer without changing the global stock quantity.

    return NextResponse.json(transfer, { status: 201 });
  } catch (error) {
    console.error("Stock transfer error:", error);
    return NextResponse.json({ error: "Failed to transfer stock." }, { status: 500 });
  }
} 