import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        items: {
          include: {
            item: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(sales);
  } catch (error) {
    console.error("Failed to fetch sales:", error);
    return NextResponse.json(
      { message: "Failed to fetch sales", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { items, totalAmount } = await request.json();

    // Ensure all required data is present
    if (!items || items.length === 0 || !totalAmount) {
      return NextResponse.json(
        { message: "Missing required sale data" },
        { status: 400 }
      );
    }

    // Use a Prisma transaction to ensure all operations succeed or none do
    const newSale = await prisma.$transaction(async (tx) => {
      // 1. Create the main Sale record
      const sale = await tx.sale.create({
        data: {
          referenceNumber: `SALE-${Math.random().toString(36).substring(7).toUpperCase()}`, // Generate a random ref number
          totalAmount,
        },
      });

      // 2. Create a SaleItem for each item in the sale and update stock
      for (const item of items) {
        await tx.saleItem.create({
          data: {
            saleId: sale.id,
            itemId: item.id,
            quantitySold: item.quantity,
            pricePerItem: item.price,
          },
        });

        // 3. Update the item's stock quantity
        await tx.item.update({
          where: { id: item.id },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      return sale;
    });

    return NextResponse.json(newSale, { status: 201 });
  } catch (error) {
    console.error("Failed to create sale:", error);
    return NextResponse.json(
      { message: "Failed to create sale", error: error.message },
      { status: 500 }
    );
  }
} 