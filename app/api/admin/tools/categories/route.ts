import { NextResponse } from "next/server";
import { getToolCategories } from "@/lib/db-tools";
import { verifyAdminRole } from '@/lib/createServerSupabaseClient';

export async function GET() {
  try {
    // Check authentication
    if (!await verifyAdminRole()) {
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