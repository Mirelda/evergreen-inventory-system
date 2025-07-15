import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/adjustments/add
export async function GET() {
  try {
    const adjustments = await prisma.addStockAdjustment.findMany({
      include: {
        item: {
          select: {
            id: true,
            title: true,
          },
        },
        warehouse: {
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

    return NextResponse.json(adjustments);
  } catch (error) {
    console.error("Get add stock adjustments error:", error);
    return NextResponse.json({ error: "Failed to fetch adjustments." }, { status: 500 });
  }
}

// POST /api/adjustments/add
export async function POST(request) {
  try {
    const body = await request.json();
    const { itemId, warehouseId, addStockQuantity, referenceNumber, notes } = body;

    if (!itemId || !warehouseId || !addStockQuantity || !referenceNumber) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Create adjustment record
    const adjustment = await prisma.addStockAdjustment.create({
      data: {
        itemId,
        warehouseId,
        addStockQuantity: Number(addStockQuantity),
        referenceNumber,
        notes,
      },
    });

    // Update item's stock quantity
    await prisma.item.update({
      where: { id: itemId },
      data: {
        quantity: {
          increment: Number(addStockQuantity),
        },
      },
    });

    return NextResponse.json(adjustment, { status: 201 });
  } catch (error) {
    console.error("Add stock error:", error);
    return NextResponse.json({ error: "Failed to add stock." }, { status: 500 });
  }
} 