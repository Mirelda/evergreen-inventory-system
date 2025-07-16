import db from "@/lib/db";
import { NextResponse } from "next/server";
const { ObjectId } = require("mongodb");
export async function POST(request) {
  try {
    const itemData = await request.json();
    function generateObjectId() {
      return new ObjectId();
    }
    // console.log(itemData);
    const existingItem = await db.item.findUnique({
      where: {
        slug: itemData.slug,
      },
    });
    if (existingItem) {
      return NextResponse.json(existingItem);
    }
    const item = await db.item.create({
      data: {
        title: itemData.title,
        categoryId: itemData.categoryId,
        sku: itemData.sku,
        barcode: itemData.barcode,
        quantity: parseInt(itemData.qty),
        unitId: itemData.unitId,
        brandId: itemData.brandId,
        supplierId: itemData.supplierId,
        buyingPrice: parseFloat(itemData.buyingPrice),
        sellingPrice: parseFloat(itemData.sellingPrice),
        reOrderPoint: parseInt(itemData.reOrderPoint),
        imageUrl: itemData.imageUrl,
        weight: parseFloat(itemData.weight),
        dimensions: itemData.dimensions,
        taxRate: parseFloat(itemData.taxRate),
        description: itemData.description,
        notes: itemData.notes,
        slug: itemData.slug,
      },
    });
    console.log(item);
    //Fetch all warehouses
    const warehouses = await prisma.warehouse.findMany();
    console.log(warehouses);
    //Find the main branch
    const mainWarehouse = warehouses.find((w) => w.warehouseType === "main");
    console.log(mainWarehouse);
    const newWarehouseItem = await prisma.warehouseItem.create({
      data: {
        itemId: item.id,
        quantity: item.quantity,
        warehouseId: mainWarehouse.id,
        givingWarehouseId: generateObjectId(),
        fromWarehouse: mainWarehouse.title,
        currentWarehouse: mainWarehouse.title,
        imageUrl: item.imageUrl,
        title: item.title,
        notes: "created from main",
        referenceNumber: "001",
      },
    });
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

export async function GET(request) {
  try {
    const items = await db.item.findMany({
      orderBy: {
        createdAt: "desc", //Latest category
      },
      include: {
        category: true, // Returns all fields for all categories
        warehouseItems: true, // Returns all warehouse items fields
      },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to Fetch items",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    const deletedItem = await db.item.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(deletedItem);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to Delete Item",
      },
      {
        status: 500,
      }
    );
  }
}
