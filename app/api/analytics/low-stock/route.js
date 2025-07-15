import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get items with quantity below reorder point
    const lowStockItems = await prisma.item.findMany({
      where: {
        quantity: {
          lte: prisma.item.fields.reorderPoint
        }
      },
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
        },
        warehouse: {
          select: {
            title: true
          }
        }
      },
      orderBy: {
        quantity: 'asc'
      }
    });

    // Get out of stock items
    const outOfStockItems = await prisma.item.findMany({
      where: {
        quantity: 0
      },
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
        },
        warehouse: {
          select: {
            title: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Calculate summary statistics
    const summary = {
      lowStockCount: lowStockItems.length,
      outOfStockCount: outOfStockItems.length,
      totalAlerts: lowStockItems.length + outOfStockItems.length,
      criticalItems: lowStockItems.filter(item => item.quantity === 0).length,
      warningItems: lowStockItems.filter(item => item.quantity > 0).length
    };

    // Group by category for chart data
    const categoryStats = await prisma.item.groupBy({
      by: ['categoryId'],
      where: {
        quantity: {
          lte: prisma.item.fields.reorderPoint
        }
      },
      _count: {
        id: true
      }
    });

    const categoryData = await Promise.all(
      categoryStats.map(async (stat) => {
        const category = await prisma.category.findUnique({
          where: { id: stat.categoryId },
          select: { title: true }
        });
        return {
          label: category?.title || 'Unknown',
          value: stat._count.id
        };
      })
    );

    const response = {
      summary,
      lowStockItems,
      outOfStockItems,
      categoryBreakdown: categoryData
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching low stock analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 