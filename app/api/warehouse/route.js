import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const warehouses = await prisma.warehouse.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(warehouses);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to fetch warehouses",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  try {
    const { title, location, warehouseType, description } = await request.json();

    // Save warehouse to database
    const warehouse = await prisma.warehouse.create({
      data: {
        title,
        location,
        warehouseType,
        description,
      },
    });

    console.log("Warehouse created:", warehouse);
    return NextResponse.json(warehouse);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to create a warehouse",
      },
      {
        status: 500,
      }
    );
  }
}
