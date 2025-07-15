import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get all items with their values
    const items = await prisma.item.findMany({
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
        warehouse: {
          select: {
            title: true
          }
        }
      }
    });

    // Calculate total inventory value
    const totalInventoryValue = items.reduce((total, item) => {
      return total + (item.quantity * (item.sellingPrice || 0));
    }, 0);

    // Calculate total cost value
    const totalCostValue = items.reduce((total, item) => {
      return total + (item.quantity * (item.buyingPrice || 0));
    }, 0);

    // Calculate profit margin
    const profitMargin = totalInventoryValue > 0 ? 
      ((totalInventoryValue - totalCostValue) / totalInventoryValue) * 100 : 0;

    // Group by category
    const categoryValue = items.reduce((acc, item) => {
      const categoryName = item.category?.title || 'Unknown';
      const itemValue = item.quantity * (item.sellingPrice || 0);
      
      if (!acc[categoryName]) {
        acc[categoryName] = {
          totalValue: 0,
          itemCount: 0,
          items: []
        };
      }
      
      acc[categoryName].totalValue += itemValue;
      acc[categoryName].itemCount += 1;
      acc[categoryName].items.push({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        value: itemValue,
        sellingPrice: item.sellingPrice
      });
      
      return acc;
    }, {});

    // Convert to array for chart data
    const categoryChartData = Object.entries(categoryValue).map(([category, data]) => ({
      label: category,
      value: data.totalValue,
      itemCount: data.itemCount
    }));

    // Group by warehouse
    const warehouseValue = items.reduce((acc, item) => {
      const warehouseName = item.warehouse?.title || 'Unknown';
      const itemValue = item.quantity * (item.sellingPrice || 0);
      
      if (!acc[warehouseName]) {
        acc[warehouseName] = {
          totalValue: 0,
          itemCount: 0
        };
      }
      
      acc[warehouseName].totalValue += itemValue;
      acc[warehouseName].itemCount += 1;
      
      return acc;
    }, {});

    const warehouseChartData = Object.entries(warehouseValue).map(([warehouse, data]) => ({
      label: warehouse,
      value: data.totalValue,
      itemCount: data.itemCount
    }));

    // Get top 10 most valuable items
    const topValuableItems = items
      .map(item => ({
        id: item.id,
        title: item.title,
        category: item.category?.title,
        brand: item.brand?.title,
        quantity: item.quantity,
        sellingPrice: item.sellingPrice,
        totalValue: item.quantity * (item.sellingPrice || 0)
      }))
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 10);

    // Get items with highest quantity
    const topQuantityItems = items
      .map(item => ({
        id: item.id,
        title: item.title,
        category: item.category?.title,
        quantity: item.quantity,
        sellingPrice: item.sellingPrice,
        totalValue: item.quantity * (item.sellingPrice || 0)
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    const response = {
      summary: {
        totalInventoryValue,
        totalCostValue,
        profitMargin: Math.round(profitMargin * 100) / 100,
        totalItems: items.length,
        averageItemValue: totalInventoryValue / items.length || 0
      },
      charts: {
        categoryBreakdown: categoryChartData,
        warehouseBreakdown: warehouseChartData
      },
      topItems: {
        mostValuable: topValuableItems,
        highestQuantity: topQuantityItems
      },
      detailedData: {
        categoryValue,
        warehouseValue
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching inventory value analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 