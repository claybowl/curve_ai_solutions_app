import { NextRequest, NextResponse } from "next/server";
import { getAllTools, createTool } from "@/lib/db-tools";
import { AiToolFilter, AiToolFormData } from "@/types/tools";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";

// GET - Fetch all tools with optional filtering
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const filter: AiToolFilter = {};

    if (searchParams.has("category")) {
      filter.category = searchParams.get("category") as string;
    }

    if (searchParams.has("isActive")) {
      filter.isActive = searchParams.get("isActive") === "true";
    }

    if (searchParams.has("searchTerm")) {
      filter.searchTerm = searchParams.get("searchTerm") as string;
    }

    if (searchParams.has("createdBy")) {
      const createdByParam = searchParams.get("createdBy");
      if (createdByParam) {
        filter.createdBy = parseInt(createdByParam, 10);
      }
    }

    // Get tools with filters
    const tools = await getAllTools(filter);

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
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const data = await request.json();
    const toolData: AiToolFormData = {
      name: data.name,
      description: data.description,
      apiEndpoint: data.apiEndpoint,
      iconName: data.iconName,
      category: data.category,
      isActive: data.isActive !== undefined ? data.isActive : true,
    };

    // Get user ID from session
    const createdBy = session.user?.id ? parseInt(session.user.id as string, 10) : undefined;

    // Create tool
    const toolId = await createTool(toolData, createdBy);

    return NextResponse.json({ 
      success: true, 
      message: 'Tool created successfully',
      toolId 
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating AI tool:", error);
    return NextResponse.json(
      { error: "Failed to create AI tool" },
      { status: 500 }
    );
  }
}