import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const data = await request.json();

    console.log("Received data:", data);

    // Save item to database
    const item = await prisma.item.create({
      data: {
        title: data.title,
        categoryId: data.categoryId,
        sku: data.sku,
        barcode: data.barcode,
        qty: parseInt(data.qty),
        unitId: data.unitId,
        brandId: data.brandId,
        supplierId: data.supplierId,
        buyingPrice: parseFloat(data.buyingPrice),
        sellingPrice: parseFloat(data.sellingPrice),
        reOrderPoint: parseInt(data.reOrderPoint),
        warehouseId: data.warehouseId,
        imageUrl: data.imageUrl,
        weight: parseFloat(data.weight),
        dimensions: data.dimensions,
        taxRate: parseFloat(data.taxRate),
        description: data.description,
        notes: data.notes,
      },
    });

    console.log("Item created:", item);
    return NextResponse.json(item);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to create a Item",
      },
      {
        status: 500,
      }
    );
  }
}
