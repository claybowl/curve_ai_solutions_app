import { NextRequest, NextResponse } from "next/server";
import { getAiTools, createAiTool } from "@/app/actions/tool-actions";
import { getCurrentSupabaseUser, isUserAdmin } from "@/lib/db-v2";

// GET - Fetch all tools with optional filtering
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentSupabaseUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const userIsAdmin = await isUserAdmin(user.id)
    if (!userIsAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Parse query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const filter: any = {};

    if (searchParams.has("category")) {
      filter.category = searchParams.get("category") as string;
    }

    if (searchParams.has("isActive")) {
      filter.isActive = searchParams.get("isActive") === "true";
    }

    if (searchParams.has("searchTerm")) {
      filter.searchTerm = searchParams.get("searchTerm") as string;
    }

    // Get tools with filters
    const tools = await getAiTools(filter);

    return NextResponse.json({ tools });
  } catch (error) {
    console.error("Error fetching AI tools:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI tools" },
      { status: 500 }
    );
  }
}

// POST - Create a new tool
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentSupabaseUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const userIsAdmin = await isUserAdmin(user.id)
    if (!userIsAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Parse request body and convert to FormData for server action
    const data = await request.json();
    const formData = new FormData();
    
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("apiEndpoint", data.apiEndpoint || "");
    formData.append("iconName", data.iconName || "");
    formData.append("category", data.category);
    formData.append("isActive", data.isActive ? "true" : "false");

    // Create tool using server action
    const result = await createAiTool(formData);

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Tool created successfully',
        toolId: result.toolId 
      }, { status: 201 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error("Error creating AI tool:", error);
    return NextResponse.json(
      { error: "Failed to create AI tool" },
      { status: 500 }
    );
  }
}