import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const id = await params.id;
    const item = await prisma.item.findUnique({
      where: {
        id: id,
      },
      include: {
        category: true,
        brand: true,
        unit: true,
      },
    });

    if (!item) {
      return NextResponse.json(
        {
          message: "Item not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to fetch item",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const id = await params.id;
    const data = await request.json();

    const updatedItem = await prisma.item.update({
      where: {
        id: id,
      },
      data: {
        title: data.title,
        description: data.description,
        sku: data.sku,
        barcode: data.barcode,
        quantity: data.quantity,
        unitId: data.unitId,
        brandId: data.brandId,
        categoryId: data.categoryId,
        unitPrice: data.unitPrice,
        sellingPrice: data.sellingPrice,
        buyingPrice: data.buyingPrice,
        reorderPoint: data.reorderPoint,
        imageUrl: data.imageUrl,
        dimensions: data.dimensions,
        taxRate: data.taxRate,
        notes: data.notes,
      },
      include: {
        category: true,
        brand: true,
        unit: true,
      },
    });

    console.log("Item updated:", updatedItem);
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to update item",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = await params.id;
    const deletedItem = await prisma.item.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({
      message: "Item deleted successfully",
      item: deletedItem,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to delete item",
      },
      {
        status: 500,
      }
    );
  }
}

 