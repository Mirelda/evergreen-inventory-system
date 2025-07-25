import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { logItem, getClientInfo } from "@/lib/activityLogger";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      include: {
        category: true,
        brand: true,
        unit: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(items);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to fetch items",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const { ip, userAgent } = getClientInfo(request);
    const data = await request.json();

    console.log("Received data:", data);

    // Save item to database
    const item = await prisma.item.create({
      data: {
        title: data.title,
        categoryId: data.categoryId,
        sku: data.sku,
        barcode: data.barcode,
        quantity: data.qty ? parseInt(data.qty) : 0,
        unitId: data.unitId,
        brandId: data.brandId,
        buyingPrice: data.buyingPrice ? parseFloat(data.buyingPrice) : 0,
        sellingPrice: data.sellingPrice ? parseFloat(data.sellingPrice) : 0,
        unitPrice: data.unitPrice ? parseFloat(data.unitPrice) : (data.buyingPrice ? parseFloat(data.buyingPrice) : 0),
        reorderPoint: data.reOrderPoint ? parseInt(data.reOrderPoint) : null,
        imageUrl: data.imageUrl || null,
        weight: data.weight ? parseFloat(data.weight) : null,
        dimensions: data.dimensions || null,
        taxRate: data.taxRate ? parseFloat(data.taxRate) : null,
        description: data.description || null,
        notes: data.notes || null,
        warehouseId: data.warehouseId || null,
      },
    });

    // Log the activity
    await logItem(
      'CREATE',
      item.id,
      item.title,
      session?.user?.id,
      ip,
      userAgent,
      null, // oldValues
      {
        title: item.title,
        sku: item.sku,
        quantity: item.quantity,
        sellingPrice: item.sellingPrice
      }
    );

    console.log("Item created:", item);
    return NextResponse.json(item);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to create an item",
      },
      {
        status: 500,
      }
    );
  }
}
