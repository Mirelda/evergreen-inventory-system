import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get all items first, then filter in JavaScript
    const allItems = await prisma.item.findMany({
      include: {
        category: {
          select: {
            title: true
          }
        },
        brand: {
          select: {
            title: true
          }
        },
        unit: {
          select: {
            title: true,
            abbreviation: true
          }
        }
      }
    });

    // Filter items with quantity below reorder point
    const lowStockItems = allItems.filter(item => 
      item.reorderPoint && item.quantity <= item.reorderPoint
    ).sort((a, b) => a.quantity - b.quantity);

    return NextResponse.json(lowStockItems);
  } catch (error) {
    console.error('Error fetching low stock analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch low stock data.' }, { status: 500 });
  }
} 