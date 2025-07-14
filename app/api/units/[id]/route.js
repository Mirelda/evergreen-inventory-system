import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch a single unit by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const unit = await prisma.unit.findUnique({
      where: { id }
    });

    if (!unit) {
      return NextResponse.json(
        { error: 'Unit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(unit);
  } catch (error) {
    console.error('Error fetching unit:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update a unit
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { title, shortName } = await request.json();

    // Validate required fields
    if (!title || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!shortName || shortName.trim() === '') {
      return NextResponse.json(
        { error: 'Short name is required' },
        { status: 400 }
      );
    }

    // Check if unit exists
    const existingUnit = await prisma.unit.findUnique({
      where: { id }
    });

    if (!existingUnit) {
      return NextResponse.json(
        { error: 'Unit not found' },
        { status: 404 }
      );
    }

    // Update unit
    const updatedUnit = await prisma.unit.update({
      where: { id },
      data: {
        title: title.trim(),
        shortName: shortName.trim(),
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      message: 'Unit updated successfully',
      unit: updatedUnit
    });
  } catch (error) {
    console.error('Error updating unit:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const deletedUnit = await prisma.unit.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Unit deleted successfully',
      unit: deletedUnit
    });
  } catch (error) {
    console.error('Error deleting unit:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

 