import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const id = await params.id;
    
    const category = await prisma.category.findUnique({
      where: {
        id: id,
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
    const id = await params.id;
    const data = await request.json();

    const updatedCategory = await prisma.category.update({
      where: {
        id: id,
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
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
    return NextResponse.json(
      { message: "Unauthorized: You do not have permission to delete this category." },
      { status: 403 }
    );
  }

  try {
    const { id } = params;
    
    const deletedCategory = await prisma.category.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({
      message: "Category deleted successfully",
      category: deletedCategory,
    });
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

 