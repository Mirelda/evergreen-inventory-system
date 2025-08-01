import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
    return NextResponse.json(
      { message: "Unauthorized: You do not have permission to delete this sale." },
      { status: 403 }
    );
  }

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Sale ID is required" },
        { status: 400 }
      );
    }

    // Use a transaction to delete sale and restore stock
    await prisma.$transaction(async (tx) => {
      // First get the sale with its items
      const sale = await tx.sale.findUnique({
        where: { id },
        include: {
          items: true
        }
      });

      if (!sale) {
        throw new Error("Sale not found");
      }

      // Restore stock for each item
      for (const saleItem of sale.items) {
        await tx.item.update({
          where: { id: saleItem.itemId },
          data: {
            quantity: {
              increment: saleItem.quantitySold,
            },
          },
        });
      }

      // Delete sale items first
      await tx.saleItem.deleteMany({
        where: { saleId: id }
      });

      // Delete the sale
      await tx.sale.delete({
        where: { id }
      });
    });

    return NextResponse.json({ message: "Sale deleted successfully" });
  } catch (error) {
    console.error("Failed to delete sale:", error);
    return NextResponse.json(
      { message: "Failed to delete sale", error: error.message },
      { status: 500 }
    );
  }
} 