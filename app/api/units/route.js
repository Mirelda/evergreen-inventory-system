import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { title, abbreviation } = await request.json();

    // Save unit to database
    const unit = await prisma.unit.create({
      data: {
        title,
        abbreviation,
      },
    });

    console.log("Unit created:", unit);
    return NextResponse.json(unit);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to create a unit",
      },
      {
        status: 500,
      }
    );
  }
}
