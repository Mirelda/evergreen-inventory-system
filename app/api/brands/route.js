import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { title } = await request.json();

    // Save brand to database
    const brand = await prisma.brand.create({
      data: {
        title,
      },
    });

    console.log("Brand created:", brand);
    return NextResponse.json(brand);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to create a brand",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(brands);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
