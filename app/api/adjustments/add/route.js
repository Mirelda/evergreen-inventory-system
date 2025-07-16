import db from "@/lib/db";
import { NextResponse } from "next/server";

// export async function POST(request) {
//   try {
//     const {
//       addStockQty,
//       recievingWarehouseId,
//       notes,
//       referenceNumber,
//       itemId,
//       supplierId,
//     } = await request.json();

//     //Get the Item
//     const itemToUpdate = await db.item.findUnique({
//       where: {
//         id: itemId,
//       },
//     });
//     // console.log(itemToUpdate);
//     //Current Item Quantity
//     const currentItemQty = itemToUpdate.quantity;
//     const newQty = parseInt(currentItemQty) + parseInt(addStockQty);

//     // Modify the Item to the New Qty
//     const updatedItem = await db.item.update({
//       where: {
//         id: itemId,
//       },
//       data: {
//         quantity: newQty,
//       },
//     });
//     // Get the wareHouse
//     const warehouse = await db.warehouse.findUnique({
//       where: {
//         id: recievingWarehouseId,
//       },
//     });
//     //Current Stock of the warehouse
//     const currentWarehouseStock = warehouse.stockQty;
//     const newStockQty = parseInt(currentWarehouseStock) + parseInt(addStockQty);
//     //Update the Stock on the Warehouse
//     const updatedWarehouse = await db.warehouse.update({
//       where: {
//         id: recievingWarehouseId,
//       },
//       data: {
//         stockQty: newStockQty,
//       },
//     });

//     // console.log(updatedItem);
//     const adjustment = await db.addStockAdjustment.create({
//       data: {
//         itemId,
//         referenceNumber,
//         addStockQty: parseInt(addStockQty),
//         recievingWarehouseId,
//         notes,
//         supplierId,
//       },
//     });

//     //Affect the ware house
//     return NextResponse.json(adjustment);
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       {
//         error,
//         message: "Failed to create adjustment",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }
export async function POST(request) {
  try {
    const {
      addStockQty,
      recievingWarehouseId,
      notes,
      referenceNumber,
      itemId,
      supplierId,
    } = await request.json();

    // Get the warehouse
    const warehouse = await db.warehouse.findUnique({
      where: {
        id: recievingWarehouseId,
      },
    });

    // Find the Item to be Updated
    const item = await db.item.findFirst({
      where: {
        id: itemId,
      },
    });
    // Check if the item already exists in the warehouse
    const existingItem = await db.item.findFirst({
      where: {
        id: itemId,
        // warehouseId: recievingWarehouseId,
      },
    });

    if (existingItem) {
      // If the item already exists, update its quantity
      const updatedItem = await db.item.update({
        where: {
          id: itemId,
        },
        data: {
          quantity: {
            increment: parseInt(addStockQty),
          },
        },
      });
    } else {
      // If the item does not exist, create a new item in the warehouse
      const newItem = await db.item.create({
        data: {
          title: `${item.title} - ${warehouse.title}`,
          // warehouseId: recievingWarehouseId,
          quantity: parseInt(addStockQty),
          categoryId: item.categoryId,
          sku: item.sku,
          barcode: item.barcode,
          unitId: item.unitId,
          brandId: item.brandId,
          supplierId: item.supplierId,
          buyingPrice: parseFloat(item.buyingPrice),
          sellingPrice: parseFloat(item.sellingPrice),
          reOrderPoint: parseInt(item.reOrderPoint),
          imageUrl: item.imageUrl,
          weight: parseFloat(item.weight),
          dimensions: item.dimensions,
          taxRate: parseFloat(item.taxRate),
          description: item.description,
          notes: item.notes,
        },
      });
    }

    // Update the stock on the warehouse
    const updatedWarehouse = await db.warehouse.update({
      where: {
        id: recievingWarehouseId,
      },
      data: {
        stockQty: {
          increment: parseInt(addStockQty),
        },
      },
    });

    // Create the stock adjustment record
    const adjustment = await db.addStockAdjustment.create({
      data: {
        itemId,
        referenceNumber,
        addStockQty: parseInt(addStockQty),
        recievingWarehouseId,
        notes,
        supplierId,
      },
    });

    return NextResponse.json(adjustment);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to create adjustment",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request) {
  try {
    const adjustments = await db.addStockAdjustment.findMany({
      orderBy: {
        createdAt: "desc", //Latest category
      },
    });
    return NextResponse.json(adjustments);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to Fetch adjustments",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    const deletedAdjustment = await db.addStockAdjustment.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(deletedAdjustment);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to Delete the Adjustment",
      },
      {
        status: 500,
      }
    );
  }
}
