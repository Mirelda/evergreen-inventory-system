import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get counts for all entities
    const [
      totalItems,
      totalCategories,
      totalBrands,
      totalUnits,
      totalWarehouses,
      lowStockItems,
      outOfStockItems,
      recentItems
    ] = await Promise.all([
      prisma.item.count(),
      prisma.category.count(),
      prisma.brand.count(),
      prisma.unit.count(),
      prisma.warehouse.count(),
      prisma.item.count({
        where: {
          quantity: {
            lte: 10,
            gt: 0
          }
        }
      }),
      prisma.item.count({
        where: {
          quantity: 0
        }
      }),
      prisma.item.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      })
    ]);

    // Calculate total inventory value
    const itemsWithValue = await prisma.item.findMany({
      select: {
        quantity: true,
        sellingPrice: true
      }
    });

    const totalInventoryValue = itemsWithValue.reduce((total, item) => {
      return total + (item.quantity * (item.sellingPrice || 0));
    }, 0);

    // Get top categories by item count
    const topCategories = await prisma.category.findMany({
      select: {
        title: true,
        items: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        items: {
          _count: 'desc'
        }
      },
      take: 5
    });

    const categoryData = topCategories.map(category => ({
      label: category.title,
      value: category.items.length
    }));

    // Get top brands by item count
    const topBrands = await prisma.brand.findMany({
      select: {
        title: true,
        items: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        items: {
          _count: 'desc'
        }
      },
      take: 5
    });

    const brandData = topBrands.map(brand => ({
      label: brand.title,
      value: brand.items.length
    }));

    // Get warehouse distribution
    const warehouseData = await prisma.warehouse.findMany({
      select: {
        title: true,
        addStockAdjustments: {
          select: {
            id: true
          }
        }
      }
    });

    const warehouseChartData = warehouseData.map(warehouse => ({
      label: warehouse.title,
      value: warehouse.addStockAdjustments.length
    }));

    // Calculate monthly growth (mock data for now)
    const monthlyGrowth = {
      items: 12.5,
      categories: 8.3,
      brands: 15.7,
      warehouses: 5.2
    };

    const overview = {
      metrics: {
        totalItems,
        totalCategories,
        totalBrands,
        totalUnits,
        totalWarehouses,
        lowStockItems,
        outOfStockItems,
        recentItems,
        totalInventoryValue
      },
      charts: {
        topCategories: categoryData,
        topBrands: brandData,
        warehouseDistribution: warehouseChartData
      },
      growth: monthlyGrowth
    };

    return NextResponse.json(overview);
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 