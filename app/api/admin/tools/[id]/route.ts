import { NextRequest, NextResponse } from "next/server";
import { getToolById, updateTool, deleteTool } from "@/lib/db-tools";
import { AiToolFormData } from "@/types/tools";
import { verifyAdminRole } from '@/lib/createServerSupabaseClient';

// Helper function to validate tool ID
function parseToolId(params: { id: string }): number | null {
  try {
    return parseInt(params.id, 10);
  } catch {
    return null;
  }
}

// GET - Fetch a single tool by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    if (!await verifyAdminRole()) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate ID
    const id = parseToolId(params);
    if (!id) {
      return NextResponse.json(
        { error: "Invalid tool ID" },
        { status: 400 }
      );
    }

    // Get tool
    const tool = await getToolById(id);

    if (!tool) {
      return NextResponse.json(
        { error: "Tool not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ tool });
  } catch (error) {
    console.error(`Error fetching AI tool with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch AI tool" },
      { status: 500 }
    );
  }
}

// PUT - Update a tool
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    if (!await verifyAdminRole()) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate ID
    const id = parseToolId(params);
    if (!id) {
      return NextResponse.json(
        { error: "Invalid tool ID" },
        { status: 400 }
      );
    }

    // Check if tool exists
    const existingTool = await getToolById(id);
    if (!existingTool) {
      return NextResponse.json(
        { error: "Tool not found" },
        { status: 404 }
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
      isActive: data.isActive !== undefined ? data.isActive : existingTool.isActive,
    };

    // Update tool
    const success = await updateTool(id, toolData);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update tool" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Tool updated successfully' 
    });
  } catch (error) {
    console.error(`Error updating AI tool with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to update AI tool" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a tool
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    if (!await verifyAdminRole()) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate ID
    const id = parseToolId(params);
    if (!id) {
      return NextResponse.json(
        { error: "Invalid tool ID" },
        { status: 400 }
      );
    }

    // Check if tool exists
    const existingTool = await getToolById(id);
    if (!existingTool) {
      return NextResponse.json(
        { error: "Tool not found" },
        { status: 404 }
      );
    }

    // Delete tool
    const success = await deleteTool(id);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete tool" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Tool deleted successfully' 
    });
  } catch (error) {
    console.error(`Error deleting AI tool with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete AI tool" },
      { status: 500 }
    );
  }
}