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
