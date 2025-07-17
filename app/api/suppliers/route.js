import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

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
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
    return NextResponse.json(
      { message: "Unauthorized: You do not have permission to delete suppliers." },
      { status: 403 }
    );
  }

  try {
    const { ids } = await request.json();
    await prisma.supplier.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return NextResponse.json({ message: "Suppliers deleted successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to Delete Suppliers",
      },
      {
        status: 500,
      }
    );
  }
}
