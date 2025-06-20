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

    if (searchParams.has("category_id")) {
      filter.category_id = searchParams.get("category_id") as string;
    }

    if (searchParams.has("status")) {
      filter.status = searchParams.get("status") as string;
    }

    if (searchParams.has("search_term")) {
      filter.search_term = searchParams.get("search_term") as string;
    }

    if (searchParams.has("tool_type")) {
      filter.tool_type = searchParams.get("tool_type") as string;
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
    
    // Use new schema field names
    formData.append("name", data.name || "");
    formData.append("description", data.description || "");
    formData.append("detailed_description", data.detailed_description || "");
    formData.append("api_endpoint", data.api_endpoint || "");
    formData.append("category_id", data.category_id || "");
    formData.append("tool_type", data.tool_type || "custom");
    formData.append("complexity_level", data.complexity_level || "beginner");
    formData.append("pricing_model", data.pricing_model || "free");
    formData.append("status", data.status || "active");
    formData.append("is_featured", data.is_featured ? "true" : "false");
    formData.append("is_public", data.is_public ? "true" : "false");
    
    // Handle array fields
    if (data.tags && Array.isArray(data.tags)) {
      data.tags.forEach((tag: string) => formData.append("tags", tag));
    }
    
    if (data.keywords && Array.isArray(data.keywords)) {
      data.keywords.forEach((keyword: string) => formData.append("keywords", keyword));
    }

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