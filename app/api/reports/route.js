import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get date range for calculations (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    // Fetch all necessary data
    const [sales, items, addAdjustments, transferAdjustments] = await Promise.all([
      // Sales data with items
      prisma.sale.findMany({
        where: {
          createdAt: {
            gte: thirtyDaysAgo
          }
        },
        include: {
          items: {
            include: {
              item: {
                select: {
                  title: true,
                  buyingPrice: true,
                  sellingPrice: true,
                  taxRate: true,
                  category: { select: { title: true } },
                  brand: { select: { title: true } }
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      
      // All items for inventory value calculation
      prisma.item.findMany({
        include: {
          category: { select: { title: true } },
          brand: { select: { title: true } },
          unit: { select: { title: true, abbreviation: true } }
        }
      }),
      
      // Stock additions
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
              buyingPrice: true,
              taxRate: true
            }
          }
        }
      }),
      
      // Stock transfers
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
              buyingPrice: true,
              sellingPrice: true
            }
          }
        }
      })
    ]);

    // Calculate Sales Analytics
    const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalSalesQuantity = sales.reduce((sum, sale) => {
      return sum + sale.items.reduce((itemSum, item) => itemSum + item.quantitySold, 0);
    }, 0);

    // Calculate profit and tax from sales
    let totalProfit = 0;
    let totalTax = 0;
    let totalCost = 0;

    sales.forEach(sale => {
      sale.items.forEach(saleItem => {
        const quantity = saleItem.quantitySold;
        const sellingPrice = saleItem.pricePerItem;
        const buyingPrice = saleItem.item.buyingPrice || 0;
        const taxRate = saleItem.item.taxRate || 0;
        
        const itemRevenue = quantity * sellingPrice;
        const itemCost = quantity * buyingPrice;
        const itemTax = itemRevenue * (taxRate / 100);
        
        totalCost += itemCost;
        totalTax += itemTax;
        // Profit is revenue minus cost (tax is separate, not deducted from profit)
        totalProfit += (itemRevenue - itemCost);
      });
    });

    // Calculate Purchase Analytics (from stock additions)
    const totalPurchases = addAdjustments.reduce((sum, adj) => {
      const cost = adj.addStockQuantity * (adj.item.buyingPrice || 0);
      const tax = cost * ((adj.item.taxRate || 0) / 100);
      return sum + cost + tax;
    }, 0);

    const totalPurchaseQuantity = addAdjustments.reduce((sum, adj) => sum + adj.addStockQuantity, 0);

    // Calculate Current Inventory Value
    const totalInventoryValue = items.reduce((sum, item) => {
      return sum + (item.quantity * (item.sellingPrice || 0));
    }, 0);

    const totalInventoryCost = items.reduce((sum, item) => {
      return sum + (item.quantity * (item.buyingPrice || 0));
    }, 0);

    // Sales by Category
    const salesByCategory = {};
    sales.forEach(sale => {
      sale.items.forEach(saleItem => {
        const category = saleItem.item.category?.title || 'Unknown';
        const revenue = saleItem.quantitySold * saleItem.pricePerItem;
        salesByCategory[category] = (salesByCategory[category] || 0) + revenue;
      });
    });

    // Sales by Brand
    const salesByBrand = {};
    sales.forEach(sale => {
      sale.items.forEach(saleItem => {
        const brand = saleItem.item.brand?.title || 'Unknown';
        const revenue = saleItem.quantitySold * saleItem.pricePerItem;
        salesByBrand[brand] = (salesByBrand[brand] || 0) + revenue;
      });
    });

    // Daily sales for chart
    const dailySales = {};
    sales.forEach(sale => {
      const date = sale.createdAt.toISOString().split('T')[0];
      dailySales[date] = (dailySales[date] || 0) + sale.totalAmount;
    });

    // Top selling items
    const itemSales = {};
    sales.forEach(sale => {
      sale.items.forEach(saleItem => {
        const itemTitle = saleItem.item.title;
        if (!itemSales[itemTitle]) {
          itemSales[itemTitle] = {
            title: itemTitle,
            quantity: 0,
            revenue: 0
          };
        }
        itemSales[itemTitle].quantity += saleItem.quantitySold;
        itemSales[itemTitle].revenue += saleItem.quantitySold * saleItem.pricePerItem;
      });
    });

    const topSellingItems = Object.values(itemSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    // Low stock items
    const lowStockItems = items.filter(item => 
      item.reorderPoint && item.quantity <= item.reorderPoint
    ).sort((a, b) => a.quantity - b.quantity);

    // Today's Sales Count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysSalesCount = sales.filter(sale => new Date(sale.createdAt) >= today).length;

    // Stock Movement (simplified: daily net change)
    const stockMovement = {};
    [...addAdjustments, ...transferAdjustments].forEach(adj => {
      const date = adj.createdAt.toISOString().split('T')[0];
      const quantity = adj.addStockQuantity || adj.transferStockQuantity || 0;
      stockMovement[date] = (stockMovement[date] || 0) + quantity;
    });

    return NextResponse.json({
      summary: {
        totalSales: Math.round(totalSales * 100) / 100,
        totalSalesQuantity,
        totalProfit: Math.round(totalProfit * 100) / 100,
        totalTax: Math.round(totalTax * 100) / 100,
        totalPurchases: Math.round(totalPurchases * 100) / 100,
        totalPurchaseQuantity,
        totalInventoryValue: Math.round(totalInventoryValue * 100) / 100,
        totalInventoryCost: Math.round(totalInventoryCost * 100) / 100,
        profitMargin: totalSales > 0 ? Math.round(((totalProfit / totalSales) * 100) * 100) / 100 : 0,
        totalItemCount: items.length,
        todaysSalesCount,
        stockMovement: Object.entries(stockMovement).map(([date, quantity]) => ({ date, quantity })),
      },
      charts: {
        dailySales: Object.entries(dailySales).map(([date, amount]) => ({
          date,
          amount: Math.round(amount * 100) / 100
        })).sort((a, b) => new Date(a.date) - new Date(b.date)),
        
        salesByCategory: Object.entries(salesByCategory).map(([category, amount]) => ({
          category,
          amount: Math.round(amount * 100) / 100
        })).sort((a, b) => b.amount - a.amount),
        
        salesByBrand: Object.entries(salesByBrand).map(([brand, amount]) => ({
          brand,
          amount: Math.round(amount * 100) / 100
        })).sort((a, b) => b.amount - a.amount)
      },
      topSellingItems,
      lowStockItems: lowStockItems.slice(0, 10),
      recentSales: sales.slice(0, 10).map(sale => ({
        id: sale.id,
        referenceNumber: sale.referenceNumber,
        totalAmount: sale.totalAmount,
        itemCount: sale.items.length,
        createdAt: sale.createdAt
      }))
    });

  } catch (error) {
    console.error('Error fetching reports data:', error);
    return NextResponse.json({ error: 'Failed to fetch reports data.' }, { status: 500 });
  }
} 