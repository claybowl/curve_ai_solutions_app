# Server Actions Documentation

This document describes the server actions implemented for Curve AI Solutions, providing secure and efficient backend operations for the admin dashboards and client-facing features.

## Overview

Server Actions are a Next.js feature that allows you to define asynchronous functions that run on the server but can be invoked from client components. These actions provide a secure and efficient way to handle form submissions, database operations, and other server-side logic.

In this project, we've implemented server actions for:

1. Blog post management
2. Prompt library management
3. AI tools management
4. Permissions and roles management

## Authorization System

All server actions include built-in authorization checks using the following mechanisms:

- **Session Verification**: Checking for an authenticated user session using NextAuth
- **Role-Based Access Control**: Verifying user roles (admin, client, etc.)
- **Permission-Based Access Control**: Checking granular permissions for specific operations
- **Content Ownership**: Verifying if the user is allowed to manage specific content

The authorization utilities are centralized in `/lib/auth-utils.ts` to ensure consistent checks across all actions.

## Blog Post Management Actions

Located in `/app/actions/blog-actions.ts`

| Action | Description | Required Permission |
|--------|-------------|---------------------|
| `getBlogPostsAction` | Fetches blog posts with optional filtering | None (public) / `manage_blog` (for drafts) |
| `getBlogPostBySlugAction` | Fetches a single blog post by slug | None (public) / `manage_blog` (for drafts) |
| `createBlogPostAction` | Creates a new blog post | `manage_blog` |
| `updateBlogPostAction` | Updates an existing blog post | `manage_blog` |
| `deleteBlogPostAction` | Deletes a blog post | `manage_blog` |
| `generateSlugAction` | Generates a slug from a title | None |
| `toggleBlogPostPublishStatusAction` | Toggles published status | `publish_blog` |

## Prompt Library Management Actions

Located in `/app/actions/prompt-actions.ts`

| Action | Description | Required Permission |
|--------|-------------|---------------------|
| `getPromptsAction` | Fetches prompts with optional filtering | None (public) / `manage_prompts` (for private) |
| `getPromptByIdAction` | Fetches a single prompt by ID | None (public) / `manage_prompts` (for private) |
| `createPromptAction` | Creates a new prompt | `manage_prompts` |
| `updatePromptAction` | Updates an existing prompt | `manage_prompts` |
| `deletePromptAction` | Deletes a prompt | `manage_prompts` |
| `getPromptCategoriesAction` | Gets all prompt categories | None |
| `savePromptForUserAction` | Saves a prompt for current user | Authenticated user |
| `removeSavedPromptAction` | Removes a saved prompt | Authenticated user |
| `getUserSavedPromptsAction` | Gets all saved prompts for user | Authenticated user |
| `togglePromptPublicStatusAction` | Toggles public status | `publish_prompts` |

## AI Tools Management Actions

Located in `/app/actions/tool-management-actions.ts`

| Action | Description | Required Permission |
|--------|-------------|---------------------|
| `getAllToolsAction` | Fetches AI tools with optional filtering | None (public) / `manage_tools` (for inactive) |
| `getToolByIdAction` | Fetches a single tool by ID | None (public) / `manage_tools` (for inactive) |
| `createToolAction` | Creates a new AI tool | `manage_tools` |
| `updateToolAction` | Updates an existing AI tool | `manage_tools` |
| `deleteToolAction` | Deletes an AI tool | `manage_tools` |
| `getToolCategoriesAction` | Gets all tool categories | None |
| `getRecommendedToolsAction` | Gets recommended tools for user | None |
| `toggleToolActiveStatusAction` | Toggles active status | `manage_tools` |

## Permissions Management Actions

Located in `/app/actions/permission-actions.ts`

| Action | Description | Required Permission |
|--------|-------------|---------------------|
| `getAllPermissionsAction` | Fetches all permissions | `manage_roles` |
| `getPermissionsByCategoryAction` | Gets permissions by category | `manage_roles` |
| `getAllRolesAction` | Fetches all roles | `manage_roles` |
| `getRoleByIdAction` | Fetches a single role by ID | `manage_roles` |
| `createRoleAction` | Creates a new role | `manage_roles` |
| `updateRoleAction` | Updates an existing role | `manage_roles` |
| `deleteRoleAction` | Deletes a role | `manage_roles` |
| `getUserPermissionsAction` | Gets user permissions and roles | `manage_roles` / Self |
| `assignRolesToUserAction` | Assigns roles to a user | `manage_roles` |
| `setUserPermissionAction` | Sets direct user permission | `manage_roles` |
| `removeUserPermissionAction` | Removes direct user permission | `manage_roles` |
| `checkCurrentUserPermissionAction` | Checks if user has permission | Authenticated user |

## Using Server Actions in Components

Server actions can be used in both client and server components:

### In Client Components

```tsx
"use client"

import { getBlogPostsAction } from "@/app/actions/blog-actions"

export default function BlogList() {
  const [posts, setPosts] = useState([])
  
  useEffect(() => {
    async function loadPosts() {
      const posts = await getBlogPostsAction({ published: true })
      setPosts(posts)
    }
    
    loadPosts()
  }, [])
  
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.description}</p>
        </div>
      ))}
    </div>
  )
}
```

### In Server Components

```tsx
import { getBlogPostsAction } from "@/app/actions/blog-actions"

export default async function BlogPage() {
  const posts = await getBlogPostsAction({ published: true })
  
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.description}</p>
        </div>
      ))}
    </div>
  )
}
```

### With Forms

```tsx
"use client"

import { createBlogPostAction } from "@/app/actions/blog-actions"

export default function CreateBlogForm() {
  return (
    <form action={createBlogPostAction}>
      <input type="text" name="title" placeholder="Title" required />
      <input type="text" name="slug" placeholder="Slug" required />
      <textarea name="content" placeholder="Content" required />
      <button type="submit">Create Post</button>
    </form>
  )
}
```

## Example Pages

For development and testing purposes, example pages have been created to demonstrate how to use these server actions:

- `/app/examples/page.tsx` - Index of example pages
- `/app/examples/blog-actions-example.tsx` - Blog management examples
- `/app/examples/permissions-actions-example.tsx` - Permissions management examples

> Note: These example pages should not be included in production builds.

## Best Practices

1. **Always Use Authorization Checks**  
   Even if a route is protected by middleware, include authorization checks in server actions for defense in depth.

2. **Validate Input Data**  
   Use zod or another validation library to verify input data before processing.

3. **Handle Errors Gracefully**  
   Return meaningful error messages that don't expose sensitive information.

4. **Use Transactions for Complex Operations**  
   When an operation involves multiple database queries, use transactions to ensure consistency.

5. **Revalidate Paths**  
   Use `revalidatePath()` to refresh page data after mutations.

6. **Avoid Using Client Data on the Server**  
   Don't rely on client-provided data for authorization decisions.

7. **Keep Actions Focused**  
   Each action should perform a single, well-defined task.

## Extending the System

To add new server actions:

1. Create a new file in the `/app/actions/` directory
2. Import the necessary database functions and authorization utilities
3. Create async functions that include authorization checks
4. Implement proper error handling and data validation
5. Export the functions with descriptive names ending in "Action"
6. Update this documentation with the new actions