/**
 * Types for prompt library functionality
 */

export interface Prompt {
  id: number;
  title: string;
  description?: string;
  content: string;
  category: string;
  tags?: string[];
  isPublic: boolean;
  isFeatured: boolean;
  authorId: number;
  version: number;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PromptWithAuthor extends Prompt {
  author: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export interface PromptSummary {
  id: number;
  title: string;
  description?: string;
  category: string;
  tags?: string[];
  isPublic: boolean;
  isFeatured: boolean;
  authorName: string;
  usageCount: number;
  version: number;
}

export interface PromptFormData {
  title: string;
  description?: string;
  content: string;
  category: string;
  tags?: string[];
  isPublic: boolean;
  isFeatured?: boolean;
}

export interface SavedPrompt {
  id: number;
  userId: number;
  promptId: number;
  prompt?: Prompt;
  createdAt: Date;
}

export interface PromptFilter {
  category?: string;
  tag?: string;
  authorId?: number;
  isPublic?: boolean;
  isFeatured?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'usageCount' | 'createdAt' | 'title';
  sortDirection?: 'asc' | 'desc';
}