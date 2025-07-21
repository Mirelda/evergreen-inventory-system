import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);

  // Check if the user is an ADMIN
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Unauthorized: Access is restricted to ADMINs only." },
      { status: 403 }
    );
  }

  try {
    const { id } = params;
    const { role } = await request.json();

    // 1. Prevent assigning the ADMIN role to any user.
    if (role === 'ADMIN') {
      return NextResponse.json(
        { message: "Assigning the ADMIN role is not permitted." },
        { status: 403 }
      );
    }

    // 2. Find the user to be updated to check their current role.
    const userToUpdate = await prisma.user.findUnique({
      where: { id },
    });

    if (!userToUpdate) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // 3. Prevent changing the role of an existing ADMIN user.
    if (userToUpdate.role === 'ADMIN') {
      return NextResponse.json(
        { message: "The role of an ADMIN user cannot be changed." },
        { status: 403 }
      );
    }

    // Validate the role
    if (!["MANAGER", "STAFF"].includes(role)) {
      return NextResponse.json(
        { message: "Invalid role specified. Can only be MANAGER or STAFF." },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Failed to update user role:", error);
    return NextResponse.json(
      { message: "Failed to update user role", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);

  // 1. Check if user is an ADMIN
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { message: "Unauthorized: You do not have permission to perform this action." },
      { status: 403 }
    );
  }

  try {
    const { id } = params;

    // 2. Prevent admin from deleting themselves
    if (session.user.id === id) {
      return NextResponse.json(
        { message: "Error: Admins cannot delete their own account." },
        { status: 400 }
      );
    }

    // 3. Find the user to ensure they exist before deleting
    const userToDelete = await prisma.user.findUnique({
      where: { id },
    });

    if (!userToDelete) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    // 4. Delete the user
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "User deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Failed to delete user." },
      { status: 500 }
    );
  }
} 