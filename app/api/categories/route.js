import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to fetch categories",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  try {
    const { title, description } = await request.json();

    // Save to MongoDB
    const category = await prisma.category.create({
      data: {
        title,
        description,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log(error);
    // Return error response if category creation fails
    return NextResponse.json(
      {
        error,
        message: "Failed to create a category",
      },
      {
        status: 500,
      }
    );
  }
}
