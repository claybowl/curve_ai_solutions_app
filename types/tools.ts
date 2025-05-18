/**
 * Types for AI tools functionality
 */

export interface AiTool {
  id: number;
  name: string;
  description: string;
  apiEndpoint?: string;
  iconName?: string;
  category?: string;
  isActive: boolean;
  createdBy?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AiToolSummary {
  id: number;
  name: string;
  description: string;
  iconName?: string;
  category?: string;
  isActive: boolean;
}

export interface AiToolFormData {
  name: string;
  description: string;
  apiEndpoint?: string;
  iconName?: string;
  category?: string;
  isActive: boolean;
}

export interface AiToolCategory {
  id: string;
  name: string;
  description: string;
  pattern: string[];
  color: string;
  icon: string;
  tools: AiTool[];
}

export interface AiToolFilter {
  category?: string;
  isActive?: boolean;
  createdBy?: number;
  searchTerm?: string;
}