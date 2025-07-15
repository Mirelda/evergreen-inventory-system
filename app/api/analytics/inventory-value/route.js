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
        unit: {
          select: {
            title: true,
            abbreviation: true
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
    const profitMargin = totalInventoryValue > 0 ? ((totalInventoryValue - totalCostValue) / totalInventoryValue) * 100 : 0;

    // Group by category for breakdown
    const categoryBreakdown = items.reduce((acc, item) => {
      const categoryName = item.category?.title || 'Unknown';
      const itemValue = item.quantity * (item.sellingPrice || 0);
      
      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }
      acc[categoryName] += itemValue;
      
      return acc;
    }, {});

    const categoryData = Object.entries(categoryBreakdown).map(([category, value]) => ({
      category,
      value: Math.round(value * 100) / 100
    }));

    // Group by brand for breakdown
    const brandBreakdown = items.reduce((acc, item) => {
      const brandName = item.brand?.title || 'Unknown';
      const itemValue = item.quantity * (item.sellingPrice || 0);
      
      if (!acc[brandName]) {
        acc[brandName] = 0;
      }
      acc[brandName] += itemValue;
      
      return acc;
    }, {});

    const brandData = Object.entries(brandBreakdown).map(([brand, value]) => ({
      brand,
      value: Math.round(value * 100) / 100
    }));

    const response = {
      totalInventoryValue: Math.round(totalInventoryValue * 100) / 100,
      totalCostValue: Math.round(totalCostValue * 100) / 100,
      profitMargin: Math.round(profitMargin * 100) / 100,
      totalItems: items.length,
      categoryBreakdown: categoryData,
      brandBreakdown: brandData,
      averageItemValue: items.length > 0 ? Math.round((totalInventoryValue / items.length) * 100) / 100 : 0
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching inventory value analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory value data.' }, { status: 500 });
  }
} 