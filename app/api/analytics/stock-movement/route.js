import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get recent stock adjustments (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const [addAdjustments, transferAdjustments] = await Promise.all([
      prisma.addStockAdjustment.findMany({
        where: {
          createdAt: {
            gte: thirtyDaysAgo
          }
        },
        include: {
          item: {
            select: {
              title: true,
              sku: true
            }
          },
          warehouse: {
            select: {
              title: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.transferStockAdjustment.findMany({
        where: {
          createdAt: {
            gte: thirtyDaysAgo
          }
        },
        include: {
          item: {
            select: {
              title: true,
              sku: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    ]);

    // Calculate total stock added in last 30 days
    const totalStockAdded = addAdjustments.reduce((total, adj) => {
      return total + adj.addStockQuantity;
    }, 0);

    // Calculate total stock transferred in last 30 days
    const totalStockTransferred = transferAdjustments.reduce((total, adj) => {
      return total + adj.transferStockQuantity;
    }, 0);

    // Group adjustments by date for chart data
    const dailyAdditions = addAdjustments.reduce((acc, adj) => {
      const date = adj.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += adj.addStockQuantity;
      return acc;
    }, {});

    const dailyTransfers = transferAdjustments.reduce((acc, adj) => {
      const date = adj.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += adj.transferStockQuantity;
      return acc;
    }, {});

    // Get top items by stock movement
    const itemMovement = addAdjustments.reduce((acc, adj) => {
      const itemTitle = adj.item?.title || 'Unknown';
      if (!acc[itemTitle]) {
        acc[itemTitle] = {
          totalAdded: 0,
          adjustments: 0
        };
      }
      acc[itemTitle].totalAdded += adj.addStockQuantity;
      acc[itemTitle].adjustments += 1;
      return acc;
    }, {});

    const topMovingItems = Object.entries(itemMovement)
      .map(([item, data]) => ({
        item,
        totalAdded: data.totalAdded,
        adjustments: data.adjustments
      }))
      .sort((a, b) => b.totalAdded - a.totalAdded)
      .slice(0, 10);

    // Get warehouse activity
    const warehouseActivity = addAdjustments.reduce((acc, adj) => {
      const warehouseTitle = adj.warehouse?.title || 'Unknown';
      if (!acc[warehouseTitle]) {
        acc[warehouseTitle] = {
          totalAdded: 0,
          adjustments: 0
        };
      }
      acc[warehouseTitle].totalAdded += adj.addStockQuantity;
      acc[warehouseTitle].adjustments += 1;
      return acc;
    }, {});

    const warehouseChartData = Object.entries(warehouseActivity)
      .map(([warehouse, data]) => ({
        label: warehouse,
        value: data.totalAdded,
        adjustments: data.adjustments
      }))
      .sort((a, b) => b.value - a.value);

    // Calculate movement trends (last 7 days vs previous 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const [recentAdditions, previousAdditions] = await Promise.all([
      prisma.addStockAdjustment.aggregate({
        where: {
          createdAt: {
            gte: sevenDaysAgo
          }
        },
        _sum: {
          addStockQuantity: true
        }
      }),
      prisma.addStockAdjustment.aggregate({
        where: {
          createdAt: {
            gte: fourteenDaysAgo,
            lt: sevenDaysAgo
          }
        },
        _sum: {
          addStockQuantity: true
        }
      })
    ]);

    const recentTotal = recentAdditions._sum.addStockQuantity || 0;
    const previousTotal = previousAdditions._sum.addStockQuantity || 0;
    const growthRate = previousTotal > 0 ? 
      ((recentTotal - previousTotal) / previousTotal) * 100 : 0;

    const response = {
      summary: {
        totalStockAdded,
        totalStockTransferred,
        totalAdjustments: addAdjustments.length + transferAdjustments.length,
        growthRate: Math.round(growthRate * 100) / 100
      },
      recentActivity: {
        addAdjustments: addAdjustments.slice(0, 10),
        transferAdjustments: transferAdjustments.slice(0, 10)
      },
      charts: {
        dailyAdditions: Object.entries(dailyAdditions).map(([date, value]) => ({
          date,
          value
        })),
        dailyTransfers: Object.entries(dailyTransfers).map(([date, value]) => ({
          date,
          value
        })),
        warehouseActivity: warehouseChartData
      },
      topItems: topMovingItems,
      trends: {
        recentPeriod: recentTotal,
        previousPeriod: previousTotal,
        growthRate: Math.round(growthRate * 100) / 100
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching stock movement analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 