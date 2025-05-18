/**
 * Types for blog functionality
 */

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  description?: string;
  featuredImage?: string;
  published: boolean;
  authorId: number;
  notionPageId?: string;
  tags?: string[];
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface BlogPostWithAuthor extends BlogPost {
  author: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface BlogPostSummary {
  id: number;
  title: string;
  slug: string;
  description?: string;
  featuredImage?: string;
  published: boolean;
  authorName: string;
  tags?: string[];
  viewCount: number;
  publishedAt?: Date;
}

export interface BlogPostFormData {
  title: string;
  slug: string;
  content: string;
  description?: string;
  featuredImage?: string;
  published: boolean;
  tags?: string[];
}

export interface BlogPostFilter {
  tag?: string;
  authorId?: number;
  published?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'publishedAt' | 'viewCount' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
}