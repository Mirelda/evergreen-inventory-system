import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const {
      title,
      phone,
      email,
      address,
      contactPerson,
      supplierCode,
      taxID,
      paymentTerms,
      notes,
    } = await request.json();

    const supplier = await prisma.supplier.create({
      data: {
        title,
        phone,
        email,
        address,
        contactPerson,
        supplierCode,
        taxID,
        paymentTerms,
        notes,
      },
    });
    console.log(supplier);
    return NextResponse.json(supplier);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to create a Supplier",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request) {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: {
        createdAt: "desc", //Latest Suppliers
      },
    });
    return NextResponse.json(suppliers);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to Fetch suppliers",
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
    const deletedSupplier = await prisma.supplier.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(deletedSupplier);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to Delete Supplier",
      },
      {
        status: 500,
      }
    );
  }
}
