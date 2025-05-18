# Database Migration Documentation

This document provides details about the database configuration, connection methods, and schema updates.

## Database Connection

The application uses a PostgreSQL database hosted on Neon.tech. Below are the environment variables and connection methods used:

### Environment Variables

Add the following variables to your `.env.local` file:

```
# Recommended for most uses
DATABASE_URL=postgres://username:password@hostname/database?sslmode=require

# For uses requiring a connection without pgbouncer
DATABASE_URL_UNPOOLED=postgresql://username:password@hostname/database?sslmode=require
```

### Connection Methods

The application primarily uses the Neon serverless driver for database queries:

```javascript
import { neon } from "@neondatabase/serverless";

export async function getData() {
    const sql = neon(process.env.DATABASE_URL);
    const data = await sql`SELECT * FROM table_name;`;
    return data;
}
```

Other connection options include:

#### Using node-postgres

```javascript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function getData() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT * FROM table_name');
    return rows;
  } finally {
    client.release();
  }
}
```

#### Using postgres.js

```javascript
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, { ssl: 'verify-full' });
```

## Schema Updates (Phase 2)

The application has been enhanced with additional tables to support blog posts, prompt libraries, AI tools, and a comprehensive permissions system.

### New Tables Added

1. **Blog Posts (`blog_posts`)**
   - Store blog content with support for Notion integration
   - Supports tagging and categorization
   - Tracks metrics like view count

2. **Prompt Library (`prompts`)**
   - Stores AI prompts with categorization and versioning
   - Supports public/private visibility
   - Includes a related `user_saved_prompts` junction table for bookmarking

3. **AI Tools (`ai_tools`)**
   - Manages available AI tool definitions
   - Tracks API endpoints and metadata
   - Supports categorization for UI organization

4. **Role-Based Access Control**
   - Enhanced permissions system with:
     - Permissions table (`permissions`)
     - Roles table (`roles`)
     - Junction tables for role-permission and user-role relationships
     - Support for direct user permission overrides

### Applying Schema Updates

To apply these schema changes to your database, run:

```bash
node scripts/apply-db-updates.js
```

This script provides two methods:
1. Using the `psql` command-line tool (if installed)
2. Using the Neon serverless driver directly (fallback method)

The schema update SQL is located in `db-schema-updates.sql`.

### Data Models

TypeScript interfaces for these new entities are defined in:
- `types/blog.ts` - Blog post types
- `types/prompts.ts` - Prompt library types
- `types/tools.ts` - AI tools types
- `types/permissions.ts` - Permissions and roles types

Database access functions are implemented in:
- `lib/db-blog.ts` - Blog post data access
- `lib/db-prompts.ts` - Prompt library data access
- `lib/db-tools.ts` - AI tools data access
- `lib/db-permissions.ts` - Permissions system data access