import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: params.id,
      },
      include: {
        items: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          message: "Category not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to fetch category",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();

    const updatedCategory = await prisma.category.update({
      where: {
        id: params.id,
      },
      data: {
        title: data.title,
        description: data.description,
      },
      include: {
        items: true,
      },
    });

    console.log("Category updated:", updatedCategory);
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to update category",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.category.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(
      {
        message: "Category deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to delete category",
      },
      {
        status: 500,
      }
    );
  }
} 