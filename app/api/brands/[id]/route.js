import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

const prisma = new PrismaClient();

// GET - Fetch a single brand by ID
export async function GET(request, { params }) {
  try {
    const id = await params.id;
    
    const brand = await prisma.brand.findUnique({
      where: { id }
    });

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(brand);
  } catch (error) {
    console.error('Error fetching brand:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update a brand
export async function PUT(request, { params }) {
  try {
    const id = await params.id;
    const { title } = await request.json();

    // Validate required fields
    if (!title || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Check if brand exists
    const existingBrand = await prisma.brand.findUnique({
      where: { id }
    });

    if (!existingBrand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    // Update brand
    const updatedBrand = await prisma.brand.update({
      where: { id },
      data: {
        title: title.trim(),
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      message: 'Brand updated successfully',
      brand: updatedBrand
    });
  } catch (error) {
    console.error('Error updating brand:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
    return NextResponse.json(
      { message: 'Unauthorized: You do not have permission to delete this brand.' },
      { status: 403 }
    );
  }

  try {
    const { id } = params;
    
    const deletedBrand = await prisma.brand.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Brand deleted successfully',
      brand: deletedBrand
    });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

 