import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch a single warehouse by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const warehouse = await prisma.warehouse.findUnique({
      where: { id }
    });

    if (!warehouse) {
      return NextResponse.json(
        { error: 'Warehouse not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(warehouse);
  } catch (error) {
    console.error('Error fetching warehouse:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update a warehouse
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { title, location, warehouseType, description } = await request.json();

    // Validate required fields
    if (!title || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!location || location.trim() === '') {
      return NextResponse.json(
        { error: 'Location is required' },
        { status: 400 }
      );
    }

    if (!warehouseType || warehouseType.trim() === '') {
      return NextResponse.json(
        { error: 'Warehouse type is required' },
        { status: 400 }
      );
    }

    // Check if warehouse exists
    const existingWarehouse = await prisma.warehouse.findUnique({
      where: { id }
    });

    if (!existingWarehouse) {
      return NextResponse.json(
        { error: 'Warehouse not found' },
        { status: 404 }
      );
    }

    // Update warehouse
    const updatedWarehouse = await prisma.warehouse.update({
      where: { id },
      data: {
        title: title.trim(),
        location: location.trim(),
        warehouseType: warehouseType.trim(),
        description: description?.trim() || '',
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      message: 'Warehouse updated successfully',
      warehouse: updatedWarehouse
    });
  } catch (error) {
    console.error('Error updating warehouse:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const deletedWarehouse = await prisma.warehouse.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Warehouse deleted successfully',
      warehouse: deletedWarehouse
    });
  } catch (error) {
    console.error('Error deleting warehouse:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 