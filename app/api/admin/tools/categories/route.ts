import { NextResponse } from "next/server";
import { getToolCategories } from "@/lib/db-tools";
import { authOptions } from "@/lib/auth-config";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get tool categories
    const categories = await getToolCategories();

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching tool categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch tool categories" },
      { status: 500 }
    );
  }
}